import React, { useState, useLayoutEffect } from "react";

interface DataAnalysisSlideFormProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
  onSendMessage?: (message: string) => void;
}

const DataAnalysisSlideForm: React.FC<DataAnalysisSlideFormProps> = ({
  isOpen,
  onClose,
  buttonRef,
  onSendMessage,
}) => {
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (isOpen && buttonRef?.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: buttonRect.top + window.scrollY - 2,
        left: buttonRect.left + buttonRect.width / 2.2,
      });
    } else {
      setPosition(null);
    }
  }, [isOpen, buttonRef]);

  if (!isOpen || !position) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 transition-opacity duration-300 ease-in-out pointer-events-auto"
        onClick={onClose}
      />
      <div
        className="absolute bg-[#3D3939] rounded-xl shadow-2xl transition-all duration-200 ease-in-out pointer-events-auto p-2"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: "translateX(-50%) translateY(-100%)",
          minWidth: "200px",
        }}
      >
        <div className="p-0">
          <div className="space-y-0 text-nowrap">
            <button
              className="block w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-2"
              onClick={() => {
                if (onSendMessage) {
                  onSendMessage(
                    "Tôi muốn phân tích Job - Pain - Gain của khách hàng"
                  );
                }
                onClose();
              }}
            >
              <img
                src="/icon-greenan.png"
                alt="Job Pain Gain"
                className="h-4 w-4"
              />
              <span>Job - Pain - Gain</span>
            </button>
            <button
              className="block w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-2"
              onClick={() => {
                if (onSendMessage) {
                  onSendMessage("Tôi muốn phân tích đối thủ cạnh tranh");
                }
                onClose();
              }}
            >
              <img
                src="/icon-bluean.png"
                alt="Competitor"
                className="h-4 w-4"
              />
              <span>Đối thủ cạnh tranh</span>
            </button>
            <button
              className="block w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-2"
              onClick={() => {
                if (onSendMessage) {
                  onSendMessage("Tôi muốn tìm hiểu từ khóa nổi bật");
                }
                onClose();
              }}
            >
              <img src="/icon-hotword.png" alt="Keywords" className="h-4 w-4" />
              <span>Từ khóa nổi bật</span>
            </button>
            <button
              className="block w-full text-left px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-2"
              onClick={() => {
                if (onSendMessage) {
                  onSendMessage("Tôi muốn tìm hiểu xu hướng nổi bật");
                }
                onClose();
              }}
            >
              <img src="/icon-tea.png" alt="Trends" className="h-4 w-4" />
              <span>Xu hướng nổi bật</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataAnalysisSlideForm;
