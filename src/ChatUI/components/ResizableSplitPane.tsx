import React, { useState, useRef, useCallback, useEffect } from "react";

interface ResizableSplitPaneProps {
  leftPane: React.ReactNode;
  rightPane: React.ReactNode;
  defaultLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  onResize?: (leftWidth: number) => void;
}

const ResizableSplitPane: React.FC<ResizableSplitPaneProps> = ({
  leftPane,
  rightPane,
  defaultLeftWidth = 50,
  minLeftWidth = 20,
  maxLeftWidth = 80,
  onResize,
}) => {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

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
    [isDragging, minLeftWidth, maxLeftWidth, onResize]
  );

  const handleMouseUp = useCallback(() => {
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

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full relative"
      style={{ height: "calc(109vh - 60px)" }}
    >
      <div
        className="flex flex-col relative min-h-0 h-full"
        style={{ width: `${leftWidth}%` }}
      >
        {leftPane}
      </div>

      <div
        ref={dividerRef}
        className="relative flex-shrink-0 select-none"
        style={{
          width: "4px",
          cursor: "col-resize",
          zIndex: 999,
          backgroundColor: "transparent",
        }}
        onMouseDown={handleMouseDown}
        onMouseEnter={(e) => {
          e.currentTarget.style.cursor = "col-resize";
          document.body.style.cursor = "col-resize";
        }}
        onMouseLeave={() => {
          if (!isDragging) {
            document.body.style.cursor = "";
          }
        }}
      >
        <div
          className="absolute inset-y-0 -left-6 -right-6 select-none w-2"
          style={{ cursor: "col-resize", backgroundColor: "transparent" }}
          onMouseEnter={() => {
            document.body.style.cursor = "col-resize";
          }}
          onMouseLeave={() => {
            if (!isDragging) {
              document.body.style.cursor = "";
            }
          }}
        ></div>
      </div>

      <div
        className="flex flex-col relative min-h-0 h-full"
        style={{ width: `${100 - leftWidth}%` }}
      >
        {rightPane}
      </div>
    </div>
  );
};

export default ResizableSplitPane;
