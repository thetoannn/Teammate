import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useAvatarUrl } from "../hooks/useAvatarUrl";
import { useCurrentPlanName } from "../hooks/useCurrentPlan";
import { useTransformedTokenOverview } from "../hooks/useTokenOverview";

const TokenHeaderDis = () => {
  const [isOpen, setIsOpen] = useState(false);
  const tokenRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user } = useAuth();
  const { avatarUrl } = useAvatarUrl(user?.picture);
  const { planName, isLoading: planLoading } = useCurrentPlanName();
  const navigate = useNavigate();

  // Token overview API integration
  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
  } = useTransformedTokenOverview({
    enabled: isAuthenticated,
  });

  const toggleForm = () => {
    setIsOpen(!isOpen);
  };

  const handleCreditClick = () => {
    setIsOpen(false);
    navigate("/profile-account?openCreditModal=true");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tokenRef.current &&
        !tokenRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative group" ref={tokenRef}>
      <button
        onClick={toggleForm}
        className="bg-[#4374FF]/5 flex items-center space-x-2 border border-[#4374FF]/20 rounded-2xl px-3 py-1 cursor-pointer hover:bg-white/5 transition-colors"
      >
        <img src="/icon-bolt.svg" alt="Token" className="w-4 h-4" />
        <span className="text-white text-sm font-medium">
          {isOverviewLoading
            ? "..."
            : isOverviewError
            ? "0"
            : overviewData?.currentBalance?.value || "0"}
        </span>
      </button>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
        Total Token
      </div>

      <div
        className={`absolute right-2 mt-1 w-[280px] h-[180px] bg-[#313131]  rounded-[20px] shadow-lg z-30 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="p-3">
          <div className="flex items-center mb-1">
            {isAuthenticated && user ? (
              avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : user.email
                    ? user.email.charAt(0).toUpperCase()
                    : "U"}
                </div>
              )
            ) : (
              <img src="/icon-avatar-user-df.svg" alt="" />
            )}

            <div className="flex-1">
              <div className="flex justify-end mb-1">
                <p
                  className={`text-[#4374FF] text-xs bg-[#FFFFFF]/10 ${
                    planName === "Ultimate" ? "w-14" : "w-11"
                  } py-[2px] text-center rounded-xl`}
                >
                  {planLoading ? "..." : planName || "Plus"}
                </p>
              </div>
              <div className="flex justify-end mb-1">
                <p className="text-white text-sm font-medium">
                  {isAuthenticated && user
                    ? user.email
                    : "example.email@gmail.com"}
                </p>
              </div>
              <div className="flex justify-end">
                <Link to="/update-package-month">
                  <button
                    className="bg-[#4A5CF7] w-[150px] h-[30px] hover:bg-[#3B4AE6] text-white text-xs px-3 py-1 rounded-[8px] mt-1 transition-colors cursor-pointer"
                    style={{
                      background:
                        "linear-gradient(to right, #2563EB 0%, #153885 100%)",
                    }}
                  >
                    Nâng cấp ngay
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="p-3 pl-0">
            <div className="flex items-center space-x-2 mb-[0.9px]">
              <img src="/icon-bolt.svg" alt="Token" className="w-4 h-4" />
              <span className="text-white/80 text-sm">Credits khả dụng:</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white text-lg ml-7">
                {isOverviewLoading
                  ? "..."
                  : isOverviewError
                  ? "0"
                  : overviewData?.currentBalance?.value || "0"}
              </span>
              <div className="">
                <button
                  onClick={handleCreditClick}
                  className="text-[#4374FF] hover:text-[#3B4AE6] text-[14.5px] font-medium transition-colors ml-5 text-nowrap cursor-pointer"
                >
                  Nạp thêm Credits
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenHeaderDis;
