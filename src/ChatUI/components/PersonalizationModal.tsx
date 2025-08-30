import React, { FC, useState } from "react";

interface PersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (nickname: string, personality: string, traits: string[]) => void;
}

const PersonalizationModal: FC<PersonalizationModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [nickname, setNickname] = useState("");
  const [personality, setPersonality] = useState("");
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  const personalityTraits = [
    "Ngay thẳng",
    "Hóm hỉnh",
    "Cẩn trọng",
    "Sáng tạo",
    "Hoài nghi",
    "Thế hệ Z",
    "Nghiêm túc",
  ];

  const toggleTrait = (trait: string) => {
    setSelectedTraits((prev) =>
      prev.includes(trait) ? prev.filter((t) => t !== trait) : [...prev, trait]
    );
  };

  const handleSave = () => {
    onSave(nickname, personality, selectedTraits);
    onClose();
  };

  const handleCancel = () => {
    setNickname("");
    setPersonality("");
    setSelectedTraits([]);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/50"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-[#3D3939] rounded-xl p-6 w-[500px] max-w-full mx-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-white text-lg font-base ">Cá nhân hóa</h2>

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
        <div className="border-t  border-[#FFFFFF]/5 mb-6"></div>
        <div className="mb-6">
          <label className="text-white text-sm font-medium mb-3 block">
            TeamMATE nên gọi bạn là gì?
          </label>
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-[#474343] text-white border border-[#FFFFFF]/5 focus:outline-none focus:border-gray-500 placeholder-gray-400"
            placeholder="Biệt danh"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="text-white text-sm font-medium mb-3 block">
            TeamMATE nên có các tính cách gì?
          </label>
          <textarea
            className="w-full p-3 rounded-lg bg-[#474343] text-white border border-[#FFFFFF]/5 focus:outline-none focus:border-gray-500 placeholder-gray-400 resize-none"
            placeholder="Mô tả tính cách"
            rows={3}
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
          />
        </div>

        <div className="ml-4 mb-8 ">
          <div className="space-y-2">
            {/* First row */}
            <div className="flex flex-wrap gap-2">
              {personalityTraits.slice(0, 4).map((trait) => (
                <button
                  key={trait}
                  onClick={() => toggleTrait(trait)}
                  className={`px-3 py-1 rounded-[10px] border-dashed border-[1.2px] border-[#FFFFFF]/10 text-sm transition-colors cursor-pointer  ${
                    selectedTraits.includes(trait)
                      ? "bg-blue-600 text-white"
                      : "bg-[#474343] text-gray-300 hover:bg-[#5A5A5A]"
                  }`}
                >
                  + {trait}
                </button>
              ))}
            </div>
            {/* Second row - indented */}
            <div className="flex flex-wrap gap-2 ml-12">
              {personalityTraits.slice(4).map((trait) => (
                <button
                  key={trait}
                  onClick={() => toggleTrait(trait)}
                  className={`px-3 py-1 rounded-[10px] border-dashed border-[1.2px] border-[#FFFFFF]/10 text-sm transition-colors cursor-pointer  ${
                    selectedTraits.includes(trait)
                      ? "bg-blue-600 text-white"
                      : "bg-[#474343] text-gray-300 hover:bg-[#5A5A5A]"
                  }`}
                >
                  + {trait}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-6 py-2 rounded-xl bg-transparent  text-gray-300 hover:bg-gray-700 transition-colors text-sm font-medium cursor-pointer  "
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSave}
            className="px-9 py-0 rounded-xl bg-[#6C6969] hover:bg-[#7A7A73] text-white transition-colors text-sm font-medium cursor-pointer"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizationModal;
