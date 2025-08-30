import React from "react";
import { Link } from "react-router-dom";
const imgAiTool = "/icon-render-img.png";
const imgVideoCamera = "/video-camera-icon.png";
const imgScope = "/icon-telescope.png";
const imgFacebook = "/icon-facebook-liner.png";
const imgTiktok = "/icon-tiktok.svg";
const imgYoutube = "/icon-y.svg";
const imgGoogle = "/icon-gg.svg";
const imgShopee = "/icon-shoppe.svg";
const imgMedia = "/icon-media.svg";
const NewAi = () => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-wrap justify-center space-x-20">
        <Link
          to="/chat?agent=research"
          className="flex flex-col items-center gap-[5px] w-[calc(50%-1rem)] sm:w-auto group"
        >
          <div className="rounded-full mb-1 w-17 h-10 flex items-center justify-center relative box-border hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer">
            <img
              className="w-10 h-10 group-hover:scale-115 transition-all duration-300 ease-in-out"
              src={imgScope}
              alt="scope"
            />
          </div>
          <span className="text-white text-center font-medium text-[13px]">
            Market Research <br></br>Agent
          </span>
        </Link>

        <Link
          to="/media-agent"
          className="flex flex-col items-center gap-[5px] w-[calc(50%-1rem)] sm:w-auto group"
        >
          <div className="rounded-full mb-1 w-17 h-10 flex items-center justify-center relative box-border hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer">
            <img
              className="w-10 h-10 group-hover:scale-115 transition-all duration-300 ease-in-out"
              src={imgMedia}
              alt="media"
            />
          </div>
          <span className="text-white text-center font-medium text-[9px] text-[13px]">
            Media Creator <br></br>Agent
          </span>
          <span className="bg-gradient-new-label text-white text-[10px] px-3 py-1 rounded-[11px] rounded-bl-none rounded-tr-none font-medium">
            New
          </span>
        </Link>

        <Link
          to="/chat?agent=facebook-lead"
          className="flex flex-col items-center gap-[5px] w-[calc(50%-1rem)] sm:w-auto group"
        >
          <div className="rounded-full mb-1 w-17 h-10 flex items-center justify-center relative box-border hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer">
            <img
              className="w-10 h-10 group-hover:scale-115 transition-all duration-300 ease-in-out"
              src={imgFacebook}
              alt="facebook"
            />
          </div>
          <span className="text-white text-center font-medium text-[9px] text-[13px]">
            Facebook Lead <br></br>Agent
          </span>
          <span className="bg-gradient-new-label text-white text-[10px]  px-3 py-1 rounded-[11px] rounded-bl-none rounded-tr-none font-medium">
            New
          </span>
        </Link>

        <Link
          to="/chat?agent=tiktok-lead"
          className="flex flex-col items-center gap-[5px] w-[calc(50%-1rem)] sm:w-auto group"
        >
          <div className="rounded-full mb-1 w-17 h-10 flex items-center justify-center relative box-border hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer">
            <img
              className="w-10 h-10 group-hover:scale-115 transition-all duration-300 ease-in-out"
              src={imgTiktok}
              alt="tiktok"
            />
          </div>
          <span className="text-white text-center font-medium text-[9px] text-[13px]">
            TikTok Lead <br></br>Agent
          </span>
          <span className="bg-gradient-coming-soon-label text-white text-[10px]  px-2 py-1 rounded-[11px] rounded-bl-none rounded-tr-none font-medium">
            Coming soon
          </span>
        </Link>

        <Link
          to="/chat?agent=youtube-lead"
          className="flex flex-col items-center gap-[5px] w-[calc(50%-1rem)] sm:w-auto group"
        >
          <div className="rounded-full mb-1 w-17 h-10 flex items-center justify-center relative box-border hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer">
            <img
              className="w-10 h-10 group-hover:scale-115 transition-all duration-300 ease-in-out"
              src={imgYoutube}
              alt="youtube"
            />
          </div>
          <span className="text-white text-center font-medium text-[9px] text-[13px]">
            Youtube Lead <br></br>Agent
          </span>
          <span className="bg-gradient-coming-soon-label text-white text-[10px] px-2 py-1 rounded-[11px] rounded-bl-none rounded-tr-none font-medium">
            Coming soon
          </span>
        </Link>

        <Link
          to="/chat?agent=google-lead"
          className="flex flex-col items-center gap-[5px] w-[calc(50%-1rem)] sm:w-auto group"
        >
          <div className="rounded-full mb-1 w-17 h-10 flex items-center justify-center relative box-border hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer">
            <img
              className="w-10 h-10 group-hover:scale-115 transition-all duration-300 ease-in-out"
              src={imgGoogle}
              alt="google"
            />
          </div>
          <span className="text-white text-center font-medium text-[9px] text-[13px]">
            Google Lead <br></br>Agent
          </span>
          <span className="bg-gradient-coming-soon-label text-white text-[10px] px-2 py-1 rounded-[11px] rounded-bl-none rounded-tr-none font-medium">
            Coming soon
          </span>
        </Link>

        <Link
          to="/chat?agent=shopee-lead"
          className="flex flex-col items-center gap-[5px] w-[calc(50%-1rem)] sm:w-auto group"
        >
          <div className="rounded-full mb-1 w-17 h-10 flex items-center justify-center relative box-border hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer">
            <img
              className="w-10 h-10 group-hover:scale-115 transition-all duration-300 ease-in-out"
              src={imgShopee}
              alt="shopee"
            />
          </div>
          <span className="text-white text-center font-medium text-[9px] text-[13px]">
            Shopee Lead <br></br>Agent
          </span>
          <span className="bg-gradient-coming-soon-label text-white text-[10px] px-2 py-1 rounded-[11px]  rounded-bl-none rounded-tr-none font-medium">
            Coming soon
          </span>
        </Link>
      </div>
    </div>
  );
};

export default NewAi;
