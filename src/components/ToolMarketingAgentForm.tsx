import React, { useState, useLayoutEffect } from "react";

const iconVideo = "/video-camera-icon.png";
const iconRender = "/icon-render-img.png";
const iconIdea = "/icon-idea.png";

interface ToolMarketingAgentFormProps {
  isOpen: boolean;
  onClose: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
  onToolSelect?: (tool: "image" | "video" | "default") => void;
  currentSelection?: {
    icon: string;
    text: string;
    type: string;
  };
}

const ToolMarketingAgentForm: React.FC<ToolMarketingAgentFormProps> = ({
  isOpen,
  onClose,
  buttonRef,
  onToolSelect,
  currentSelection,
}) => {
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (isOpen && buttonRef?.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: buttonRect.top + window.scrollY - 1,
        left: buttonRect.left + buttonRect.width / 1.7,
      });
    } else {
      setPosition(null);
    }
  }, [isOpen, buttonRef]);

  if (!isOpen || !position) return null;

  const showImageGen = !currentSelection || currentSelection.type !== "image";
  const showVideoGen = !currentSelection || currentSelection.type !== "video";
  const showDefault = currentSelection && currentSelection.type !== "default";

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 transition-opacity duration-300 ease-in-out pointer-events-auto"
        onClick={onClose}
      />
      <div
        className="absolute bg-[#3D3939] rounded-xl shadow-2xl transition-all duration-200 ease-in-out pointer-events-auto"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: "translateX(-50%) translateY(-100%)",
          minWidth: "80px",
        }}
      >
        <div className="p-0">
          <div className="space-y-0 text-nowrap">
            {showDefault && (
              <button
                className="mkt-button w-full text-left text-xs px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  if (onToolSelect) {
                    onToolSelect("default" as any);
                  }
                  onClose();
                }}
              >
                <img src={iconIdea} alt="Default" className="h-4 w-4" />
                <span>Công cụ</span>
              </button>
            )}
            {showImageGen && (
              <button
                className="mkt-button w-full text-left text-xs px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  if (onToolSelect) {
                    onToolSelect("image");
                  }
                  onClose();
                }}
              >
                <img src={iconRender} alt="Image Gen" className="h-4 w-4" />
                <span>Image Gen</span>
              </button>
            )}
            {showVideoGen && (
              <button
                className="mkt-button w-full text-left text-xs px-3 py-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  if (onToolSelect) {
                    onToolSelect("video");
                  }
                  onClose();
                }}
              >
                <img src={iconVideo} alt="Video Gen" className="h-4 w-4" />
                <span>Video Gen</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolMarketingAgentForm;
