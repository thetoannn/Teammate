import React from "react";

interface MediaCardProps {
  imageUrl: string;
  videoId: string;
  date: string;
  imageId: string;
  isVideo?: boolean;
  socialMediaPlatforms?: Array<{
    name: string;
    icon: string;
    bgColor: string;
  }>;
}

const MediaCard: React.FC<MediaCardProps> = ({
  imageUrl,
  videoId,
  date,
  imageId,
  isVideo = false,
  socialMediaPlatforms = [],
}) => {
  const maxVisibleIcons = 3;
  const visiblePlatforms = socialMediaPlatforms.slice(0, maxVisibleIcons);
  const hiddenCount = Math.max(
    0,
    socialMediaPlatforms.length - maxVisibleIcons
  );

  return (
    <div className="relative rounded-lg overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-[1.02] group">
      <img
        src={imageUrl}
        alt={`Media ${videoId}`}
        className="w-full h-auto object-cover transition-transform duration-300 cursor-pointer"
        loading="lazy"
      />

      <div className="absolute top-2 left-2 flex items-center space-x-2">
        <div className="w-8 h-8 bg-black/60  rounded-full flex items-center justify-center group-hover:bg-[#393E46] transition-all duration-300">
          <i
            className={`${
              isVideo ? "ri-play-fill" : "ri-eye-line"
            } text-white text-sm cursor-pointer`}
          ></i>
        </div>
        <div className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center group-hover:bg-[#393E46] transition-all duration-300">
          <i className="ri-settings-3-line text-white text-sm cursor-pointer"></i>
        </div>
      </div>

      <div className="absolute bottom-2 left-2 right-2 bg-black/30 group-hover:bg-[#222831]  p-3 rounded-2xl transition-all duration-300 ease-in-out max-w-[115px]">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span className="text-white text-sm font-medium">{videoId}</span>
        </div>

        {socialMediaPlatforms.length > 0 && (
          <div className="flex items-center space-x-2 mb-2 cursor-pointer">
            {visiblePlatforms.map((platform, index) => (
              <div
                key={index}
                className={`w-5 h-5 ${platform.bgColor} rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200`}
              >
                <i className={`${platform.icon} text-white text-xs`}></i>
              </div>
            ))}
            {hiddenCount > 0 && (
              <div className="w-2 h-2 flex items-center justify-center hover:scale-110 transition-transform duration-200">
                <span className="text-white text-xs font-medium">
                  +{hiddenCount}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-300">
          <div className="flex items-center space-x-1 mb-1">
            <i className="ri-time-line"></i>
            <span>{date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <i className="ri-image-line"></i>
            <span>{imageId}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
