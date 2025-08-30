import React, { useState, useEffect } from "react";

interface ImagePreviewProps {
  src: string;
  alt?: string;
  className?: string;
  fallbackSrc?: string;
  showLabel?: boolean;
  label?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  alt = "Preview Image",
  className = "",
  fallbackSrc = "/icon-gen-img.png",
  showLabel = false,
  label = "",
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setLoading(true);
    setError(false);
    setCurrentSrc(src);
  }, [src]);

  const handleImageLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setError(true);
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
  };

  const renderLoadingState = () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-700 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto mb-2"></div>
        <div className="text-gray-400 text-xs">Loading...</div>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-700 rounded-lg">
      <div className="text-center">
        <img
          src={fallbackSrc}
          alt="Fallback"
          className="w-8 h-8 opacity-50 mx-auto mb-2"
        />
        <div className="text-gray-400 text-xs">Failed to load</div>
      </div>
    </div>
  );

  return (
    <div className={`image-preview-container ${className}`}>
      <div className="relative w-full aspect-square bg-gray-700 rounded-lg overflow-hidden">
        {loading && renderLoadingState()}
        {error && currentSrc === fallbackSrc && renderErrorState()}

        <img
          src={currentSrc}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
          style={{ display: loading ? "none" : "block" }}
        />
      </div>

      {showLabel && label && (
        <div className="mt-2 text-center">
          <div className="text-white font-medium text-xs sm:text-sm">
            {label}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
