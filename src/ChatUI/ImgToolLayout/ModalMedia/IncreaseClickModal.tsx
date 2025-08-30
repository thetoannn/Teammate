import React, { useState, useEffect } from "react";

interface IncreaseClickModalProps {
  isOpen: boolean;
  onClose: () => void;
  onObjectiveSelect?: (objective: string) => void;
}

const IncreaseClickModal: React.FC<IncreaseClickModalProps> = ({
  isOpen,
  onClose,
  onObjectiveSelect,
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
      id: "tang-click",
      label: "Tăng click",
      isSelected: selectedOption === "Tăng click",
    },
    {
      id: "chot-don",
      label: "Chốt đơn",
      isSelected: selectedOption === "Chốt đơn",
    },
    {
      id: "thu-lead",
      label: "Thu lead",
      isSelected: selectedOption === "Thu lead",
    },
    {
      id: "tang-nhan-dien",
      label: "Tăng nhận diện",
      isSelected: selectedOption === "Tăng nhận diện",
    },
  ];

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
    if (onObjectiveSelect) {
      onObjectiveSelect(option);
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
                  ? " text-white"
                  : "text-white hover:bg-blue-500"
              }
            `}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{option.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IncreaseClickModal;
