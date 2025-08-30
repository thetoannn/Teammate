import React, { FC } from "react";

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationModal: FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-[#3D3939] rounded-xl p-6 w-120 max-w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-lg font-semibold">Thông báo</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <p className="text-white/90 text-sm leading-relaxed">
            Số sự Credit của bạn chỉ còn 10,000 Credit, để tránh gián đoạn các
            chiến dịch Marketing vui lòng bổ sung thêm Credit để Agentic hoạt
            động tốt nhất!
          </p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="cursor-pointer px-6 py-2 rounded-xl bg-[#6C6969] hover:bg-[#7A7A73] text-white transition-colors text-sm font-medium"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
