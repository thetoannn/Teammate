import React from "react";

const TrendingNew = () => {
  return (
    <div className="f-postion flex items-center justify-center w-full px-[5px] sm:px-[11px] mb-[5px]">
      <svg
        width="200"
        height="0.05"
        viewBox="0 0 200 0.05"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[57px] sm:w-[96px] md:w-[460px] h-px dark:rotate-[-180] flex-shrink-0"
      >
        <path
          d="M200 0.025L0 0.025"
          stroke="url(#paint0_linear_trending_right)"
          strokeOpacity="0.6"
        />
        <defs>
          <linearGradient
            id="paint0_linear_trending_right"
            x1="200"
            y1="0.025"
            x2="0"
            y2="0.025"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="white" />
            <stop offset="0.2" stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex-shrink-0">
          <div
              className="round-trend -tit rounded-full px-11 sm:px-11 sm:pr-10 border-l border-r border-white/60"
              style={{
                  background:
                      "linear-gradient(90deg, #D9D9D9 0%, #A6A6A6 39.78%, #A6A6A6 58.72%, #D9D9D9 100%)",
              }}
          > 
              <span className="text-[13px]  text-[#3D3939] whitespace-nowrap">
                Social Trending
              </span>
          </div>
      </div>

        <svg
            width="200"
            height="0.05"
            viewBox="0 0 200 0.05"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[57px] sm:w-[96px] md:w-[460px] h-px dark:rotate-[-180] flex-shrink-0"
      >
        <path
          d="M200 0.025L0 0.025"
          stroke="url(#paint0_linear_trending_left)"
          strokeOpacity="0.6"
        />
        <defs>
          <linearGradient
            id="paint0_linear_trending_left"
            x1="0"
            y1="0.025"
            x2="200"
            y2="0.025"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="white" />
            <stop offset="0.2" stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default TrendingNew;
