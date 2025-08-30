import React, { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";

interface SplitImgViewerProps {
  isOpen: boolean;
  imageUrl?: string;
  imageUrls?: string[];
  onClose: () => void;
}

const SplitImgViewer: React.FC<SplitImgViewerProps> = ({
  isOpen,
  imageUrl,
  imageUrls,
  onClose,
}) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const osdViewerRef = useRef<OpenSeadragon.Viewer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageViewer, setShowImageViewer] = useState(false);

  // Get all available images
  const allImages =
    imageUrls && imageUrls.length > 0 ? imageUrls : imageUrl ? [imageUrl] : [];
  const currentImage = allImages[currentImageIndex];

  useEffect(() => {
    if (isOpen && allImages.length > 0) {
      setShowImageViewer(true);
    } else {
      setShowImageViewer(false);
    }
  }, [isOpen, allImages.length]);

  useEffect(() => {
    if (showImageViewer && viewerRef.current && currentImage) {
      setIsLoading(true);

      // Clean up existing viewer
      if (osdViewerRef.current) {
        osdViewerRef.current.destroy();
        osdViewerRef.current = null;
      }

      // Initialize OpenSeadragon viewer
      osdViewerRef.current = OpenSeadragon({
        element: viewerRef.current,
        prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
        tileSources: {
          type: "image",
          url: currentImage,
        },
        minZoomLevel: 0.5,
        defaultZoomLevel: 1,
        maxZoomLevel: 30, // 30x zoom
        visibilityRatio: 0.2,
        constrainDuringPan: false,
        showNavigationControl: false,
        navigationControlAnchor: OpenSeadragon.ControlAnchor.TOP_RIGHT,
        showZoomControl: false,
        showHomeControl: false,
        showFullPageControl: false,
        showRotationControl: false,
        gestureSettingsMouse: {
          scrollToZoom: true,
          clickToZoom: true,
          dblClickToZoom: true,
          pinchToZoom: true,
          flickEnabled: true,
        },
        gestureSettingsTouch: {
          scrollToZoom: false,
          clickToZoom: false,
          dblClickToZoom: true,
          pinchToZoom: true,
          flickEnabled: true,
        },
      });

      // Handle loading events
      osdViewerRef.current.addHandler("open", () => {
        setIsLoading(false);
      });

      osdViewerRef.current.addHandler("open-failed", () => {
        setIsLoading(false);
        console.error("Failed to load image:", currentImage);
      });
    }

    return () => {
      if (osdViewerRef.current) {
        osdViewerRef.current.destroy();
        osdViewerRef.current = null;
      }
    };
  }, [showImageViewer, currentImage]);

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < allImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  // Show placeholder when no images
  if (!showImageViewer || allImages.length === 0) {
    return (
      <div
        style={{
          background: "radial-gradient(circle, #2a2a2a 0%, #1a1a1a 100%)",
        }}
        className="w-full h-full flex flex-col"
      >
        <div
          style={{
            background: "radial-gradient(circle, #2a2a2a 0%, #1a1a1a 100%)",
          }}
          className="flex items-center justify-between p-2 flex-shrink-0"
        >
          <div className="flex items-center space-x-3"></div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-600 rounded-xl cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center bg-[#1a1a1a]">
          <div className="text-center">
            <img src="/icon-center-group.svg" alt="" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "radial-gradient(circle, #2a2a2a 0%, #1a1a1a 100%)",
      }}
      className="w-full h-full flex flex-col"
    >
      <div
        style={{
          background: "radial-gradient(circle, #2a2a2a 0%, #1a1a1a 100%)",
        }}
        className="flex items-center justify-between p-1  flex-shrink-0"
      >
        <div className="flex items-center space-x-3"></div>
        <div className="flex items-center space-x-2">
          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePreviousImage}
                disabled={currentImageIndex === 0}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-600 rounded-xl   disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={handleNextImage}
                disabled={currentImageIndex === allImages.length - 1}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-600 rounded"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative flex-1 bg-[#1a1a1a] min-h-0">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a] z-10">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="text-gray-400 text-sm">Loading image...</span>
            </div>
          </div>
        )}

        <div
          ref={viewerRef}
          className="w-full h-full"
          style={{
            background: "radial-gradient(circle, #2a2a2a 0%, #1a1a1a 100%)",
          }}
        />

        {/* Image Thumbnails */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-70 p-2 rounded-lg">
            {allImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-12 h-12 rounded border-2 overflow-hidden ${
                  index === currentImageIndex
                    ? "border-blue-500"
                    : "border-gray-600 hover:border-gray-400"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SplitImgViewer;
