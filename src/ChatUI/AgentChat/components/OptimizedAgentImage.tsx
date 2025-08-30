import React, { useState, useEffect, useRef, useCallback } from "react";

interface OptimizedAgentImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  preview?: boolean;
  fallbackSrc?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
}

export const OptimizedAgentImage: React.FC<OptimizedAgentImageProps> = ({
  src,
  alt = "Agent Image",
  width = 350,
  height = 250,
  className = "",
  preview = true,
  fallbackSrc = "/img-not-found.png",
  loading = "lazy",
  priority = false,
}) => {
  const [loadingState, setLoadingState] = useState<
    "loading" | "loaded" | "error"
  >("loading");
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isInView, setIsInView] = useState(!priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const preloadImage = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load: ${url}`));
      img.src = url;
    });
  }, []);

  useEffect(() => {
    if (priority || loading === "eager") {
      setIsInView(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, loading]);

  const loadImage = useCallback(
    async (imageSrc: string) => {
      try {
        setLoadingState("loading");
        await preloadImage(imageSrc);
        setLoadingState("loaded");
      } catch (error) {
        setLoadingState("error");
        if (fallbackSrc && imageSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
          try {
            await preloadImage(fallbackSrc);
            setLoadingState("loaded");
          } catch {
            setLoadingState("error");
          }
        }
      }
    },
    [fallbackSrc, preloadImage]
  );

  useEffect(() => {
    if (isInView && src) {
      loadImage(src);
    }
  }, [isInView, src, loadImage]);

  const handleImageError = useCallback(() => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      loadImage(fallbackSrc);
    } else {
      setLoadingState("error");
    }
  }, [fallbackSrc, currentSrc, loadImage]);

  const renderPlaceholder = () => (
    <div
      className={`agent-image-placeholder ${className} flex items-center justify-center bg-gray-800 rounded-lg border border-gray-600`}
      style={{ width, height }}
    >
      <div className="text-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-gray-700 rounded-full mx-auto mb-2"></div>
          <div className="h-2 bg-gray-700 rounded w-20 mx-auto"></div>
        </div>
      </div>
    </div>
  );

  const renderError = () => (
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

  if (loadingState === "error" && currentSrc === fallbackSrc) {
    return renderError();
  }

  return (
    <div className={`agent-image-container ${className} relative`} ref={imgRef}>
      {loadingState === "loading" && renderPlaceholder()}

      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        onError={handleImageError}
        onLoad={() => setLoadingState("loaded")}
        className={`agent-image w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
          loadingState === "loaded" ? "opacity-100" : "opacity-0"
        }`}
        loading={loading}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "low"}
      />
    </div>
  );
};
