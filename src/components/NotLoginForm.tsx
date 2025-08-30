import React from "react";
import LanguageSelector from "./LangueSelector";
import { useAuth } from "../hooks/useAuth";
import { useAvatarUrl } from "../hooks/useAvatarUrl";
import { useCurrentPlanName } from "../hooks/useCurrentPlan";
import { Link } from "react-router-dom";

const NotLoginForm: React.FC = () => {
  const { isAuthenticated, user, loading, error, login, logout } = useAuth();
  const { avatarUrl } = useAvatarUrl(user?.picture);
  const { planName, isLoading: planLoading } = useCurrentPlanName();

  if (isAuthenticated && user) {
    return (
      <div className="fixed left-[55px] bottom-[13px] w-[280px] bg-[#3D3939] text-white p-4 shadow-lg z-10 animate-slideRight rounded-[20px] !z-100">
        <div className="flex flex-col space-y-4 h-full">
          <div className="flex items-center space-x-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
                onError={(e) => {
                  // Fallback to user initials if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 mb-3">
                {user.name
                  ? user.name.charAt(0).toUpperCase()
                  : user.email
                  ? user.email.charAt(0).toUpperCase()
                  : "U"}
              </div>
            )}

            <div className="flex-1 grid grid-cols-1 gap-2 mt-1">
              <div className="flex justify-end">
                <p
                  className={`text-[#4374FF] text-xs bg-[#FFFFFF]/10 ${
                    planName === "Ultimate" ? "w-14" : "w-11"
                  } py-[2px] text-center rounded-xl`}
                >
                  {planLoading ? "..." : planName || "Plus"}
                </p>
              </div>

              <p className="text-white text-sm font-medium leading-tight truncate flex justify-end">
                {user.email}
              </p>

              <div className="flex justify-end">
                <Link to="/update-package-month">
                  <button
                    className="text-white py-2 px-4 rounded-xl text-sm  hover:opacity-90 transition-all cursor-pointer"
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

          <div className="border-t border-[#FFFFFF]/5"></div>

          <Link to="/profile-account">
            <button className="flex items-center space-x-1 cursor-pointer hover:text-blue-400 transition-colors">
              <img src="/icon-bill.svg" alt="" className="w-5 h-5" />
              <span className="text-sm">Tài khoản & Thanh toán</span>
            </button>
          </Link>

          <LanguageSelector />

          <div className="border-t border-[#FFFFFF]/5"></div>

          <button
            onClick={logout}
            disabled={loading}
            className="flex items-center space-x-1 text-white hover:text-red-600 transition-colors font-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <img src="/icon-logoit.svg" alt="" className="w-5 h-5" />
            <span className="text-sm">
              {loading ? "Đang đăng xuất..." : "Đăng xuất"}
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed left-[63px] bottom-[13px] w-[230px] h-[255px] bg-[#3D3939] text-white p-4 shadow-lg z-10 animate-slideRight rounded-[20px]">
      <div className="flex flex-col space-y-4 h-full">
        <LanguageSelector />
        <div className="border-t border-[#FFFFFF]/5"></div>

        <button
          onClick={() => {
            console.log("🔘 Button clicked - calling login()");
            login();
          }}
          className="flex items-center space-x-2 cursor-pointer hover:text-pink-400 transition-colors"
        >
          <img src="icon-im.svg" alt="" />
          <span className="text-sm">Đăng nhập</span>
        </button>

        <button
          onClick={() => {
            console.log("🔘 Button clicked - calling login()");
            login();
          }}
          className="text-white py-2 px-4 rounded-xl text-sm font-bold hover:opacity-90 transition-all w-full cursor-pointer"
          style={{
            background: "linear-gradient(to right, #2563EB 0%, #153885 100%)",
          }}
        >
          Đăng ký miễn phí
        </button>

        <button
          onClick={() => {
            login();
          }}
          className="bg-white flex items-center justify-center gap-1 border text-black font-bold py-2 px-4 rounded-xl text-sm hover:bg-gray-100 transition-colors w-full cursor-pointer"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="w-4 h-4"
          />
          <span>Đăng ký bằng Google</span>
        </button>

        {error && (
          <div className="text-red-400 text-xs text-center">{error}</div>
        )}
      </div>
    </div>
  );
};

export default NotLoginForm;
