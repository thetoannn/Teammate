import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAvatarUrl } from "../hooks/useAvatarUrl";
import { useTransformedTokenHistory } from "../hooks/useTokenHistory";
import { useTransformedTokenOverview } from "../hooks/useTokenOverview";


interface HistoryData {
  id: string;
  date: string;
  type: string;
  typeColor: string;
  credits: string;
  details: string;
  balance: string;
}

const ProfileAccountHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { avatarUrl } = useAvatarUrl(user?.picture);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // API integration using the new hooks
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useTransformedTokenHistory({
    PageNumber: currentPage,
    PageSize: itemsPerPage,
    enabled: isAuthenticated,
  });

  // Token overview API integration
  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
  } = useTransformedTokenOverview({
    enabled: isAuthenticated,
  });

  const historyData = apiResponse?.data?.items || [];
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

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-[#1A1A1A] text-white relative overflow-hidden h-full">
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
                className="text-[#4374FF] hover:text-[#5A7FFF] text-sm font-semibold transition-colors cursor-pointer   "
              >
                Nạp thêm Credits
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="flex justify-between mb-5">
            <div className="bg-[#2A2A2A] rounded-2xl p-5 pt-3  max-w-[289px] max-h-[115px]">
              <div className="flex items-center space-x-3 mb-2">
                <img src="/icon-61.svg" alt="" />
                <div className="flex-col ml-4">
                  <span className="text-white text-[16px]">
                    Tổng số Credits đã nạp
                  </span>
                  <div className="text-2xl font-bold text-[#16A34A] mb-1">
                    <div className="animate-pulse bg-gray-600 h-8 w-24 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="text-white/50 text-xs">
                <div className="animate-pulse bg-gray-600 h-3 w-32 rounded"></div>
              </div>
            </div>

            <div className="bg-[#2A2A2A] rounded-2xl p-5 pt-3  max-w-[289px] max-h-[115px]">
              <div className="flex items-center space-x-3 mb-2">
                <img src="/icon-75.svg" alt="" />
                <div className="flex-col ml-4">
                  <span className="text-white text-[16px]">
                    Tổng Credits đã sử dụng
                  </span>
                  <div className="text-2xl font-bold text-[#DC2626] mb-1">
                    <div className="animate-pulse bg-gray-600 h-8 w-24 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="text-white/50 text-xs">
                <div className="animate-pulse bg-gray-600 h-3 w-32 rounded"></div>
              </div>
            </div>

            <div className="bg-[#2A2A2A] rounded-2xl p-5 pt-3  max-w-[289px] max-h-[115px]">
              <div className="flex items-center space-x-3 mb-2">
                <img src="/icon-62.svg" alt="" />
                <div className="flex-col ml-4">
                  <span className="text-white text-[16px]">
                    Số dư Credits hiện tại
                  </span>
                  <div className="text-2xl font-bold text-[#FAC400] mb-1">
                    <div className="animate-pulse bg-gray-600 h-8 w-24 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="text-white/50 text-xs">
                <div className="animate-pulse bg-gray-600 h-3 w-32 rounded"></div>
              </div>
            </div>
          </div>

          <div
            className="backdrop-blur-sm 
            overflow-hidden"
          >
            <div className="bg-[#2A2A2A] px-6 py-2 sticky top-0 z-10">
              <div className="grid grid-cols-[100px_120px_80px_1fr_80px] gap-4 text-sm font-medium text-white">
                <div>Thời gian</div>
                <div>Loại biến động</div>
                <div>Số Credits</div>
                <div>Chi tiết</div>
                <div className="text-right">Số dư</div>
              </div>
            </div>

            <div
              className="divide-y divide-white/10 flex items-center justify-center"
              style={{ height: "320px" }}
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

  // Error state
  if (isError) {
    return (
      <div className="bg-[#1A1A1A] text-white relative overflow-hidden h-200">
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
              <button className="pb-3 text-white font-semibold cursor-pointer">
                Lịch Sử
              </button>
              <button
                onClick={() => navigate("/profile-account-payment")}
                className="pb-3 text-white/40  font-semibold cursor-pointer hover:text-white transition-colors"
              >
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
            </div>
          </div>

          {/* Stats Cards */}
          <div className="flex justify-between mb-5">
            <div className="bg-[#2A2A2A] rounded-2xl p-5 pt-3  max-w-[289px] max-h-[115px]">
              <div className="flex items-center space-x-3 mb-2">
                <img src="/icon-61.svg" alt="" />
                <div className="flex-col ml-4">
                  <span className="text-white text-[16px]">
                    Tổng số Credits đã nạp
                  </span>
                  <div className="text-2xl font-bold text-[#16A34A] mb-1">
                    0
                  </div>
                </div>
              </div>
              <div className="text-white/50 text-xs">Cập nhật: N/A</div>
            </div>

            <div className="bg-[#2A2A2A] rounded-2xl p-5 pt-3  max-w-[289px] max-h-[115px]">
              <div className="flex items-center space-x-3 mb-2">
                <img src="/icon-75.svg" alt="" />
                <div className="flex-col ml-4">
                  <span className="text-white text-[16px]">
                    Tổng Credits đã sử dụng
                  </span>
                  <div className="text-2xl font-bold  text-[#DC2626] mb-1">0</div>
                </div>
              </div>
              <div className="text-white/50 text-xs">Cập nhật: N/A</div>
            </div>

            <div className="bg-[#2A2A2A] rounded-2xl p-5 pt-3  max-w-[289px] max-h-[115px]">
              <div className="flex items-center space-x-3 mb-2">
                <img src="/icon-62.svg" alt="" />
                <div className="flex-col ml-4">
                  <span className="text-white text-[16px]">
                    Số dư Credits hiện tại
                  </span>
                  <div className="text-2xl font-bold text-[#FAC400] mb-1">
                    0
                  </div>
                </div>
              </div>
              <div className="text-white/50 text-xs">Cập nhật: N/A</div>
            </div>
          </div>

          <div className="">
            <div
              className="divide-y divide-white/10 flex items-center justify-center"
              style={{ height: "320px" }}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="text-red-500 text-4xl">⚠️</div>
                <p className="text-white/60 text-center">
                  Không thể tải dữ liệu lịch sử
                </p>
                <p className="text-white/40 text-sm text-center">
                  {error?.message || "Đã xảy ra lỗi khi tải dữ liệu"}
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-[#4374FF] hover:bg-[#5A7FFF] text-white rounded-lg transition-colors"
                >
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    );
  }

  // Empty state
  if (
    (historyData.length === 0 || totalCount === 0) &&
    !isLoading &&
    !isError
  ) {
    return (
      <div className="bg-[#1A1A1A] text-white relative overflow-hidden h-200">
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
              <button className="pb-3 text-white  font-semibold cursor-pointer">
                Lịch Sử
              </button>
              <button
                onClick={() => navigate("/profile-account-payment")}
                className="pb-3 text-white/40  font-semibold cursor-pointer hover:text-white transition-colors"
              >
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
            </div>
          </div>

          {/* Stats Cards */}
          <div className="flex justify-between mb-5">
            <div className="bg-[#2A2A2A] rounded-2xl p-5 pt-3  max-w-[289px] max-h-[115px]">
              <div className="flex items-center space-x-3 mb-2">
                <img src="/icon-61.svg" alt="" />
                <div className="flex-col ml-4">
                  <span className="text-white text-[16px]">
                    Tổng số Credits đã nạp
                  </span>
                  <div className="text-2xl font-bold text-[#16A34A] mb-1">
                    0
                  </div>
                </div>
              </div>
              <div className="text-white/50 text-xs">Cập nhật: N/A</div>
            </div>

            <div className="bg-[#2A2A2A] rounded-2xl p-5 pt-3  max-w-[289px] max-h-[115px]">
              <div className="flex items-center space-x-3 mb-2">
                <img src="/icon-75.svg" alt="" />
                <div className="flex-col ml-4">
                  <span className="text-white text-[16px]">
                    Tổng Credits đã sử dụng
                  </span>
                  <div className="text-2xl font-bold  text-[#DC2626] mb-1">0</div>
                </div>
              </div>
              <div className="text-white/50 text-xs">Cập nhật: N/A</div>
            </div>

            <div className="bg-[#2A2A2A] rounded-2xl p-5 pt-3  max-w-[289px] max-h-[115px]">
              <div className="flex items-center space-x-3 mb-2">
                <img src="/icon-62.svg" alt="" />
                <div className="flex-col ml-4">
                  <span className="text-white text-[16px]">
                    Số dư Credits hiện tại
                  </span>
                  <div className="text-2xl font-bold text-[#FAC400] mb-1">
                    0
                  </div>
                </div>
              </div>
              <div className="text-white/50 text-xs">Cập nhật: N/A</div>
            </div>
          </div>

          <div className="">
            <div
              className="divide-y divide-white/10 flex items-center justify-center"
              style={{ height: "320px" }}
            >
              <div className="flex flex-col items-center  ">
                <img src="/icon-nodata.svg" alt="" />

                <p className="text-white text-sm  flex flex-col items-center mr-4">
                  Bạn chưa có lịch sử Credits
                </p>
                <p className="text-white/40 text-sm  flex flex-col items-center mr-4">
                  Hãy trải nghiệm cùng các AI Agent và quay lại sau nhé !
                </p>
              </div>
            </div>
          </div>
        </div>
        
   
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] text-white relative overflow-hidden h-200">
      {/* Back button */}
      <Link to="/">
        <button className="mt-6 ml-5 text-white/60 hover:text-white flex rounded-xl items-center transition-colors bg-[#FFFFFF]/5 p-2 hover:scale-[1.05] cursor-pointer hover:bg-[#FFFFFF]/20">
          <img src="/icon-up-left.svg" alt="" />
        </button>
      </Link>

      <div className="relative z-10 p-5 max-w-4xl mx-auto">
        {/* Header with stats */}
        <div className="flex justify-between items-center mb-6">
          <nav className="flex space-x-12 text-base">
            <button
              onClick={() => navigate("/profile-account")}
              className="pb-3 text-white/40 font-medium cursor-pointer hover:text-white transition-colors"
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
              className="pb-3 text-white font-medium cursor-pointer"
            >
              Lịch Sử
            </button>
            <button
              onClick={() => navigate("/profile-account-payment")}
              className="pb-3 text-white/40 font-medium cursor-pointer hover:text-white transition-colors"
            >
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
          </div>
        </div>

        {/* Stats Cards */}
        <div className="flex justify-between  mb-5">
          <div className="bg-[#2A2A2A] rounded-2xl p-5 pt-3   max-w-[289px] max-h-[115px]">
            <div className="flex items-center space-x-3 mb-2">
              <img src="/icon-61.svg" alt="" />
              <div className="flex-col ml-4 ">
                <span className="text-white text-[16px]">
                  Tổng số Credits đã nạp
                </span>
                <div className="text-2xl font-bold text-[#16A34A] mb-1">
                  {isOverviewLoading ? (
                    <div className="animate-pulse bg-gray-600 h-8 w-24 rounded"></div>
                  ) : isOverviewError ? (
                    "N/A"
                  ) : (
                    overviewData?.totalPurchased?.value || "0"
                  )}
                </div>
              </div>
            </div>

            <div className="text-white/50 text-xs">
              {isOverviewLoading ? (
                <div className="animate-pulse bg-gray-600 h-3 w-32 rounded"></div>
              ) : isOverviewError ? (
                "Cập nhật: N/A"
              ) : (
                overviewData?.totalPurchased?.lastUpdate || "Cập nhật: N/A"
              )}
            </div>
          </div>

          <div className="bg-[#2A2A2A] rounded-2xl p-5 pt-3  max-w-[289px] max-h-[115px]">
            <div className="flex items-center space-x-3 mb-2">
              <img src="/icon-75.svg" alt="" />
              <div className="flex-col ml-4 ">
                <span className="text-white  text-[16px]">
                  Tổng Credits đã sử dụng
                </span>
                <div className="text-2xl font-bold  text-[#DC2626] mb-1">
                  {isOverviewLoading ? (
                    <div className="animate-pulse bg-gray-600 h-8 w-24 rounded"></div>
                  ) : isOverviewError ? (
                    "N/A"
                  ) : (
                    overviewData?.totalUsed?.value || "0"
                  )}
                </div>
              </div>
            </div>

            <div className="text-white/50 text-xs">
              {isOverviewLoading ? (
                <div className="animate-pulse bg-gray-600 h-3 w-32 rounded"></div>
              ) : isOverviewError ? (
                "Cập nhật: N/A"
              ) : (
                overviewData?.totalUsed?.lastUpdate || "Cập nhật: N/A"
              )}
            </div>
          </div>

          <div className="bg-[#2A2A2A] rounded-2xl p-5 pt-3  max-w-[289px] max-h-[115px]">
            <div className="flex items-center space-x-3 mb-2">
              <img src="/icon-62.svg" alt="" />
              <div className="flex-col ml-4 ">
                <span className="text-white text-[16px]">
                  Số dư Credits hiện tại
                </span>
                <div className="text-2xl font-bold text-[#FAC400] mb-1">
                  {isOverviewLoading ? (
                    <div className="animate-pulse bg-gray-600 h-8 w-24 rounded"></div>
                  ) : isOverviewError ? (
                    "N/A"
                  ) : (
                    overviewData?.currentBalance?.value || "0"
                  )}
                </div>
              </div>
            </div>

            <div className="text-white/50 text-xs">
              {isOverviewLoading ? (
                <div className="animate-pulse bg-gray-600 h-3 w-32 rounded"></div>
              ) : isOverviewError ? (
                "Cập nhật: N/A"
              ) : (
                overviewData?.currentBalance?.lastUpdate || "Cập nhật: N/A"
              )}
            </div>
          </div>
        </div>

        <div className="backdrop-blur-sm   overflow-hidden mb-3">
          <div className="bg-[#2A2A2A] px-6 py-2 sticky top-0 z-10">
            <div className="grid grid-cols-[100px_120px_80px_1fr_95px] gap-4   text-sm font-medium text-white">
              <div>Thời gian</div>
              <div>Loại biến động</div>
              <div>Số Credits</div>
              <div className="ml-5">Chi tiết</div>
            <div className="flex gap-[2px] items-center">
                <div>Số dư</div>
                <div className="text-xs text-[#4374FF]">(Credits)</div>
            </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="" style={{ height: "420px", overflowY: "auto" }}>
            {historyData.map((history: HistoryData) => (
              <div
                key={history.id}
                className="px-6 py-2 hover:bg-white/5 transition-colors flex items-center"
              >
                <div className="grid grid-cols-[100px_120px_80px_1fr_85px] gap-4 items-center text-sm w-full">
                  <div className="text-white truncate">{history.date}</div>
                  <div className="truncate">
                    <span className={`${history.typeColor} font-medium`}>
                      {history.type}
                    </span>
                  </div>
                  <div className="text-white font-medium truncate">
                    {history.credits}
                  </div>
                  <div className="text-white break-words overflow-hidden ml-5">
                    {history.details}
                  </div>
                  <div className="text-white   font-medium text-;eft truncate">
                    {history.balance}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-4 pb-8">
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
      
 
    </div>
  );
};

export default ProfileAccountHistoryPage;
