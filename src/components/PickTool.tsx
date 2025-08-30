import React, {useState, useRef, useEffect} from "react";
import ToolMarketingAgentForm from "./ToolMarketingAgentForm";
import {
  ImageTemplateModal,
  DualModalContainer,
} from "../ChatUI/ImgToolLayout/ModalMedia";

interface ToolSelection {
  icon: string;
  text: string;
  type: "default" | "image" | "video";
}

const PickTool = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isMarketingAgent = window.location.search.includes(
    "agent=marketing-assistant"
  );
  const isResearchAgent = window.location.search.includes("agent=research");
  const isFacebookLead = window.location.search.includes("agent=facebook-lead");
  const isMediaAI = window.location.search.includes("tool=media-ai");

  const [isMarketingAgentForm, setIsMarketingAgentForm] = useState(false);
  const [isImageTemplateModal, setIsImageTemplateModal] = useState(false);
  const [isDualModalOpen, setIsDualModalOpen] = useState(false);
  const [selectedTemplateTitle, setSelectedTemplateTitle] =
    useState<string>("");

  const availableTools: ToolSelection[] = [
    {icon: "/icon-idea.png", text: "Công cụ", type: "default"},
    {icon: "/icon-render-img.png", text: "Image Gen", type: "image"},
    {icon: "/video-camera-icon.png", text: "Video Gen", type: "video"},
  ];

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const savedTool = urlParams.get("selectedTool");

    if (savedTool) {
      const tool = availableTools.find((t) => t.type === savedTool);
      if (tool) {
      }
    }
  }, []);

  const saveToolToUrl = (tool: ToolSelection) => {
    const url = new URL(window.location.href);
    if (tool.type === "default") {
      url.searchParams.delete("selectedTool");
    } else {
      url.searchParams.set("selectedTool", tool.type);
    }
    window.history.replaceState({}, "", url);
  };

  if (isResearchAgent) return null;

  const handleCloseMarketingAgentForm = () => {
    setIsMarketingAgentForm(false);
  };

  const handleToolSelect = (toolType: "image" | "video" | "default") => {
    const newTool = availableTools.find((t) => t.type === toolType);
    if (newTool) {
      saveToolToUrl(newTool);
      setIsMarketingAgentForm(false);
    }
  };

  const handleMediaAIClick = () => {
    setIsImageTemplateModal(true);
  };

  const handleCloseImageTemplateModal = () => {
    setIsImageTemplateModal(false);
  };

  const handleSelectTemplate = (template: any) => {
    console.log("Selected template:", template);
  };

  const handleOpenDualModal = (templateTitle: string) => {
    setSelectedTemplateTitle(templateTitle);
    setIsDualModalOpen(true);
  };

  const handleCloseDualModal = () => {
    setIsDualModalOpen(false);
    setSelectedTemplateTitle("");
  };

  if (isMediaAI) {
    return (
      <>
        <div className="relative group">
          <button
            ref={buttonRef}
            type="button"
            onClick={handleMediaAIClick}
            className="flex gap-1 text-white items-center justify-center leading-5 sm:leading-[27px]  !px-[14px] sm:p-[8px] py-1 sm:py-[5px] relative box-border rounded-[15px] bg-[#FFFFFF0D] group hover:bg-[#FFFFFF1A] transition-all duration-300 ease-in-out outline-none cursor-pointer border-1  "
            style={{borderColor: "#656262"}}
          >
            <img
              className="h-4 w-4 group-hover:scale-[1.2] transition-all duration-300 ease-in-out"
              src="/icon-fantasy.svg"
              alt="Tạo ảnh nhanh"
            />
            <span className="text-xs">Tạo ảnh nhanh</span>
          </button>
          <div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
            Chọn loại ảnh
          </div>
        </div>

        <ImageTemplateModal
          isOpen={isImageTemplateModal}
          onClose={handleCloseImageTemplateModal}
          onSelectTemplate={handleSelectTemplate}
          onOpenDualModal={handleOpenDualModal}
        />

        <DualModalContainer
          isOpen={isDualModalOpen}
          onClose={handleCloseDualModal}
          selectedTemplateTitle={selectedTemplateTitle}
        />
      </>
    );
  }

  return (
    <>
      <ToolMarketingAgentForm
        isOpen={isMarketingAgentForm}
        onClose={handleCloseMarketingAgentForm}
        buttonRef={buttonRef}
        onToolSelect={handleToolSelect}
      />
    </>
  );
};

export default PickTool;
