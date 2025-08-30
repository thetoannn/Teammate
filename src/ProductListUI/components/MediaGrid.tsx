import React from "react";
import Masonry from "react-masonry-css";
import MediaCard from "./MediaCard";

const MediaGrid = () => {
  const defaultSocialPlatforms = [
    { name: "facebook", icon: "ri-facebook-fill", bgColor: "bg-blue-600" },
    { name: "youtube", icon: "ri-youtube-fill", bgColor: "bg-red-600" },
    { name: "twitter", icon: "ri-twitter-fill", bgColor: "bg-blue-400" },
    { name: "tiktok", icon: "ri-tiktok-fill", bgColor: "bg-black" },
    { name: "youtube", icon: "ri-youtube-fill", bgColor: "bg-red-600" },
    { name: "instagram", icon: "ri-instagram-fill", bgColor: "bg-pink-600" },
  ];

  const mediaData = [
    {
      imageUrl:
        "https://i.pinimg.com/736x/63/1c/2d/631c2d5fc2599cff65f5144507dbce4e.jpg",
      videoId: "ATN0012",
      date: "12/07/2025",
      imageId: "Image0028",
      isVideo: true,
    },
    {
      imageUrl:
        "https://i.pinimg.com/1200x/c2/31/48/c2314893161f270e6b8dd30f9087bc43.jpg",
      videoId: "ATN0012",
      date: "12/07/2025",
      imageId: "Image0028",
      isVideo: false,
    },
    {
      imageUrl:
        "https://i.pinimg.com/736x/48/ea/05/48ea0549b3a0985c635993ebfc698e7b.jpg",
      videoId: "ATN0012",
      date: "12/07/2025",
      imageId: "Image0028",
      isVideo: true,
    },
    {
      imageUrl:
        "https://i.pinimg.com/1200x/f0/7e/dd/f07edd3cf298b545f147914272bf20eb.jpg",
      videoId: "ATN0012",
      date: "12/07/2025",
      imageId: "Image0028",
      isVideo: false,
    },
    {
      imageUrl:
        "https://i.pinimg.com/1200x/71/d8/1f/71d81fdc8ae26b173cf5635502a4c2f6.jpg",
      videoId: "ATN0012",
      date: "12/07/2025",
      imageId: "Image0028",
      isVideo: true,
    },
    {
      imageUrl:
        "https://i.pinimg.com/736x/5f/00/1b/5f001b48f1d2fe417a882e851157d939.jpg",
      videoId: "ATN0012",
      date: "12/07/2025",
      imageId: "Image0028",
      isVideo: false,
    },
    {
      imageUrl:
        "https://i.pinimg.com/736x/cb/37/ef/cb37eff129a1b7facf8b2c4db28326bd.jpg",
      videoId: "ATN0012",
      date: "12/07/2025",
      imageId: "Image0028",
      isVideo: true,
    },
    {
      imageUrl:
        "https://i.pinimg.com/1200x/25/33/04/253304c3c3c51e03dfda76acc818210a.jpg",
      videoId: "ATN0012",
      date: "12/07/2025",
      imageId: "Image0028",
      isVideo: false,
    },
    {
      imageUrl:
        "https://i.pinimg.com/736x/b4/ad/b8/b4adb8aa723810fead1dc903933e3557.jpg",
      videoId: "ATN0012",
      date: "12/07/2025",
      imageId: "Image0028",
      isVideo: true,
    },
    {
      imageUrl:
        "https://i.pinimg.com/736x/05/7f/1e/057f1ebf66cde5c5544ed1f9acf7dbb0.jpg",
      videoId: "ATN0012",
      date: "12/07/2025",
      imageId: "Image0028",
      isVideo: false,
    },
    {
      imageUrl:
        "https://i.pinimg.com/736x/87/80/de/8780dee425b04c421e5d116f6ddde93f.jpg",
      videoId: "ATN0012",
      date: "12/07/2025",
      imageId: "Image0028",
      isVideo: true,
    },
    {
      imageUrl:
        "https://i.pinimg.com/1200x/12/3d/1c/123d1c75513e5a9001f62ff7ae763e56.jpg",
      videoId: "ATN0012",
      date: "12/07/2025",
      imageId: "Image0028",
      isVideo: false,
    },
    {
      imageUrl:
        "https://i.pinimg.com/736x/c8/fb/41/c8fb41749423077c818b42c5644ef1e2.jpg",
      videoId: "ATN0012",
      date: "12/07/2025",
      imageId: "Image0028",
      isVideo: true,
    },
    {
      imageUrl:
        "https://i.pinimg.com/736x/43/68/ab/4368ab6e683ff4a34c51c25ff9e4e327.jpg",
      videoId: "ATN0012",
      date: "12/07/2025",
      imageId: "Image0028",
      isVideo: false,
    },
    {
      imageUrl:
        "https://i.pinimg.com/736x/63/1c/2d/631c2d5fc2599cff65f5144507dbce4e.jpg",
      videoId: "ATN0012",
      date: "12/07/2025",
      imageId: "Image0028",
      isVideo: true,
    },
  ];

  const breakpointColumnsObj = {
    default: 4,
    1600: 5,
    1300: 5,
    1200: 3,
    1100: 2,
    900: 2,
    932: 4,
    667: 4,
    700: 4,
    720: 4,
    896: 5,
    500: 2,
    375: 2,
    412: 4,
    1024: 5,
    414: 3,
    430: 2,
    360: 3,
    1180: 5,
    390: 3,
    1025: 5,
    1368: 5,
  };

  return (
    <div className="h-full overflow-y-auto px-4">
      <div className="flex justify-end mb-4 pt-4">
        <button className="cursor-pointer flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors duration-200">
          <i className="ri-add-line"></i>
          <span className="text-sm">Thêm ảnh/video</span>
        </button>
      </div>

      <div className="pb-8">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {mediaData.map((media, index) => (
            <div key={index}>
              <MediaCard
                imageUrl={media.imageUrl}
                videoId={media.videoId}
                date={media.date}
                imageId={media.imageId}
                isVideo={media.isVideo}
                socialMediaPlatforms={defaultSocialPlatforms}
              />
            </div>
          ))}
        </Masonry>
      </div>
    </div>
  );
};

export default MediaGrid;
