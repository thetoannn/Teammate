import React, { useState } from "react";
import ChatField from "./ChatField";
import SideBarChat from "./SideBarChat";
import HeaderChatUI from "./HeaderChatUI";
import SlideOutFormNavi from "../components/SlideOutFormNavi";
import Navigation from "../components/Navigation";
import { ResearchScreenTable } from "./AgentChat/ResearchScreenTable";
import { ResearchData } from "./AgentChat/ResearchScreenTable/utils/researchDataFormatter";
import SmoothSplitPane from "./components/SmoothSplitPane";

const ScreenChatUI = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showResearchSplit, setShowResearchSplit] = useState(false);
  const [researchData, setResearchData] = useState<string | undefined>(
    undefined
  );

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
  };

  const handleResearchSplitToggle = (isOpen: boolean, data?: string) => {
    setShowResearchSplit(isOpen);
    if (data) {
      setResearchData(data);
    }
  };

  return (
    <div className="w-full h-screen text-white relative overflow-hidden bg-[#1f1f1f] flex flex-col">
      <SideBarChat />
      <SlideOutFormNavi isOpen={isNavOpen} onClose={closeNav} />

      <div className="pl-0 lg:pl-[60px] flex-1 flex flex-col relative min-h-0">
        <HeaderChatUI />

        <div className="flex-1 flex relative min-h-0">
          <SmoothSplitPane
            isOpen={showResearchSplit}
            defaultLeftWidth={35}
            minLeftWidth={35}
            maxLeftWidth={60}
            animationDuration={700}
            leftPane={
              <ChatField
                onResearchSplitToggle={handleResearchSplitToggle}
                showResearchSplit={showResearchSplit}
              />
            }
            rightPane={
              <div
                className="bg-white rounded-xl border border-gray-200 shadow-lg mt-16 mr-2 mb-2 ml-1 min-h-0 h-full overflow-hidden"
                style={{ height: "100vh" }}
              >
                <div className="h-full flex flex-col min-h-0">
                  <div className="flex-1 min-h-0 h-full">
                    <ResearchScreenTable
                      userQuery=""
                      aiResponse=""
                      isLoading={false}
                      data={researchData}
                      onClose={() => setShowResearchSplit(false)}
                    />
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ScreenChatUI;
