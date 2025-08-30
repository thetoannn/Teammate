import React, { useState, useEffect } from "react";

interface TargetAudienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTargetAudienceSelect?: (targetAudience: string) => void;
}

const TargetAudienceModal: React.FC<TargetAudienceModalProps> = ({
  isOpen,
  onClose,
  onTargetAudienceSelect,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  // Reset selection when modal is reopened
  useEffect(() => {
    if (isOpen) {
      setSelectedOption("");
    }
  }, [isOpen]);

  const options = [
    {
      id: "gen-z",
      label: "Gen Z",
      isSelected: selectedOption === "Gen Z",
    },
    {
      id: "gen-y",
      label: "Gen Y",
      isSelected: selectedOption === "Gen Y",
    },
    {
      id: "noi-tro",
      label: "Nội trợ",
      isSelected: selectedOption === "Nội trợ",
    },
    {
      id: "doanh-nhan",
      label: "Doanh nhân",
      isSelected: selectedOption === "Doanh nhân",
    },
    {
      id: "hoc-sinh-sv",
      label: "Học sinh/SV",
      isSelected: selectedOption === "Học sinh/SV",
    },
    {
      id: "khac",
      label: "Khác",
      isSelected: selectedOption === "Khác",
    },
  ];

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    if (onTargetAudienceSelect) {
      onTargetAudienceSelect(option);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-[#3D3939] rounded-xl w-[240px] max-w-sm h-fit">
      <div className="p-2 space-y-2">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => handleOptionSelect(option.label)}
            className={`
              w-full p-1 px-3 rounded-[11px] cursor-pointer transition-all duration-200 
              ${
                option.isSelected
                  ? "bg-blue-500 text-white"
                  : "text-white hover:bg-blue-500"
              }
            `}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{option.label}</span>
              {option.isSelected && (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TargetAudienceModal;
