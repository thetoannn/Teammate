import React, { useState, useEffect, useRef } from "react";

interface SmoothSplitPaneProps {
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
  isOpen: boolean;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  animationDuration?: number;
  onResize?: (leftWidth: number) => void;
}

const SmoothSplitPane: React.FC<SmoothSplitPaneProps> = ({
  leftPane,
  rightPane,
  isOpen,
  defaultLeftWidth = 50,
  minLeftWidth = 35,
  maxLeftWidth = 60,
  animationDuration = 700,
  onResize,
}) => {
  const [leftWidth, setLeftWidth] = useState(isOpen ? defaultLeftWidth : 100);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  // Handle open/close animation
  useEffect(() => {
    if (isOpen && leftWidth === 100) {
      // Opening animation
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setLeftWidth(defaultLeftWidth);
        setTimeout(() => setIsAnimating(false), animationDuration);
      }, 50);
      return () => clearTimeout(timer);
    } else if (!isOpen && leftWidth !== 100) {
      // Closing animation
      setIsAnimating(true);
      setLeftWidth(100);
      setTimeout(() => setIsAnimating(false), animationDuration);
    }
  }, [isOpen, leftWidth, defaultLeftWidth, animationDuration]);

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      if (!isOpen || isAnimating) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },
    [isOpen, isAnimating]
  );

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current || !isOpen) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;

      const newLeftWidth = (mouseX / containerWidth) * 100;

      const constrainedWidth = Math.min(
        Math.max(newLeftWidth, minLeftWidth),
        maxLeftWidth
      );

      setLeftWidth(constrainedWidth);
      onResize?.(constrainedWidth);
    },
    [isDragging, minLeftWidth, maxLeftWidth, onResize, isOpen]
  );

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      styleRef.current = document.createElement("style");
      styleRef.current.innerHTML = `
        *, *:hover, *:active, *:focus {
          cursor: col-resize !important;
        }
      `;
      document.head.appendChild(styleRef.current);
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        if (styleRef.current && document.head.contains(styleRef.current)) {
          document.head.removeChild(styleRef.current);
        }
        document.body.style.userSelect = "";
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const rightPaneWidth = 100 - leftWidth;
  const showRightPane = isOpen || isAnimating;

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full relative"
      style={{ height: "calc(109vh - 60px)" }}
    >
      {/* Left Pane */}
      <div
        className="flex flex-col relative min-h-0 h-full"
        style={{
          width: `${leftWidth}%`,
          transition:
            isAnimating && !isDragging
              ? `width ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`
              : "none",
        }}
      >
        {leftPane}
      </div>

      {/* Divider - only show when split pane is open */}
      {showRightPane && (
        <div
          ref={dividerRef}
          className="relative flex-shrink-0 select-none"
          style={{
            width: "4px",
            cursor: isOpen && !isAnimating ? "col-resize" : "default",
            zIndex: 999,
            backgroundColor: "transparent",
            opacity: isOpen ? 1 : 0,
            transition: isAnimating
              ? `opacity ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`
              : "none",
          }}
          onMouseDown={handleMouseDown}
          onMouseEnter={(e) => {
            if (isOpen && !isAnimating) {
              e.currentTarget.style.cursor = "col-resize";
              document.body.style.cursor = "col-resize";
            }
          }}
          onMouseLeave={() => {
            if (!isDragging) {
              document.body.style.cursor = "";
            }
          }}
        >
          <div
            className="absolute inset-y-0 -left-6 -right-6 select-none w-2"
            style={{
              cursor: isOpen && !isAnimating ? "col-resize" : "default",
              backgroundColor: "transparent",
            }}
            onMouseEnter={() => {
              if (isOpen && !isAnimating) {
                document.body.style.cursor = "col-resize";
              }
            }}
            onMouseLeave={() => {
              if (!isDragging) {
                document.body.style.cursor = "";
              }
            }}
          />
        </div>
      )}

      {/* Right Pane */}
      {showRightPane && (
        <div
          className="flex flex-col relative min-h-0 h-full"
          style={{
            width: `${rightPaneWidth}%`,
            transform: isOpen ? "translateX(0)" : "translateX(100%)",
            transition:
              isAnimating && !isDragging
                ? `all ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`
                : "none",
            opacity: isOpen ? 1 : 0,
          }}
        >
          {rightPane}
        </div>
      )}
    </div>
  );
};

export default SmoothSplitPane;
