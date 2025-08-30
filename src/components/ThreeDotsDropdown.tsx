import React, { useState, useEffect, useRef } from "react";

interface ThreeDotsDropdownProps {
  onRename?: () => void;
  onDelete?: () => void;
}

const ThreeDotsDropdown: React.FC<ThreeDotsDropdownProps> = ({
  onRename,
  onDelete,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const threeDotsIcon = "/icon-threedot.png";
  const pencilIcon = "/icon-pencil.png";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleRename = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRename?.();
    setIsDropdownOpen(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.();
    setIsDropdownOpen(false);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="cursor-pointer rounded"
        type="button"
        onClick={handleButtonClick}
      >
        <img className="w-4 h-4" src={threeDotsIcon} alt="three dots" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 left-[-105px] top-5 w-30 bg-[#2E2E2E] rounded-xl shadow-lg z-30 p-1">
          <div className="py-1">
            <button
              className="w-full flex items-center px-3 py-2 text-[12px] text-white hover:bg-white/10 transition-colors rounded-xl cursor-pointer"
              onClick={handleRename}
            >
              <img className="w-4 h-4 mr-2" src={pencilIcon} alt="pencil" />
              Đổi tên
            </button>
            <button
              className="w-full flex items-center px-3 py-2 text-[12px] text-white hover:bg-white/10 transition-colors rounded-xl cursor-pointer"
              onClick={handleDelete}
            >
              <span className="w-4 h-4 mr-2 flex items-center justify-center"></span>
              Xóa bỏ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeDotsDropdown;
