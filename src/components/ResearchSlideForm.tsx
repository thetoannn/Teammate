import React, { useState, useLayoutEffect } from "react";

interface ResearchSlideFormProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
  onToolSelect?: (
    tool: "market-research" | "customer-profile" | "data-analysis" | "default"
  ) => void;
  currentSelection?: {
    icon?: string;
    text: string;
    type: string;
  } | null;
}

const ResearchSlideForm: React.FC<ResearchSlideFormProps> = ({
  isOpen,
  onClose,
  buttonRef,
  onToolSelect,
  currentSelection,
}) => {
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (isOpen && buttonRef?.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();

      let leftOffset;
      if (!currentSelection || currentSelection.type === "default") {
        leftOffset = buttonRect.left + buttonRect.width / 2 + 68;
      } else {
        leftOffset = buttonRect.left + buttonRect.width / 2;
      }

      setPosition({
        top: buttonRect.top + window.scrollY - 1,
        left: leftOffset,
      });
    } else {
      setPosition(null);
    }
  }, [isOpen, buttonRef, currentSelection]);

  if (!isOpen || !position) return null;

  const showMarketResearch =
    !currentSelection || currentSelection.type !== "market-research";
  const showCustomerProfile =
    !currentSelection || currentSelection.type !== "customer-profile";
  const showDataAnalysis =
    !currentSelection || currentSelection.type !== "data-analysis";
  const showDefault = currentSelection && currentSelection.type !== "default";

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 transition-opacity duration-300 ease-in-out pointer-events-auto "
        onClick={onClose}
      />
      <div
        className="absolute bg-[#3D3939] rounded-xl shadow-2xl transition-all duration-200 ease-in-out pointer-events-auto p-2"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: "translateX(-50%) translateY(-100%)",
          minWidth: "80px",
        }}
      >
        <div className="p-0">
          <div className="space-y-0 text-nowrap">
            {showDefault && (
              <div className="relative group">
                <button
                  className="w-full text-left text-xs px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    if (onToolSelect) {
                      onToolSelect("default");
                    }
                    onClose();
                  }}
                >
                  <img src="/icon-idea.png" alt="Default" className="h-4 w-4" />
                  <span>Công cụ</span>
                </button>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                  Chọn công cụ mặc định
                </div>
              </div>
            )}
            {showMarketResearch && (
              <div className="relative group">
                <button
                  className="w-full text-left text-xs px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    if (onToolSelect) {
                      onToolSelect("market-research");
                    }
                    onClose();
                  }}
                >
                  <img
                    src="/icon-trend-topic.png"
                    alt="Market Research"
                    className="h-4 w-4"
                  />
                  <span>Dữ liệu nghiên cứu thị trường</span>
                </button>
              </div>
            )}
            {showCustomerProfile && (
              <div className="relative group">
                <button
                  className="w-full text-left text-xs px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    if (onToolSelect) {
                      onToolSelect("customer-profile");
                    }
                    onClose();
                  }}
                >
                  <img
                    src="/icon-profile-customer.png"
                    alt="Customer Profile"
                    className="h-4 w-4"
                  />
                  <span>Hồ sơ khách hàng của bạn</span>
                </button>
              </div>
            )}
            {showDataAnalysis && (
              <div className="relative group">
                <button
                  className="w-full text-left text-xs px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                  onClick={() => {
                    if (onToolSelect) {
                      onToolSelect("data-analysis");
                    }
                    onClose();
                  }}
                >
                  <img
                    src="/icon-dongho.png"
                    alt="Data Analysis"
                    className="h-4 w-4"
                  />
                  <span>Tìm kiếm phân tích dữ liệu thực</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchSlideForm;
