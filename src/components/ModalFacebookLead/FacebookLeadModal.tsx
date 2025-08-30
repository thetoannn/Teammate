import React, { FC } from "react";

interface FacebookLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: () => void;
  onAgree: () => void;
  onDiscuss: () => void;
}

const FacebookLeadModal: FC<FacebookLeadModalProps> = ({
  isOpen,
  onClose,
  onReject,
  onAgree,
  onDiscuss,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 ">
      <div className="bg-[#3D3939] rounded-xl p-6 w-130 max-w-full mx-4 ">
        <div className="flex items-center justify-between mb-6 ">
          <h2 className="text-white text-lg font-semibold ">Đề xuất</h2>
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

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <img src="/icon-facebook.png" alt="Facebook" className="w-8 h-8 " />
          </div>
          <span className="text-white font-medium">Facebook Lead Agent</span>
        </div>

        <div className="mb-6">
          <h3 className="text-white font-medium mb-3">Nội dung</h3>
          <div className="bg-[#474343] rounded-lg p-4">
            <p className="text-white/80 text-sm leading-relaxed">
              Tăng ngân sách cho chiến dịch áo thun nữ không cổ. Tăng thêm 20%
              ngân sách do Chiến dịch đang hoạt động hiệu quả
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onReject}
            className="px-5 py-2 rounded-xl bg-[#474343] text-red-500 hover:bg-red-500/10 transition-colors text-sm cursor-pointer"
          >
            Từ chối
          </button>
          <button
            onClick={onAgree}
            className="px-5 py-2 rounded-xl bg-[#474343] hover:bg-blue-400 text-blue-600 transition-colors text-sm cursor-pointer"
          >
            Đồng ý
          </button>
          <button
            onClick={onDiscuss}
            className="px-3 py-2 rounded-xl bg-[#646161] hover:bg-[#7A7A73] text-white transition-colors text-sm cursor-pointer"
          >
            Trao đổi thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacebookLeadModal;
