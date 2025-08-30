import React, { useState, useEffect } from "react";

interface RatioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRatioSelect?: (ratio: string) => void;
}

const RatioModal: React.FC<RatioModalProps> = ({
  isOpen,
  onClose,
  onRatioSelect,
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
      id: "fb-ig-feed",
      label: "FB/IG feed 4:5",
      isSelected: selectedOption === "FB/IG feed 4:5",
    },
    {
      id: "story",
      label: "Story 9:16",
      isSelected: selectedOption === "Story 9:16",
    },
    {
      id: "grid",
      label: "Grid 1:1",
      isSelected: selectedOption === "Grid 1:1",
    },
    {
      id: "banner",
      label: "Banner 16:9",
      isSelected: selectedOption === "Banner 16:9",
    },
  ];

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    if (onRatioSelect) {
      onRatioSelect(option);
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

export default RatioModal;
