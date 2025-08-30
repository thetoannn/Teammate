import React, { useState, useEffect } from "react";
import googleAuthService from "../services/GoogleAuthService";
import Loading from "../components/shared/Loading";

interface NotYetLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string; // Optional prop to specify which feature requires login
}

const NotYetLogModal: React.FC<NotYetLogModalProps> = ({
  isOpen,
  onClose,
  feature = "AI features",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const authState = googleAuthService.getState();
      setIsAuthenticated(authState.isAuthenticated);

      const unsubscribe = googleAuthService.subscribe((state) => {
        setIsAuthenticated(state.isAuthenticated);
        setIsLoading(state.loading);

        // Auto-close modal if user successfully logs in
        if (state.isAuthenticated && !state.loading) {
          onClose();
        }
      });

      return unsubscribe;
    }
  }, [isOpen, onClose]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await googleAuthService.loginWithGoogle();
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Đăng nhập thất bại. Vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setIsLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-8   right-4 z-50">
      <div className="bg-[#3D3939] rounded-2xl w-[280px] shadow-2xl border border-white/10">
        <div className="px-4 pb-4 pt-3">
          <div className="text-center ">
            <div className="flex justify-center">
              <img
                src="/icon-ai-notlogin.svg"
                alt="AI Login Required"
                className="w-25 h-25"
              />
            </div>

            {/* Title and Description */}
            <div className="space-y-1">
              <h2 className="text-white text-sm font-semibold">
                Mở khóa Team <br></br>Marketing Agent của <br></br> bạn và hơn
                thế
              </h2>
              <p className="text-white/70 text-xs leading-relaxed mb-1">
                Truy cập không giới hạn tất cả công<br></br>cụ AI Marketing
              </p>
            </div>

            <div className="">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading || isAuthenticated}
                className="text-white py-2 px-4 rounded-xl text-sm font-bold hover:opacity-90 transition-all w-full cursor-pointer mb-2"
                style={{
                  background:
                    "linear-gradient(to right, #2563EB 0%, #153885 100%)",
                }}
              >
                {isLoading ? (
                  <>
                    <Loading type="spinner" size="sm" />
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng ký miễn phí</span>
                  </>
                )}
              </button>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading || isAuthenticated}
                className="w-full bg-[#FFFFFF] hover:bg-gray-100  cursor-pointer text-black font-bold  py-2 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2 text-sm"
              >
                {isLoading ? (
                  <>
                    <Loading type="spinner" size="sm" />
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  <>
                    <img
                      src="https://www.google.com/favicon.ico"
                      alt="Google"
                      className="w-4 h-4"
                    />
                    <span>Đăng ký với Google</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                <p className="text-red-300 text-xs">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotYetLogModal;
