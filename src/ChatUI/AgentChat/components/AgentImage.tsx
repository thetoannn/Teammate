import React, { useState, useEffect } from "react";

interface AgentImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  preview?: boolean;
  fallbackSrc?: string;
}

export const AgentImage: React.FC<AgentImageProps> = ({
  src,
  alt = "Agent Image",
  width = 350,
  height = 250,
  className = "",
  preview = true,
  fallbackSrc = "/img-not-found.png",
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setLoading(false);
    };
    img.onerror = () => {
      setLoading(false);
      setError(true);
      if (fallbackSrc && fallbackSrc !== src) {
        const fallbackImg = new Image();
        fallbackImg.src = fallbackSrc;
        fallbackImg.onload = () => {
          setCurrentSrc(fallbackSrc);
          setError(false);
        };
        fallbackImg.onerror = () => {
          setError(true);
        };
      }
    };
  }, [src, fallbackSrc]);

  const handleImageError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setError(true);
    }
  };

  if (error && currentSrc === fallbackSrc) {
    return (
      <div
        className={`agent-image-error ${className} flex items-center justify-center bg-gray-800 rounded-lg border border-gray-600`}
        style={{ width, height }}
      >
        <div className="text-center">
          <div className="text-4xl mb-2">📷</div>
          <span className="text-gray-400 text-sm">Không thể tải hình ảnh</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`agent-image-container ${className} relative`}>
      {loading && (
        <div className="agent-image-loading absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto mb-2"></div>
            <span className="text-gray-400 text-xs">Đang tải...</span>
          </div>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        onError={handleImageError}
        className="agent-image w-full h-full object-cover rounded-lg"
        style={{
          display: loading ? "none" : "block",
          visibility: loading ? "hidden" : "visible",
        }}
        loading="eager"
        decoding="async"
      />
    </div>
  );
};
