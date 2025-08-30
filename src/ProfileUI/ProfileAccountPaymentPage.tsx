import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAvatarUrl } from "../hooks/useAvatarUrl";
import { useTransformedUserPlan } from "../hooks/useUserPlan";
import InvoiceDetailModal from "./Modal/InvoiceDetailModalNew";

interface PaymentData {
  id: string;
  date: string;
  invoiceNumber: string;
  status: string;
  statusColor: string;
  details: string;
  amount: string;
  rawAmount: number;
  action: string;
  originalData: any;
}

const ProfileAccountPaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { avatarUrl } = useAvatarUrl(user?.picture);

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<PaymentData | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useTransformedUserPlan({
    pageNumber: currentPage,
    pageSize: itemsPerPage,
    enabled: isAuthenticated,
  });

  const paymentData = apiResponse?.data?.items || [];
  const totalPages = apiResponse?.data?.totalPages || 1;
  const totalCount = apiResponse?.data?.totalCount || 0;
  const hasNextPage = apiResponse?.data?.hasNextPage || false;
  const hasPreviousPage = apiResponse?.data?.hasPreviousPage || false;

  const handlePreviousPage = () => {
    if (hasPreviousPage && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleViewInvoice = (payment: PaymentData) => {
    setSelectedInvoice(payment);
    setIsInvoiceModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="h-full bg-[#1A1A1A] text-white relative overflow-hidden">
        <Link to="/">
          <button className="mt-6 ml-5 text-white/60 hover:text-white flex rounded-xl items-center transition-colors bg-[#FFFFFF]/5 p-2 hover:scale-[1.05] cursor-pointer hover:bg-[#FFFFFF]/20">
            <img src="/icon-up-left.svg" alt="" />
          </button>
        </Link>

        <div className="relative z-10 p-5 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <Link to="/profile-account"> 
                     <button className="pb-3   font-semibold cursor-pointer">
                       Tài Khoản
                     </button>
                     </Link>
                     <Link to="/profile-account-history"> 
                     <button
                      
                       className="pb-3 text-white/40  font-semibold cursor-pointer hover:text-white transition-colors"
                     >
                       Lịch Sử
                     </button>
                     </Link>
                  <Link to="/profile-account-payment">    <button
                       
                       className="pb-3 text-white/40  font-semibold cursor-pointer hover:text-white transition-colors"
                     >
                       Thanh Toán
                     </button></Link>
            <div className="space-x-8">
              <button
                onClick={() =>
                  navigate("/profile-account?openCreditModal=true")
                }
                className="text-[#4374FF] hover:text-[#5A7FFF] text-sm font-semibold transition-colors cursor-pointer"
              >
                Nạp thêm Credits
              </button>
              <button
                onClick={() => navigate("/update-package-month")}
                className="bg-[#4A5CF7] px-4 py-2 hover:bg-[#3B4AE6] text-white text-[14px] rounded-xl transition-colors cursor-pointer"
                style={{
                  background:
                    "linear-gradient(to right, #2563EB 0%, #153885 100%)",
                }}
              >
                Nâng cấp ngay
              </button>
            </div>
          </div>

          <div className="backdrop-blur-sm   overflow-hidden">
            <div className="bg-[#2A2A2A] px-6 py-2 sticky top-0 z-10">
              <div className="grid grid-cols-6 gap-4 text-sm  text-white">
                <div>Thời gian</div>
                <div>Số hóa đơn</div>
                <div>Trạng thái</div>
                <div>Chi tiết</div>
                <div>Số tiền</div>
                <div>Hành động</div>
              </div>
            </div>

            <div
              className="divide-y divide-white/10 flex items-center justify-center"
              style={{ height: "450px" }}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4374FF]"></div>
                <p className="text-white/60">Đang tải dữ liệu...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white relative overflow-hidden">
        <Link to="/">
          <button className="mt-6 ml-5 text-white/60 hover:text-white flex rounded-xl items-center transition-colors bg-[#FFFFFF]/5 p-2 hover:scale-[1.05] cursor-pointer hover:bg-[#FFFFFF]/20">
            <img src="/icon-up-left.svg" alt="" />
          </button>
        </Link>

        <div className="relative z-10 p-5 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <nav className="flex space-x-12 text-base">
              <button
                onClick={() => navigate("/profile-account")}
                className="pb-3 text-white/40  font-semibold cursor-pointer hover:text-white transition-colors"
              >
                Tài Khoản
              </button>
              <button
                onClick={() => {
                  console.log(
                    "🔍 Lịch Sử button clicked, navigating to /profile-account-history"
                  );
                  try {
                    navigate("/profile-account-history");
                  } catch (error) {
                    window.location.href = "/profile-account-history";
                  }
                }}
                className="pb-3 text-white/40  font-semibold cursor-pointer hover:text-white transition-colors"
              >
                Lịch Sử
              </button>
              <button className="pb-3 text-white font-semibold cursor-pointer">
                Thanh Toán
              </button>
            </nav>
            <div className="space-x-8">
              <button
                onClick={() =>
                  navigate("/profile-account?openCreditModal=true")
                }
                className="text-[#4374FF] hover:text-[#5A7FFF] text-sm font-semibold transition-colors cursor-pointer"
              >
                Nạp thêm Credits
              </button>
              <button
                onClick={() => navigate("/update-package-month")}
                className="bg-[#4A5CF7] px-4 py-2 hover:bg-[#3B4AE6] text-white text-[14px] rounded-xl transition-colors cursor-pointer"
                style={{
                  background:
                    "linear-gradient(to right, #2563EB 0%, #153885 100%)",
                }}
              >
                Nâng cấp ngay
              </button>
            </div>
          </div>

          <div className="  overflow-hidden">
         
   <div
              className="divide-y divide-white/10 flex items-center justify-center"
              style={{ height: "450px" }}
            >
              <div className="flex flex-col items-center ">
                  <img src="/icon-nodata.svg" alt="" />

                <p className="text-white  text-sm text-center mr-4">
                  Bạn chưa có lịch sử thanh toán
                </p>
                <p className="text-white/40  text-sm text-center mr-4">
                  Hãy trải nghiệm cùng các AI Agent và quay lại sau nhé !
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (
    (paymentData.length === 0 || totalCount === 0) &&
    !isLoading &&
    !isError
  ) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] text-white relative overflow-hidden">
        <Link to="/">
          <button className="mt-6 ml-5 text-white/60 hover:text-white flex rounded-xl items-center transition-colors bg-[#FFFFFF]/5 p-2 hover:scale-[1.05] cursor-pointer hover:bg-[#FFFFFF]/20">
            <img src="/icon-up-left.svg" alt="" />
          </button>
        </Link>

        <div className="relative z-10 p-5 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <nav className="flex space-x-12 text-base">
              <button
                onClick={() => navigate("/profile-account")}
                className="pb-3 text-white/40  font-semibold cursor-pointer hover:text-white transition-colors"
              >
                Tài Khoản
              </button>
              <button
                onClick={() => {
                  console.log(
                    "🔍 Lịch Sử button clicked, navigating to /profile-account-history"
                  );
                  try {
                    navigate("/profile-account-history");
                  } catch (error) {
                    window.location.href = "/profile-account-history";
                  }
                }}
                className="pb-3 text-white/40  font-semibold cursor-pointer hover:text-white transition-colors"
              >
                Lịch Sử
              </button>
              <button className="pb-3 text-white  font-semibold cursor-pointer">
                Thanh Toán
              </button>
            </nav>
            <div className="space-x-8">
              <button
                onClick={() =>
                  navigate("/profile-account?openCreditModal=true")
                }
                className="text-[#4374FF] hover:text-[#5A7FFF] text-sm font-semibold transition-colors cursor-pointer"
              >
                Nạp thêm Credits
              </button>
              <button
                onClick={() => navigate("/update-package-month")}
                className="bg-[#4A5CF7] px-4 py-2 hover:bg-[#3B4AE6] text-white text-[14px] rounded-xl transition-colors cursor-pointer"
                style={{
                  background:
                    "linear-gradient(to right, #2563EB 0%, #153885 100%)",
                }}
              >
                Nâng cấp ngay
              </button>
            </div>
          </div>

          <div className="backdrop-blur-sm   overflow-hidden">
            <div className="bg-[#2A2A2A] px-6 py-4 sticky top-0 z-10">
              <div className="grid grid-cols-6 gap-4 text-sm  text-white">
                <div>Thời gian</div>
                <div>Số hóa đơn</div>
                <div>Trạng thái</div>
                <div>Chi tiết</div>
                <div>Số tiền</div>
                <div>Hành động</div>
              </div>
            </div>

            <div
              className="divide-y divide-white/10 flex items-center justify-center"
              style={{ height: "450px" }}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="text-white/40 text-4xl">📄</div>

                <p className="text-white/40 text-sm text-center">
                  Bạn chưa có giao dịch thanh toán nào
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white relative overflow-hidden">
      {/* Back button */}
      <Link to="/">
        <button className="mt-6 ml-5 text-white/60 hover:text-white flex rounded-xl items-center transition-colors bg-[#FFFFFF]/5 p-2 hover:scale-[1.05] cursor-pointer hover:bg-[#FFFFFF]/20">
          <img src="/icon-up-left.svg" alt="" />
        </button>
      </Link>

      <div className="relative z-10 p-5 max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="flex justify-between items-center mb-6">
          <nav className="flex space-x-12 text-base">
            <button
              onClick={() => navigate("/profile-account")}
              className="pb-3 text-white/40  font-semibold cursor-pointer hover:text-white transition-colors"
            >
              Tài Khoản
            </button>
            <button
              onClick={() => {
                console.log(
                  "🔍 Lịch Sử button clicked, navigating to /profile-account-history"
                );
                try {
                  navigate("/profile-account-history");
                } catch (error) {
                  window.location.href = "/profile-account-history";
                }
              }}
              className="pb-3 text-white/40  font-semibold cursor-pointer hover:text-white transition-colors"
            >
              Lịch Sử
            </button>
            <button className="pb-3 text-white  font-semibold cursor-pointer">
              Thanh Toán
            </button>
          </nav>
          <div className="space-x-8">
            <button
              onClick={() => navigate("/profile-account?openCreditModal=true")}
              className="text-[#4374FF] hover:text-[#5A7FFF] text-sm font-semibold transition-colors cursor-pointer"
            >
              Nạp thêm Credits
            </button>
            <button
              onClick={() => navigate("/update-package-month")}
              className="bg-[#4A5CF7] px-4 py-2 hover:bg-[#3B4AE6] text-white text-[14px] rounded-xl transition-colors cursor-pointer"
              style={{
                background:
                  "linear-gradient(to right, #2563EB 0%, #153885 100%)",
              }}
            >
              Nâng cấp ngay
            </button>
          </div>
        </div>

        <div className="backdrop-blur-sm   overflow-hidden">
          <div className="bg-[#2A2A2A] px-6 py-2 sticky top-0 z-10">
            <div className="grid grid-cols-6 gap-4 text-sm  text-white">
              <div>Thời gian</div>
              <div>Số hóa đơn</div>
              <div>Trạng thái</div>
              <div>Chi tiết</div>
              <div>Số tiền</div>
              <div>Hành động</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="" style={{ height: "543px", overflowY: "auto" }}>
            {paymentData.map((payment: PaymentData) => (
              <div
                key={payment.id}
                className="px-6 py-2 hover:bg-white/5 transition-colors flex items-center"
              >
                <div className="grid grid-cols-6 gap-4 items-center text-sm w-full">
                  <div className="text-white">{payment.date}</div>
                  <div className="text-white uppercase">
                    {payment.invoiceNumber}
                  </div>
                  <div>
                    <span
                      className={`px-0 py-1 rounded text-[14px] ${
                        payment.status === "PENDING_PAYMENT"
                          ? "text-[#F43939]"
                          : payment.status === "SUCCESS"
                            ? "text-[#4374FF]"
                            : "text-[#4374FF]"
                      }`}
                    >
                      {payment.status === "PENDING_PAYMENT"
                        ? "Chưa thanh toán"
                        : payment.status === "SUCCESS"
                          ? "Thành công"  
                          : payment.status}
                    </span>
                  </div>
                  <div className="text-white">{payment.details}</div>
                  <div className="text-white font-medium">
                    {payment.amount}
                  </div>
                  <div>
                    <button
                      onClick={() => handleViewInvoice(payment)}
                      className="text-[14px] transition-colors font-semibold cursor-pointer hover:opacity-80"
                      style={{
                        background:
                          "linear-gradient(135deg, #DB2777 0%, #751540 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {payment.action}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={!hasPreviousPage}
            className={!hasPreviousPage ? "opacity-50 cursor-not-allowed" : ""}
          >
            <img className="cursor-pointer" src="/icon-next-p.svg" alt="" />
          </button>
          <span className="text-white/60 text-sm">
            Trang {currentPage}/{totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={!hasNextPage}
            className={!hasNextPage ? "opacity-50 cursor-not-allowed" : ""}
          >
            <img className="cursor-pointer" src="/icon-next-p-r.svg" alt="" />
          </button>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      <InvoiceDetailModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        invoiceData={
          selectedInvoice
            ? {
                invoiceNumber: selectedInvoice.invoiceNumber,
                date: selectedInvoice.date,
                status: selectedInvoice.status,
                amount: selectedInvoice.amount,
                details: selectedInvoice.details,
              }
            : undefined
        }
      />
    </div>
  );
};

export default ProfileAccountPaymentPage;
