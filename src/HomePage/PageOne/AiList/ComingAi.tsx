import React, { useState } from "react";
import { Link } from "react-router-dom";

const arrowSlide = "/arrow-right-circle-line.png";

const ComingAi = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerAnimation = () => {
    setIsAnimating((prev) => !prev);
  };

  return (
    <div className="icon-stack-container ">
      <Link to="#" className="stack-icon youtube">
        <i className="ri-youtube-fill text-red-600 text-[25px]"></i>
      </Link>

      <div
        className={`left-icon-group ${isAnimating ? "left-group-animate" : ""}`}
      >
        <Link to="#" className="stack-icon instagram">
          <i className="ri-instagram-line text-white text-[9px]"></i>
        </Link>
        <Link to="#" className="stack-icon twitter">
          <i className="ri-twitter-x-fill text-white text-[16px]"></i>
        </Link>
        <Link to="#" className="stack-icon threads">
          <i className="ri-threads-fill text-white text-[18px]"></i>
        </Link>
      </div>

      <div
        className={`right-icon-group ${
          isAnimating ? "right-group-animate" : ""
        }`}
      >
        <Link to="#" className="stack-icon tiktok">
          <i className="ri-tiktok-fill text-white text-[18px]"></i>
        </Link>
        <Link to="#" className="stack-icon wordpress">
          <i className="ri-wordpress-fill text-white text-[16px]"></i>
        </Link>
        <Link to="#" className="stack-icon word">
          <i className="ri-file-word-fill text-white text-[9px]"></i>
        </Link>
      </div>

      <div className="b-postion-coming mt-[9px] absolute left-[28px] top-[45px] flex items-center justify-center gap-[4px] hover-glow">
        <span className="text-white text-center font-medium text-[9px] leading-[7px] text-nowrap">
          Sắp ra mắt
        </span>
        <button
          className={`hover:scale-110 transition-transform ${
            isAnimating ? "button-moved" : ""
          }`}
          onClick={triggerAnimation}
        >
          <img
            className="img-size-button w-[16px] h-[16px] transform transition-transform duration-300 ease-in-out group-hover:scale-[3.2] cursor-pointer"
            src={arrowSlide}
            alt="arrow-silde"
          />
        </button>
      </div>
    </div>
  );
};

export default ComingAi;
