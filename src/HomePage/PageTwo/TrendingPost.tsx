import React, { useMemo } from "react";
import { Link } from "react-router-dom";

interface TrendingPostProps {
  imageUrl: string;
  category: string;
  title: string;
  linkUrl: string;
  viewCount?: number;
  isInStack?: boolean;
}
const manLogoPost = "/white-brand-logo-main.png";
const TrendingPost: React.FC<TrendingPostProps> = ({
  imageUrl,
  category,
  title,
  linkUrl,
  viewCount,
  isInStack = false,
}) => {
  const getCurrentDate = () => {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatViewCount = (count: number) => {
    if (count >= 1000) {
      return Math.floor(count / 1000) + "K";
    }
    return count.toString();
  };

  const getViewCount = () => {
    if (viewCount !== undefined) {
      return viewCount;
    }

    return Math.floor(Math.random() * 49900) + 100;
  };

  const displayViewCount = formatViewCount(getViewCount());

  return (
    <Link to={linkUrl} className="block w-full group ">
      <div
        className={`relative rounded-xl overflow-hidden transform transition-all  duration-300 ease-in-out ${
          isInStack
            ? "hover:scale-[1.05]"
            : "hover:scale-[1.02] hover:shadow-2xl hover:shadow-black/20 "
        }`}
        style={
          !isInStack
            ? {
                background:
                  "linear-gradient(145deg, rgba(18, 18, 18, 0.8), rgba(34, 40, 49, 0.9))",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                maxWidth: "100%",
                margin: window.innerWidth < 1024 ? "2px" : "5px",
              }
            : {}
        }
      >
        <img
          src={imageUrl}
          alt={title}
          className={`w-full object-cover transition-transform duration-300 cursor-pointer ${
            isInStack
              ? "h-64"
              : "group-hover:scale-105 group-hover:brightness-110"
          }`}
          loading="lazy"
        />

        {!isInStack && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}

        <div
          className={`trending-category absolute top-2 left-2 transition-all duration-300 ease-in-out  ${
            isInStack
              ? "!bg-[#121212]/50 opacity-100 group-hover:!bg-gradient-to-r group-hover:!from-[#DB2777] group-hover:!to-[#4374FF] group-hover:backdrop-blur-2xl rounded-xl px-2 !py-[7px]"
              : "bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 group-hover:bg-gradient-to-r group-hover:from-[#DB2777] group-hover:to-[#4374FF] group-hover:backdrop-blur-xl border border-white/10 max-w-[115px]"
          }`}
        >
          <div className="flex items-center gap-1 text-white">
            <img
              className={`${isInStack ? "w-5 h-5" : "w-4 h-4"}`}
              src={manLogoPost}
              alt=""
            />
            <span
              className={`category-text font-medium ${
                isInStack ? "10px" : "text-xs"
              }`}
            >
              {category}
            </span>
          </div>
        </div>

        <div
          className={`back-title absolute bottom-2 left-2 right-2 transition-all duration-300 ease-in-out ${
            isInStack
              ? "!bg-[#121212]/50 opacity-100  p-2 rounded-xl"
              : "bg-black/70 backdrop-blur-sm p-4 rounded-xl  group-hover:backdrop-blur-xl border border-white/10 group-hover:border-white/20 max-w-[115px]"
          }`}
        >
          <h3
            className={`trending-title font-bold xl:!text-xs  text-white line-clamp-2 mb-1 transition-colors duration-300 ${
              isInStack ? "text-base" : "text-sm group-hover:text-blue-100"
            }`}
          >
            {title}
          </h3>

          <div
            className={`flex items-center justify-between text-gray-200  ${
              isInStack ? "text-xs" : "text-xs"
            }`}
          >
            <span
              className={`custom-date-css flex items-center gap-1 transition-colors duration-300 ${
                !isInStack ? "group-hover:text-blue-200" : ""
              }`}
            >
              Cập nhật {getCurrentDate()}
            </span>

            <div
              className={`flex items-center gap-1 text-white transition-all duration-300 ${
                !isInStack
                  ? "group-hover:text-blue-100 group-hover:scale-105"
                  : ""
              }`}
            >
              <span className="font-medium">{displayViewCount}</span>
              <img
                src="/white-eye.png"
                alt="views"
                className={`text-white transition-transform duration-300 ${
                  isInStack ? "w-4 h-4" : "w-3 h-3 group-hover:scale-110"
                }`}
              />
            </div>
          </div>
        </div>

        {/* Masonry-specific decorative elements */}
        {!isInStack && (
          <>
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Bottom glow effect */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/0 via-blue-400/50 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        )}
      </div>
    </Link>
  );
};
export default TrendingPost;
