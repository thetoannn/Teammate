import React from "react";

interface ExpandArrowProps {
  onClick: () => void;
  isOpen?: boolean;
}

const KiExpandArrows: React.FC<ExpandArrowProps> = ({
  onClick,
  isOpen = false,
}) => {
  const title = isOpen ? "Close Table" : "Expand Table";

  return (
    <button
      className="block text-white flex justify-center items-center p-1 rounded-[12px]  hover:bg-[#FFFFFF1A] transition-all duration-200 cursor-pointer"
      onClick={onClick}
      title={title}
    >
      <img
        src="/icon-ex-arrows.svg"
        alt={isOpen ? "Close" : "Expand"}
        className={`w-4 h-4 object-contain opacity-70 hover:opacity-100 transition-all duration-300 ${
          isOpen ? "transform rotate-180" : ""
        }`}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </button>
  );
};

export default KiExpandArrows;
