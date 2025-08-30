import React, { FC } from "react";

interface NavigationProps {
  onToggle: () => void;
}

const Navigation: FC<NavigationProps> = ({ onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="text-white text-xl p-2 py-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
      aria-label="Toggle navigation menu"
    >
      <i className="ri-menu-2-fill"></i>
    </button>
  );
};

export default Navigation;
