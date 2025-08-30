import React, { useState } from "react";
import PersonalizationModal from "./PersonalizationModal";

const toolsIconSide = "/icon-tools.png";

const IconTool = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if current URL contains tool=media-ai parameter
  const urlParams = new URLSearchParams(window.location.search);
  const toolParam = urlParams.get("tool");

  // Hide component if tool parameter is 'media-ai'
  if (toolParam === "media-ai") {
    return null;
  }

  const handleToolClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleSave = (
    nickname: string,
    personality: string,
    traits: string[]
  ) => {
    console.log("Saved personalization:", { nickname, personality, traits });
  };

  return (
    <>
      <div className="relative group">
        <button
          type="button"
          onClick={handleToolClick}
          className="text-white hover:text-gray-300 transition-colors cursor-pointer"
        >
          <img className="w-6 h-6 mt-1 " src={toolsIconSide} alt="tools" />
        </button>
        <div className="absolute bottom-full left-8 transform -translate-x-1/2 mb-2 px-2 py-1  bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-200">
          Cá nhân hóa
        </div>
      </div>

      <PersonalizationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
      />
    </>
  );
};

export default IconTool;
