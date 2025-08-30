import React from "react";

interface WatermarkOverlayProps {
  text?: string;
  className?: string;
}

const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({
  text = "TeamMATE Research AI",
  className = "",
}) => {
  return (
    <div
      className={`absolute pointer-events-none select-none ${className}`}
      style={{
        zIndex: 1,
        width: "100%",
        height: "79vh",
        top: 0,
        left: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="relative text-[#656262]/16 font-bold whitespace-nowrap"
        style={{
          transform: "rotate(-45deg)",
          fontSize: "clamp(1rem, 3.5vw, 3.5rem)",
          fontWeight: "700",
          borderTop: "2px solid #656262/10",
          borderBottom: "2px solid #656262/10",
          paddingTop: "20px",
          paddingBottom: "20px",
          paddingLeft: "40px",
          paddingRight: "40px",
        }}
      >
        <div
          className="absolute"
          style={{
            top: "-2px",
            right: "-2px",
            width: "60px",
            height: "60px",
            borderTop: "2px solid #656262/10",
            borderRight: "2px solid #656262/10",
          }}
        />

        <div
          className="absolute"
          style={{
            bottom: "-2px",
            left: "-2px",
            width: "60px",
            height: "60px",
            borderBottom: "2px solid #656262/10",
            borderLeft: "2px solid #656262/10",
          }}
        />

        {text}
      </div>
    </div>
  );
};

export default WatermarkOverlay;
