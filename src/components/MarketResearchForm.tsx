import React, { useState, useLayoutEffect, useEffect } from "react";

const iconEye = "/icon-eye.png";
const iconRestart = "/icon-restart.png";

interface MarketResearchFormProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
  onSendMessage?: (message: string) => void;
}

const MarketResearchForm: React.FC<MarketResearchFormProps> = ({
  isOpen,
  onClose,
  buttonRef,
  onSendMessage,
}) => {
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const updatePosition = () => {
    if (isOpen && buttonRef?.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: buttonRect.top + window.scrollY - 2,
        left: buttonRect.left + buttonRect.width / 2.4,
      });
    }
  };

  useLayoutEffect(() => {
    updatePosition();
  }, [isOpen, buttonRef]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }
  }, [isOpen]);

  if (!isOpen || !position) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 transition-opacity duration-300 ease-in-out"
        onClick={onClose}
      />
      <div
        className="absolute bg-[#3D3939] rounded-xl shadow-2xl transition-all duration-200 ease-in-out p-2"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: "translateX(-50%) translateY(-100%)",
          minWidth: "100px",
        }}
      >
        <div className="p-0">
          <div className="space-y-1 text-nowrap">
            <button
              className="w-full text-left text-xs px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              onClick={() => {
                if (onSendMessage) {
                  onSendMessage("Tôi muốn xem báo cáo nghiên cứu thị trường");
                }
                onClose();
              }}
            >
              <img src={iconEye} alt="View" className="h-4 w-4" />
              <span>Xem báo cáo </span>
            </button>
            <button
              className="w-full text-left text-xs px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
              onClick={() => {
                if (onSendMessage) {
                  onSendMessage(
                    "Tôi muốn cập nhật báo cáo nghiên cứu thị trường"
                  );
                }
                onClose();
              }}
            >
              <img src={iconRestart} alt="Update" className="h-4 w-4" />
              <span>Cập nhật báo cáo </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketResearchForm;
