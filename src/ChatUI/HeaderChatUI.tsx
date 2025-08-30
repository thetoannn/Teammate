import React, { useState } from "react";
import Navigation from "../components/Navigation";
import NameAgentHeader from "../components/NameAgentHeader";
import { useSearchParams } from "react-router-dom";
import SideBarChat from "./SideBarChat";
import SlideOutFormNavi from "../components/SlideOutFormNavi";
import ChatPropose from "../components/ChatPropose";
import ChatNotifications from "../components/ChatNotifications";
import TokenHeaderDis from "../components/TokenHeaderDis";

const HeaderChatUI = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSlideFormOpen, setIsSlideFormOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const getAgentNameFromUrl = () => {
    const agentParam = searchParams.get("agent");
    const toolParam = searchParams.get("tool");

    if (agentParam === "facebook-lead") return "Facebook Lead Agent";
    if (agentParam === "research") return "Research Agent";
    if (agentParam === "marketing-assistant")
      return "Marketing Assistant Agent";
    if (toolParam === "media-ai") return "Media AI Tools";
    if (toolParam === "video-ai") return "Short Video Ai Tools";

    return "Marketing Assistant Agent";
  };

  const agentName = getAgentNameFromUrl();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSlideForm = () => {
    setIsSlideFormOpen(!isSlideFormOpen);
  };

  return (
    <>
      <header
        className=" text-white p-2 py-1 sticky top-0 z-5 pl-[86px]"
        style={{ backgroundColor: "#1F1F1F" }}
      >
        <div className="flex items-center justify-between ml-[-85px]">
          {/* <div className="z-30 cursor-pointer">
            <Navigation onToggle={toggleSlideForm} />
          </div> */}

          <div className="flex-1 flex justify-center items-center ml-37 space-x-2 relative ">
            <NameAgentHeader agentName={agentName} />
          </div>

          <div className="flex items-center space-x-3 pr-4 gap-2">
            <ChatPropose />
            <ChatNotifications />
            <TokenHeaderDis></TokenHeaderDis>
          </div>
        </div>
      </header>

      <SlideOutFormNavi
        isOpen={isSlideFormOpen}
        onClose={() => setIsSlideFormOpen(false)}
      />
    </>
  );
};

export default HeaderChatUI;
