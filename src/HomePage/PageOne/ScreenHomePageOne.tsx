import React, { FC } from "react";
import SideBar from "./SideBar";
import AiHashName from "./AiHashName";
import InputFeild from "./InputFeild";
import BrandName from "./BrandName";
import NewAi from "./AiList/NewAi";
import ComingAi from "./AiList/ComingAi";
import TrendingNew from "./TrendingNew";
import "../../styles/resesPonsive.css";
const ScreenHomePageOne: FC = () => {
  return (
    <div className="flex flex-col sm:flex-row ">
      <SideBar />
      <div className="flex flex-col items-center justify-start mt-5 px-[11px] pt-[43px] sm:pt-0 sm:justify-center flex-1 relative">
        <div className="mb-[3px]">
          <BrandName />
        </div>
        <div className="mb-[27px] sm:mb-[54px] text-center">
          <AiHashName />
        </div>

        <InputFeild />

        <div className="mt-[21px] sm:mt-[27px] w-full px-2">
          <NewAi />
        </div>

        <div className="mt-[10px] sm:mt-[35px] w-full mb-[27px]">
          <TrendingNew />
        </div>
      </div>
    </div>
  );
};

export default ScreenHomePageOne;
