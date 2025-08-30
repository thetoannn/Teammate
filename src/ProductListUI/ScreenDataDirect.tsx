import React from "react";
import SideBarChat from "../ChatUI/SideBarChat";
import HeaderDataDirect from "./DataProduct/HeaderDataDirect";
import TabContent from "./components/TabContent";

const ScreenDataDirect = () => {
  return (
    <div
      className="w-screen h-screen text-white relative overflow-hidden"
      style={{ backgroundColor: "#1f1f1f" }}
    >
      <SideBarChat />
      <div className="pl-0 lg:pl-[54px] h-full flex flex-col relative">
        <HeaderDataDirect />
        <div className="flex-1 overflow-hidden">
          <TabContent />
        </div>
      </div>
    </div>
  );
};

export default ScreenDataDirect;
