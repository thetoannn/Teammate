  import React, { useState, useEffect } from "react";
import Stepper, { Step } from "./Stepper";
import {
  postSubscriptionPurchase,
  pollingSubscriptionOrderStatus,
  getSubscriptionPackages,
  SubscriptionQrData,
  SubscriptionPackage,
} from "../../services/subscriptionPurchase";
import QRCode from "qrcode";
import Loading from "../../components/shared/Loading";
import StringUtils from "../../utils/StringUtils";
import googleAuthService from "../../services/GoogleAuthService";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(
    "3months"
  );
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(true);
  const [qrData, setQrData] = useState<SubscriptionQrData | null>(null);
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [countdown, setCountdown] = useState(300); // 5 minutes = 300 seconds
  const [countdownActive, setCountdownActive] = useState(false);

  const packages = getSubscriptionPackages();

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    setQrData(null);
    setQrCodeDataURL("");
    setError(null);
    setRetryCount(0);
  };

  const getSelectedPackage = (): SubscriptionPackage | undefined => {
    return packages.find((pkg) => pkg.id === selectedPackage);
  };

  const retrySubscriptionPurchase = async () => {
    if (!selectedPackage) return;

    setError(null);
    setIsLoading(true);
    setRetryCount((prev) => prev + 1);

    try {
      console.log(
        `🔄 Retrying subscription purchase (attempt ${retryCount + 1})`
      );
      const res = await postSubscriptionPurchase({
        subscriptionPackageId: selectedPackage,
      });

      if (!res.data) {
        throw new Error("Không nhận được dữ liệu thanh toán từ server");
      }

      setQrData(res);
      setError(null);

      const orderId = res.data?.orderId || "";
      if (StringUtils.isNotEmptyString(orderId)) {
        startPollingOrderStatus(orderId);
      } else {
        throw new Error("Không nhận được mã đơn hàng");
      }
    } catch (err) {
      console.error("❌ Subscription purchase retry failed:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Có lỗi xảy ra khi xử lý thanh toán";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const startPollingOrderStatus = (orderId: string) => {
    console.log("🔍 Starting polling for subscription order:", orderId);

    // Start the countdown timer
    setCountdown(300); // Reset to 5 minutes
    setCountdownActive(true);

    const interval = setInterval(async () => {
      try {
        console.log("🔄 Polling subscription order status...");
        const response = await pollingSubscriptionOrderStatus(orderId);

        console.log("📊 Polling response:", response);

        const status = response.data.status;
        console.log("🔍 Current status:", status);

        if (
          status === "SUCCESS" ||
          status === "COMPLETED" ||
          status === "PAID"
        ) {
          console.log("✅ Payment successful! Moving to step 3");
          clearInterval(interval);
          setCountdownActive(false);
          setCurrentStep(3);
          setIsPaymentProcessing(false);
        } else if (status === "FAILED" || status === "CANCELLED") {
          console.log("❌ Payment failed or cancelled");
          clearInterval(interval);
          setCountdownActive(false);
          setError(`Thanh toán thất bại: ${status}`);
          setIsPaymentProcessing(false);
        } else if (status === "PENDING_PAYMENT" || status === "PENDING") {
          console.log(`⏳ Payment still pending: ${status}`);
        } else {
          console.log(`🔍 Unknown status: ${status}, continuing to poll...`);
        }
      } catch (err) {
        console.error("❌ Polling subscription order status failed:", err);
        // Don't stop polling on individual request failures
        // The timeout will handle overall failure
      }
    }, 3000);

    // Set timeout for 10 minutes
    const timeoutId = setTimeout(() => {
      clearInterval(interval);
      setCountdownActive(false);
      console.warn("⚠️ Polling timeout reached after 10 minutes");
      setError(
        "Hết thời gian chờ. Vui lòng kiểm tra lại trạng thái thanh toán."
      );
      setIsPaymentProcessing(false);
    }, 600000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
      setCountdownActive(false);
    };
  };

  useEffect(() => {
    if (isOpen) {
      setAuthLoading(true);
      const authState = googleAuthService.getState();
      setIsAuthenticated(authState.isAuthenticated);
      setAuthLoading(false);

      const unsubscribe = googleAuthService.subscribe((state) => {
        setIsAuthenticated(state.isAuthenticated);
        setAuthLoading(state.loading);
      });

      return unsubscribe;
    }
  }, [isOpen]);

  useEffect(() => {
    if (currentStep === 2 && selectedPackage && !qrData && isAuthenticated) {
      setError(null);
      setIsLoading(true);
      setRetryCount(0);

      console.log(
        "🔍 Debug: Starting subscription purchase with package:",
        selectedPackage
      );

      postSubscriptionPurchase({ subscriptionPackageId: selectedPackage })
        .then((res) => {
          if (!res.data) {
            throw new Error("Không nhận được dữ liệu thanh toán từ server");
          }

          console.log("✅ Subscription purchase successful:", res.data);
          setQrData(res);
          setError(null);

          const orderId = res.data?.orderId || "";
          if (StringUtils.isNotEmptyString(orderId)) {
            startPollingOrderStatus(orderId);
          } else {
            console.warn("⚠️ No order ID received, but showing payment info");
          }
        })
        .catch((err) => {
          console.error("❌ Subscription purchase failed:", err);
          console.error("❌ Error details:", {
            message: err.message,
            selectedPackage,
            errorType: typeof err,
            stack: err.stack,
          });

          let errorMessage = "Có lỗi xảy ra khi xử lý thanh toán";

          if (err instanceof Error) {
            if (err.message.includes("SUBSCRIPTION_PACKAGE_NOT_FOUND")) {
              errorMessage = `Gói đăng ký không tồn tại: "${selectedPackage}". Vui lòng chọn gói khác hoặc liên hệ hỗ trợ.`;
            } else if (err.message.includes("Invalid package ID")) {
              errorMessage = `ID gói không hợp lệ: "${selectedPackage}". Các gói hợp lệ: 1month, 3months, 12months`;
            } else if (err.message.includes("validation")) {
              errorMessage = `Lỗi xác thực: ${err.message}`;
            } else {
              errorMessage = err.message;
            }
          }

          setError(errorMessage);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (currentStep === 2 && !isAuthenticated && !authLoading) {
      setError("Bạn cần đăng nhập để thực hiện thanh toán");
      setIsLoading(false);
    }
  }, [currentStep, selectedPackage, isAuthenticated, authLoading]);

  useEffect(() => {
    if (qrData?.data?.qrCode) {
      setIsLoading(true);
      QRCode.toDataURL(qrData.data.qrCode, {
        width: 128,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
        .then((url) => {
          setIsLoading(false);
          setQrCodeDataURL(url);
        })
        .catch((err) => {
          console.error("Error generating QR code:", err);
          setIsLoading(false);
        });
    }
  }, [qrData?.data?.qrCode]);

  // Countdown timer effect
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (countdownActive && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCountdownActive(false);
            setError("Hết thời gian chờ. Vui lòng kiểm tra lại trạng thái thanh toán.");
            setIsPaymentProcessing(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [countdownActive, countdown]);

  // Format countdown time to MM:SS
  const formatCountdown = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStepChange = (step: number) => {
    console.log("Step change requested:", step);
    // Only allow step changes for steps 1 and 2
    // Step 3 should only be accessible via successful payment
    if (step <= 2) {
      setCurrentStep(step);
      if (step === 1) {
        setQrData(null);
        setQrCodeDataURL("");
        setError(null);
        setRetryCount(0);
        setIsPaymentProcessing(true);
        setCountdownActive(false);
        setCountdown(300);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-hidden ">
      <div className="bg-[#3D3939] rounded-2xl w-full max-w-[566px]">
        {/* Header */}
        <div className="flex items-center justify-end px-6 py-0 pt-3 ">
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-6 pt-2 pb-3 ">
          <Stepper
            initialStep={1}
            currentStep={currentStep}
            onStepChange={handleStepChange}
            onFinalStepCompleted={() => {
              console.log("Subscription payment completed!");
            }}
            backButtonText={(currentStep) =>
              currentStep === 1 ? "Hủy bỏ" : currentStep === 2 ? "Hủy thanh toán" : ""
            }
            nextButtonText={(currentStep) => 
              currentStep === 2 ? "" : "Tiếp tục"
            }
            nextButtonProps={{
              disabled: !selectedPackage,
              style: { display: currentStep === 2 ? 'none' : 'block' }
            }}
            backButtonProps={{
              onClick: currentStep === 1 ? onClose : currentStep === 2 ? () => handleStepChange(1) : onClose,
              className: currentStep === 2 ? "px-5 py-1 rounded-[12px] bg-[#FFFFFF]/20 hover:bg-[#7B8290] text-white transition-colors cursor-pointer" : "px-5 py-1 rounded-[9px] text-white/70 hover:text-white transition-colors cursor-pointer"
            }}
            hideFooterOnStep={3}
            renderStepIndicator={({ step, currentStep, onStepClick }) => {
              const customStepLabels = ["Chọn chu kỳ", "Thanh toán", "Chờ xác nhận"];
              const status =
                currentStep === step
                  ? "active"
                  : currentStep < step
                  ? "inactive"
                  : "complete";

              const handleClick = () => {
                if (step === 3) return;
                if (step !== currentStep) onStepClick(step);
              };

              return (
                <div className="flex flex-col items-center">
                  <div
                    onClick={handleClick}
                    className={`relative outline-none focus:outline-none mb-1 pointer-events-none`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all duration-300 ${
                        status === "inactive"
                          ? "bg-white text-[#3D3939] scale-90"
                          : status === "active"
                          ? "bg-[#4374FF] text-[#3D3939] scale-90"
                          : "bg-[#4374FF] text-[#3D3939] scale-90"
                      }`}
                    >
                      {status === "complete" ? (
                        <svg
                          className="h-4 w-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <span className="text-sm">{step}</span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-sm whitespace-nowrap ${
                      status === "active" ? "text-white font-medium" : "text-white"
                    }`}
                  >
                    {customStepLabels[step - 1]}
                  </span>
                </div>
              );
            }}
          >
            {/* Step 1: Package Selection */}

            <Step>
              <div className="border-t border-[#FFFFFF]/5"></div>
              <div className="h-full flex flex-col mt-20">
                <div className="space-y-3 flex-1 ">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => handlePackageSelect(pkg.id)}
                      className={`relative border rounded-xl p-3 cursor-pointer transition-all ${
                        selectedPackage === pkg.id
                          ? "border-[#DB2777] bg-[#DB2777]/10 "
                          : "border-white/20 hover:border-white/30"
                      } ${pkg.isPopular ? "border-[#DB2777]" : ""}`}
                    >
                      {pkg.isPopular && (
                        <div className="absolute -top-3 left-3">
                          <span
                            className={
                              selectedPackage === "3months"
                                ? "bg-[#DB2777] text-white text-xs px-2 py-0.5 rounded-full"
                                : "bg-[#4374FF] text-white text-xs px-2 py-0.5 rounded-full"
                            }
                          >
                            Khuyến nghị
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium text-[15px] mb-1">
                            {pkg.title}
                          </h3>
                          <p className="text-white/70 text-sm">
                            {pkg.subtitle}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white text-[15px] font-semibold">
                            {pkg.price}
                          </p>
                          {pkg.originalPrice && (
                            <p className="text-[#4374FF] text-sm line-through">
                              {pkg.originalPrice}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Step>

            {/* Step 2: Payment Information */}
            <Step>
              <div className="h-full flex flex-col">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full mt-30">
                    <Loading type="spinner" size="lg" />
                    <div className="ml-4 text-white/70 text-sm">
                      Đang tải thông tin thanh toán...
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center space-y-3 mt-20 flex flex-col justify-center h-full">
                    <div className="flex items-center justify-center mx-auto mb-2">
                      <svg
                        className="w-12 h-12 text-red-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-white text-lg font-medium">
                      Có lỗi xảy ra
                    </h2>
                    <p className="text-white/70 text-sm max-w-md mx-auto px-4">
                      {error}
                    </p>
                    <div className="flex justify-center space-x-3 mt-4">
                      {error === "Bạn cần đăng nhập để thực hiện thanh toán" ? (
                        <>
                          <button
                            onClick={() => googleAuthService.loginWithGoogle()}
                            className="cursor-pointer px-3 py-1.5 bg-[#4285F4] hover:bg-[#4285F4]/80 text-white rounded-lg transition-colors flex items-center space-x-2 text-sm"
                          >
                            <svg className="w-3 h-3" viewBox="0 0 24 24">
                              <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              />
                              <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              />
                              <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              />
                              <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              />
                            </svg>
                            <span>Đăng nhập với Google</span>
                          </button>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                    {retryCount > 0 && (
                      <p className="text-white/50 text-xs">
                        Đã thử lại {retryCount} lần
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col overflow-hidden">
                  

                    <div className="flex-1  ">
                      {/* Main Content - QR Code and Payment Info Side by Side */}
                      <div className="flex gap-10  mt-2 items-center ">


                        {/* QR Code Section - Left Side */}
                        <div className="flex flex-col bg-[#FFFFFF]/5 w-60 pb-2   pt-5 items-center mb-10 rounded-3xl">
                          <div className="">
                            {qrCodeDataURL ? (
                              <img
                                src={qrCodeDataURL}
                                alt="QR Code thanh toán"
                                className="w-48 h-48"
                              />
                            ) : qrData?.data?.qrCode ? (
                              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                                <Loading type="spinner" size="sm" />
                              </div>
                            ) : (
                              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500 text-xs text-center">
                                Không có mã QR
                              </div>
                            )}
                          </div>
                          
                          {/* Payment Icons */}
                          <div className="flex items-center gap-2 mt-2">
                            <img 
                              src="/icon-vietqr.svg" 
                              alt="VietQR" 
                              className="h-6"
                            />
                            <img 
                              src="/icon-napas.svg" 
                              alt="NAPAS" 
                              className="h-6"
                            />
                          </div>
                          
                            
                        </div>
                        
                        
                        

                        {/* Payment Information Display - Right Side */}
                        <div className="flex-1 space-y-2 text-sm">
                          <div className="flex flex-col items-start">
                              <div className=" pt-3 overflow-hidden">
                      <div className="text-[#4374FF] mb-2 text-[24px] font-medium ">
                        Thông tin thanh toán
                      </div>
                    </div>       
                     
                            <span className="text-white/30 text-[12px]">
                              Tên tài khoản:
                            </span>
                            <span className="text-white font-medium text-[14px] uppercase">
                              {qrData?.data?.userBankName || "LOADING..."}
                            </span>
                          </div>

                          <div className="flex flex-col items-start">
                            <span className="text-white/30 text-[12px]">
                              Số tài khoản:
                            </span>
                            <span className="text-white font-medium text-sm font-mono">
                              {qrData?.data?.bankAccount || "LOADING..."}
                            </span>
                          </div>

                          <div className="flex flex-col items-start">
                            <span className="text-white/30 text-[12px]">
                              Ngân hàng:
                            </span>
                            <span className="text-white font-medium text-[14px] uppercase">
                              {qrData?.data?.bankName || "LOADING..."}
                            </span>
                          </div>

                          <div className="flex flex-col items-start">
                            <span className="text-white/30 text-[12px]">
                              Nội dung chuyển khoản:
                            </span>
                            <span className="text-white font-medium text-[14px] uppercase">
                              {qrData?.data?.content || "LOADING..."}
                            </span>
                          </div>

                          <div className="flex flex-col items-start">
                            <span className="text-white/30 text-[12px]">
                              Tổng tiền thanh toán:
                            </span>
                            <span className="text-white font-semibold text-sm">
                              {getSelectedPackage()?.price || "$48.9 USD"}
                            </span>
                          </div>
                        </div>
                      </div>
                        <div className="text-start relative bottom-[38px]">
                            <span className="text-[#FFFFFF]/50 text-xs">
                              [Quét để thanh toán nhanh]
                            </span>
                          </div>
                      
                      {/* Countdown Timer */}
                      {countdownActive && (
                        <div className="flex items-start gap-2 py-2 relative bottom-[30px]">
                          <img 
                            src="/icon-h-glass.svg" 
                            alt="Timer" 
                            className="w-5 h-5 text-white"
                            style={{
                              animation: countdownActive ? 'spin 3s linear infinite' : 'none'
                            }}
                          />
                          <span className="text-white text-sm font-medium">
                            Giao dịch hết hạn sau <span className="text-[#FF6B6B] ">{formatCountdown(countdown).split(':')[0]}</span> phút <span className="text-[#FF6B6B] font-semibold">{formatCountdown(countdown).split(':')[1]}</span> Giây
                          </span>
                        </div>
                      )}
                      
                      {/* System Info */}
                      <div className="flex gap-1 mt-3 relative bottom-[30px]">
                        <img src="/icon-systeminfo.svg" alt="" />
                        <span className="text-[#4374FF] text-xs">
                          Hệ thống sẽ tự động cập nhật khi bạn quét mã thanh toán hoàn tất !
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Step>

            {/* Step 3: Confirmation */}
            <Step>
              <div className="h-full flex flex-col justify-center">
                {isPaymentProcessing ? (
                  <div className="text-center space-y-4 mt-30">
                    <div className="flex items-center justify-center mx-auto ">
                      <img
                        src="/icon-h-glass.svg"
                        alt="Processing"
                        className="w-16 h-16"
                      />
                    </div>

                    <p className="text-white/70 text-sm">
                      Đang xử lý thanh toán của bạn...
                    </p>

                    {/* Close Button */}
                    <div className="mt-35 flex justify-end">
                      <button
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-xl bg-[#FFFFFF]/20 hover:bg-[#7B8290] text-white transition-colors cursor-pointer text-sm"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 mt-12">
                    <div className="flex items-center justify-center mx-auto mb-4">
                      <img
                        src="/icon-check-mark.svg"
                        alt="Success"
                        className="w-16 h-16"
                      />
                    </div>
                    <h2 className="text-white text-lg font-medium">
                      Xin chúc mừng!
                    </h2>
                    <p className="text-white/70 text-sm">
                      Bạn đã đăng ký thành công gói PLUS{" "}
                      {getSelectedPackage()?.duration}.
                    </p>
                    <p className="text-white/60 text-sm">
                      Gói đăng ký sẽ được kích hoạt trong vài phút.
                    </p>

                    {/* Done Button */}
                    <div className="mt-15 flex justify-end">
                      <button
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-xl bg-[#FFFFFF]/20 hover:bg-[#7B8290] text-white transition-colors cursor-pointer text-sm"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Step>
          </Stepper>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
