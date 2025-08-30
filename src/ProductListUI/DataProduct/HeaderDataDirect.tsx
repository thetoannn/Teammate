import React from "react";
import NavigationTabs from "../components/NavigationTabs";

const HeaderDataDirect = () => {
  return (
    <header
      className="bg-black text-white p-2 py-1 sticky top-0 z-20 ml-[86px] "
      style={{ backgroundColor: "#1f1f1f" }}
    >
      <div className="flex items-center justify-between ml-[-85px]">
        <div className="z-30 pl-4">
          <span className="text-white text-lg font-medium">
            DỮ LIỆU DOANH NGHIỆP
          </span>
        </div>

        <div className="flex items-center space-x-3 mr-1 gap-1">
          <button className="text-white text-sm p-2 py-1 bg-white/10 rounded-2xl transition-colors cursor-pointer hover:bg-white/20">
            <i className=" ri-discuss-fill"></i>
          </button>

          <button className="text-white text-sm p-2 py-1 bg-white/10 rounded-2xl transition-colors cursor-pointer hover:bg-white/20">
            <i className=" ri-notification-2-fill"></i>
          </button>
        </div>
      </div>

      <div className="ml-[-85px]">
        <NavigationTabs />
      </div>
    </header>
  );
};

export default HeaderDataDirect;
