import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import EditProfileModal from "./Modal/EditProfileModal";
import CreditPurchaseModal from "./Modal/CreditPurchaseModal";
import { useAuth } from "../hooks/useAuth";
import { useAvatarUrl } from "../hooks/useAvatarUrl";
import { useTransformedTokenOverview } from "../hooks/useTokenOverview";
import { useCurrentPlanName } from "../hooks/useCurrentPlan";
import googleAuthService from "../services/GoogleAuthService";
import axios from "axios";

const ProfileAccountPage: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  // Get current plan information
  const { planName, isLoading: planLoading } = useCurrentPlanName();

  // Memoize avatar path to prevent unnecessary re-fetching
  const avatarPath = useMemo(() => user?.picture, [user?.picture]);
  const {
    avatarUrl,
    loading: avatarLoading,
    error: avatarError,
  } = useAvatarUrl(avatarPath);

  // Token overview API integration
  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
  } = useTransformedTokenOverview({
    enabled: isAuthenticated,
  });

  // Memoize avatar fallback to prevent re-computation
  const avatarFallback = useMemo(() => {
    if (!isAuthenticated || !user) return "U";
    return user.name
      ? user.name.charAt(0).toUpperCase()
      : user.email
      ? user.email.charAt(0).toUpperCase()
      : "U";
  }, [isAuthenticated, user]);

  // Debug avatar loading
  useEffect(() => {
    console.log("🔍 ProfileAccountPage Avatar Debug:", {
      userPicture: user?.picture,
      avatarUrl,
      avatarLoading,
      avatarError,
      isAuthenticated,
    });
  }, [user?.picture, avatarUrl, avatarLoading, avatarError, isAuthenticated]);

  const location = useLocation();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("openCreditModal") === "true") {
      setIsCreditModalOpen(true);

      searchParams.delete("openCreditModal");
      const newSearch = searchParams.toString();
      const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ""}`;
      navigate(newUrl, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = await googleAuthService.getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "https://api.nhansuso.vn/api/user-profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setProfileData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setLoading(false);
    }
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleProfileUpdated = () => {
    console.log("🔄 Profile updated, refreshing data...");

    if (isAuthenticated) {
      fetchUserProfile();
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white relative overflow-hidden">
      <Link to="/">
        <button className="mt-6 ml-5 text-white/60 hover:text-white flex rounded-xl items-center transition-colors bg-[#FFFFFF]/5 p-2 hover:scale-[1.05] cursor-pointer hover:bg-[#FFFFFF]/20">
          <img src="/icon-up-left.svg" alt="" />
        </button>
      </Link>
      <div className="relative z-10 p-5 max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="flex space-x-12 mb-5 text-base">
           <Link to="/profile-account"> 
          <button className="pb-3  font-semibold cursor-pointer">
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
            
            className="pb-3 text-white/40 font-semibold cursor-pointer hover:text-white transition-colors"
          >
            Thanh Toán
          </button></Link>
        </div>

        {/* User info section */}
        <div className="flex items-center justify-between mb-10 border rounded-xl -b border-white/10 p-4">
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              // Prioritize avatar display - show avatar immediately if available, fallback only when truly needed
              avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    console.log("❌ Avatar failed to load:", avatarUrl);
                    // If avatar fails to load, hide it and show fallback
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                // Only show fallback when no avatar URL is available
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                  {avatarFallback}
                  {avatarLoading && (
                    <div className="absolute inset-0 w-16 h-16 rounded-full bg-black/20 flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              )
            ) : (
              <img
                src="/icon-avatar-user-df.svg"
                alt="User Avatar"
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">
                {(() => {
                  console.log("🔍 ProfileAccountPage Debug:", {
                    isAuthenticated,
                    user,
                    profileData,
                    userName: user?.name,
                    profileName: profileData?.name,
                  });

                  if (!isAuthenticated || !user) {
                    return "Nguyễn Văn A";
                  }

                  if (
                    profileData?.data?.name &&
                    profileData.data.name.trim() !== ""
                  ) {
                    return profileData.data.name;
                  }

                  if (
                    user.name &&
                    user.name.trim() !== "" &&
                    user.name !== user.email
                  ) {
                    return user.name;
                  }

                  return "Nguyễn Văn A";
                })()}
              </h2>
              <p className="text-white/60 text-sm">
                {isAuthenticated && user
                  ? user.email
                  : "example.email@gmail.com"}
              </p>
            </div>
          </div>
          <div className="flex  space-x-6 mr-4">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className=" flex w-auto pt-[12px] pb-[10px] bg-white/10 hover:bg-white/15 text-white rounded-[9px] p-2 cursor-pointer space-x-2 "
            >
              <img className="w-4 h-4  " src="/icon-regis.svg" alt="" />{" "}
              <span className="text-xs  ">Sửa thông tin</span>
            </button>
            <button
              onClick={logout}
              className=" flex w-auto pt-[12px] pb-[10px] border-white/5 border hover:bg-white/15 text-white rounded-[9px] p-2 cursor-pointer space-x-2 "
            >
              <img className="w-4 h-4  " src="/icon-logout2.svg" alt="" />{" "}
              <span className="text-xs  ">Đăng xuất</span>
            </button>
          </div>
        </div>

        <div className="relative">
          <div className=" backdrop-blur-sm rounded-2xl p-8 border border-white/10 ">
            <div
              className="flex justify-between 
            "
            >
              <div className="flex-1 max-w-2xl">
                <h3 className="text-[17px]   mb-8 text-white">
                  Thông tin tài khoản
                </h3>

                <div className="space-y-4 mb-8 mt-9">
                  <div className="flex items-center space-x-30">
                    <span className="text-white/70 text-[14.8px]">
                      Loại tài khoản:
                    </span>
                    <p
                      className={`text-[#4374FF] text-xs bg-[#FFFFFF]/10 ${
                        planName === "Ultimate" ? "w-14" : "w-11"
                      } py-[2px] text-center rounded-xl`}
                    >
                      {planLoading ? "..." : planName || "Plus"}
                    </p>
                  </div>

                  <div className="flex items-center space-x-11">
                    <span className="text-white/70 text-[14.8px]">
                      Thời điểm gia hạn kế tiếp:{" "}
                    </span>
                    <span className="text-[#DB2777] font-semibold">
                      28/09/2025
                    </span>
                  </div>

                  <div className="flex items-center space-x-[13.8px]  mb-1">
                    <span className="text-white/70 text-[13.8px]">
                      Tổng số lượng Credits khả dụng:{" "}
                    </span>
                    <span className="text-white/90 font-base">
                      {isOverviewLoading ? (
                        <div className="animate-pulse bg-gray-600 h-5 w-20 rounded inline-block"></div>
                      ) : isOverviewError ? (
                        "0"
                      ) : (
                        overviewData?.currentBalance?.value || "0"
                      )}
                    </span>
                  </div>

                  <div className="space-y-1  text-white/40 ml-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-white/90 rounded-full"></div>
                      <div className="flex items-center space-x-[69px] ">
                        <span className="text-sm">Theo gói tài khoản: </span>
                        <span className="text-white/50 font-base">
                          {isOverviewLoading ? (
                            <div className="animate-pulse bg-gray-600 h-4 w-16 rounded inline-block"></div>
                          ) : isOverviewError ? (
                            "0"
                          ) : (
                            overviewData?.totalPurchased?.value || "0"
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-white/90 rounded-full"></div>
                      <div className="flex items-center space-x-[55px] ">
                        <span className="text-sm">Tặng mới hằng ngày: </span>
                        <span className="text-white/50 font-base">0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-col   space-y-6  ">
                <button
                  onClick={() => setIsCreditModalOpen(true)}
                  className="text-[#4374FF] hover:text-[#5A7FFF] text-sm font-semibold transition-colors cursor-pointer mr-5"
                >
                  Nạp thêm Credits
                </button>
                <button
                  onClick={() => navigate("/update-package-month")}
                  className="bg-[#4A5CF7] text-nowrap !px-[8px] w-auto h-[35px] hover:bg-[#3B4AE6] text-white text-[14px] rounded-xl mt-1 transition-colors cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(to right, #2563EB 0%, #153885 100%)",
                  }}
                >
                  Nâng cấp ngay
                </button>

                <div className=" w-50">
                  <img
                    src="/icon-plastic.svg"
                    alt="Decorative abstract"
                    className="w-full h-full object-contain select-none opacity-90"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onProfileUpdated={handleProfileUpdated}
      />

      <CreditPurchaseModal
        isOpen={isCreditModalOpen}
        onClose={() => setIsCreditModalOpen(false)}
      />
    </div>
  );
};

export default ProfileAccountPage;
