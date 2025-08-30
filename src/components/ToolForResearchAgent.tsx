import React, { useState, useRef, useEffect } from "react";
import ResearchSlideForm from "./ResearchSlideForm";
import DataAnalysisSlideForm from "./DataAnalysisSlideForm";
import CustomerProfileSlideForm from "./CustomerProfileSlideForm";
import MarketResearchForm from "./MarketResearchForm";

interface ForResearchAgentProps {
  onSendMessage?: (message: string) => void;
}

const ForResearchAgent: React.FC<ForResearchAgentProps> = ({
  onSendMessage,
}) => {
  const isResearchAgent = window.location.search.includes("agent=research");
  const [isSlideFormOpen, setIsSlideFormOpen] = useState(false);
  const [isDataAnalysisOpen, setIsDataAnalysisOpen] = useState(false);
  const [isCustomerProfileOpen, setIsCustomerProfileOpen] = useState(false);
  const [isMarketResearchOpen, setIsMarketResearchOpen] = useState(false);
  const [currentSelection, setCurrentSelection] = useState<{
    icon?: string;
    text: string;
    type: string;
  } | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);

  // Auto-open slide forms based on URL parameters
  useEffect(() => {
    if (!isResearchAgent) return;

    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const toolParam = urlParams.get("tool");

      // Close all forms first
      setIsCustomerProfileOpen(false);
      setIsDataAnalysisOpen(false);
      setIsMarketResearchOpen(false);

      if (toolParam) {
        let selection;

        switch (toolParam) {
          case "customer-profile":
            selection = {
              text: "Hồ sơ khách hàng của bạn",
              type: "customer-profile",
            };
            setCurrentSelection(selection);
            setIsCustomerProfileOpen(true);
            break;
          case "data-analysis":
            selection = {
              text: "Tìm kiếm phân tích dữ liệu thực",
              type: "data-analysis",
            };
            setCurrentSelection(selection);
            setIsDataAnalysisOpen(true);
            break;
          case "market-research":
            selection = {
              text: "Dữ liệu nghiên cứu thị trường",
              type: "market-research",
            };
            setCurrentSelection(selection);
            setIsMarketResearchOpen(true);
            break;
          default:
            // For default or any other tool parameter, set to default state
            selection = {
              icon: "/icon-idea.png",
              text: "Công cụ",
              type: "default",
            };
            setCurrentSelection(selection);
            break;
        }
      } else {
        // No tool parameter, set to default state
        const selection = {
          icon: "/icon-idea.png",
          text: "Công cụ",
          type: "default",
        };
        setCurrentSelection(selection);
      }
    };

    // Handle initial load
    handleUrlChange();

    // Listen for URL changes (for when tools are selected from dropdown)
    window.addEventListener("popstate", handleUrlChange);

    // Also listen for pushState/replaceState changes
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      originalPushState.apply(window.history, args);
      setTimeout(handleUrlChange, 0);
    };

    window.history.replaceState = function (...args) {
      originalReplaceState.apply(window.history, args);
      setTimeout(handleUrlChange, 0);
    };

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [isResearchAgent]);

  if (!isResearchAgent) {
    return null;
  }

  const handleOpenSlideForm = () => {
    setIsSlideFormOpen(true);
  };

  const handleCloseSlideForm = () => {
    setIsSlideFormOpen(false);
  };

  const handleCloseDataAnalysisForm = () => {
    setIsDataAnalysisOpen(false);
  };

  const handleCloseCustomerProfileForm = () => {
    setIsCustomerProfileOpen(false);
  };

  const handleCloseMarketResearchForm = () => {
    setIsMarketResearchOpen(false);
  };

  const handleButtonClick = () => {
    if (currentSelection?.type === "customer-profile") {
      setIsCustomerProfileOpen(!isCustomerProfileOpen);
    } else if (currentSelection?.type === "data-analysis") {
      setIsDataAnalysisOpen(!isDataAnalysisOpen);
    } else if (currentSelection?.type === "market-research") {
      setIsMarketResearchOpen(!isMarketResearchOpen);
    } else {
      setIsSlideFormOpen(true);
    }
  };

  const handleResetToDefault = () => {
    setCurrentSelection(null);
    setIsCustomerProfileOpen(false);
    setIsDataAnalysisOpen(false);
    setIsMarketResearchOpen(false);
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?agent=research`
    );
  };

  const handleToolSelect = (
    tool: "market-research" | "customer-profile" | "data-analysis" | "default"
  ) => {
    let selection;

    switch (tool) {
      case "market-research":
        selection = {
          text: "Dữ liệu nghiên cứu thị trường",
          type: "market-research",
        };
        window.history.pushState(
          {},
          "",
          `${window.location.pathname}?agent=research&tool=market-research`
        );
        break;
      case "customer-profile":
        selection = {
          text: "Hồ sơ khách hàng của bạn",
          type: "customer-profile",
        };
        window.history.pushState(
          {},
          "",
          `${window.location.pathname}?agent=research&tool=customer-profile`
        );
        break;
      case "data-analysis":
        selection = {
          text: "Tìm kiếm phân tích dữ liệu thực",
          type: "data-analysis",
        };
        window.history.pushState(
          {},
          "",
          `${window.location.pathname}?agent=research&tool=data-analysis`
        );
        break;
      case "default":
        selection = {
          icon: "/icon-idea.png",
          text: "Công cụ",
          type: "default",
        };
        window.history.pushState(
          {},
          "",
          `${window.location.pathname}?agent=research`
        );
        break;
    }

    setCurrentSelection(selection);
  };

  return (
    <>
      <div className="relative group">
        <div className="flex gap-2">
          <button
            ref={buttonRef}
            type="button"
            onClick={handleButtonClick}
            className={`flex gap-1 border text-white items-center justify-center leading-5 sm:leading-[27px] px-[14px] py-[5px] relative box-border rounded-[15px] group hover:bg-[#FFFFFF1A] transition-all duration-300 ease-in-out outline-none cursor-pointer ${
              currentSelection &&
              (currentSelection.type === "customer-profile" ||
                currentSelection.type === "data-analysis" ||
                currentSelection.type === "market-research")
                ? "bg-[#35446D] border border-dashed !border-[#4374FF]"
                : "border  bg-[#FFFFFF0D]"
            }`}
            style={{ borderColor: "#4E4E4E" }}
          >
            {/* Only show icon for default state (when currentSelection is null or has icon property) */}
            {(!currentSelection || currentSelection?.icon) && (
              <img
                className="h-4 w-4 group-hover:scale-[1.2] transition-all duration-300 ease-in-out"
                src={currentSelection?.icon || "/icon-idea.png"}
                alt={currentSelection?.text || "Công cụ"}
              />
            )}

            <span
              className="text-xs "
              style={{
                color:
                  currentSelection &&
                  (currentSelection.type === "customer-profile" ||
                    currentSelection.type === "data-analysis" ||
                    currentSelection.type === "market-research")
                    ? "#4374FF"
                    : undefined,
              }}
            >
              {currentSelection?.text || "Công cụ"}
            </span>

            {(currentSelection?.type === "customer-profile" ||
              currentSelection?.type === "data-analysis" ||
              currentSelection?.type === "market-research") && (
              <img
                src="/icon-delete.png"
                alt="Delete"
                className="h-2 w-2 ml-1 cursor-pointer hover:scale-[1.2] transition-all duration-300 ease-in-out"
                onClick={(e) => {
                  e.stopPropagation();
                  handleResetToDefault();
                }}
              />
            )}
          </button>
        </div>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
          {currentSelection?.type === "market-research"
            ? "Chọn công cụ "
            : "Chọn công cụ "}
        </div>

        <ResearchSlideForm
          isOpen={isSlideFormOpen}
          onClose={handleCloseSlideForm}
          buttonRef={buttonRef}
          onToolSelect={handleToolSelect}
          currentSelection={currentSelection}
        />

        <CustomerProfileSlideForm
          isOpen={isCustomerProfileOpen}
          onClose={handleCloseCustomerProfileForm}
          buttonRef={buttonRef}
          onSendMessage={onSendMessage}
        />

        <DataAnalysisSlideForm
          isOpen={isDataAnalysisOpen}
          onClose={handleCloseDataAnalysisForm}
          buttonRef={buttonRef}
          onSendMessage={onSendMessage}
        />

        <MarketResearchForm
          isOpen={isMarketResearchOpen}
          onClose={handleCloseMarketResearchForm}
          buttonRef={buttonRef}
          onSendMessage={onSendMessage}
        />
      </div>
    </>
  );
};

export default ForResearchAgent;
