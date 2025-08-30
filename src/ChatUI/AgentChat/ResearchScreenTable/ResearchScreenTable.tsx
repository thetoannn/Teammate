import React, { useState, useEffect, useRef } from "react";
import WatermarkOverlay from "./WatermarkOverlay";
import { extractTableContentForCopy } from "./utils/researchDataFormatter";
import { generateResearchReportSimplePDF } from "./utils/simplePdfGenerator";
import { useCurrentPlanName } from "../../../hooks/useCurrentPlan";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
interface ResearchData {
  reportTitle: string;
  reportId: string;
  marketSegment: string;
  researchType: string;
  status: string;
  dataPoints: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  keyFindings: string[];
  methodology: {
    sampleSize: number;
    dataCollection: string;
    analysisMethod: string;
  };
  marketSize: {
    value: string;
    currency: string;
    growthRate: string;
  };
}

interface ResearchScreenTableProps {
  userQuery?: string;
  aiResponse?: string;
  isLoading?: boolean;
  data?: string;
  onClose?: () => void;
}
const imgDownloadTable = "/icon-downl.png";
const imgCoppyTable = "/icon-coppytable.png";
const imgReup = "/icon-reup.png";

const ResearchScreenTable: React.FC<ResearchScreenTableProps> = ({
  isLoading = false,
  data,
  onClose,
}) => {
  const researchData = data || "";
  const [copyStatus, setCopyStatus] = useState<
    "idle" | "copying" | "success" | "error"
  >("idle");
  const [downloadStatus, setDownloadStatus] = useState<
    "idle" | "downloading" | "success" | "error"
  >("idle");
  const contentRef = useRef<HTMLDivElement>(null);
  const [watermarkPositions, setWatermarkPositions] = useState<number[]>([]);

  // Get current plan information
  const { planName, isLoading: planLoading } = useCurrentPlanName();

  // Check if user has free plan (restrict premium features)
  const isFreeUser = planName === "Free";

  // Calculate watermark positions based on actual content height (only for free users)
  useEffect(() => {
    const calculateWatermarkPositions = () => {
      // Only show watermarks for free users
      if (!isFreeUser) {
        setWatermarkPositions([]);
        return;
      }

      if (!contentRef.current) return;

      const scrollableContent = contentRef.current.querySelector(
        ".flex-1.overflow-y-auto"
      );
      if (!scrollableContent) return;

      // Get the actual content div (the one with pt-5 p-16)
      const actualContent = scrollableContent.querySelector(".pt-5.p-16");
      if (!actualContent) return;

      const actualContentHeight = (actualContent as HTMLElement).offsetHeight;
      const viewportHeight = window.innerHeight;
      const positions: number[] = [];

      const watermarkInterval = viewportHeight * 0.9;

      // Add first watermark at position 0 (top of content)
      positions.push(0);

      // Add subsequent watermarks every 90vh, but only within actual content bounds
      for (
        let i = watermarkInterval;
        i < actualContentHeight;
        i += watermarkInterval
      ) {
        positions.push(i);
      }

      setWatermarkPositions(positions);
    };

    const timer = setTimeout(calculateWatermarkPositions, 100);

    window.addEventListener("resize", calculateWatermarkPositions);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", calculateWatermarkPositions);
    };
  }, [researchData, isFreeUser]);

  const handleDownload = async () => {
    // Prevent free users from downloading
    if (isFreeUser) {
      console.log("Download blocked: Free plan users cannot download reports");
      return;
    }

    if (!contentRef.current) {
      setDownloadStatus("error");
      setTimeout(() => setDownloadStatus("idle"), 2000);
      return;
    }

    try {
      setDownloadStatus("downloading");

      const contentToScroll =
        (contentRef.current.querySelector(
          ".flex-1.overflow-y-auto"
        ) as HTMLElement) || contentRef.current;

      // Use the simple PDF generator to avoid CSS compatibility issues
      await generateResearchReportSimplePDF(
        contentToScroll,
        researchData || "Báo cáo nghiên cứu thị trường"
      );

      setDownloadStatus("success");
      setTimeout(() => setDownloadStatus("idle"), 2000);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setDownloadStatus("error");
      setTimeout(() => setDownloadStatus("idle"), 2000);
    }
  };

  const handleUpdate = () => {};

  const handleCopy = async () => {
    // Prevent free users from copying
    if (isFreeUser) {
      console.log("Copy blocked: Free plan users cannot copy reports");
      return;
    }

    if (!contentRef.current) {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
      return;
    }

    try {
      setCopyStatus("copying");

      const contentToScroll = contentRef.current.querySelector(
        ".flex-1.overflow-y-auto"
      ) as HTMLElement;
      const contentToCopy = extractTableContentForCopy(
        contentToScroll || contentRef.current
      );

      await navigator.clipboard.writeText(contentToCopy);

      setCopyStatus("success");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch (error) {
      console.error("Failed to copy content:", error);
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 2000);
    }
  };

  const renderContent = () => (
    <div
      ref={contentRef}
      className="bg-white text-gray-800 h-full flex flex-col relative"
    >
      <div className="flex items-center justify-end pt-2 px-4 flex-shrink-0 bg-white">
        <div className="flex items-center gap-1 mr-10">
          <div className="flex items-center gap-7">
            <div className="relative">
              <button
                onClick={handleCopy}
                className={`px-3 py-[2px] pb-[4px] text-sm rounded-[10px] flex items-center transition-all duration-200 ${
                  isFreeUser
                    ? "text-gray-400 cursor-not-allowed opacity-60"
                    : copyStatus === "copying"
                    ? "text-blue-600 cursor-pointer"
                    : copyStatus === "success"
                    ? "text-green-600 cursor-pointer"
                    : copyStatus === "error"
                    ? "text-red-600 cursor-pointer"
                    : "text-gray-700 hover:text-gray-900 cursor-pointer"
                }`}
                style={{
                  textShadow: isFreeUser
                    ? "none"
                    : copyStatus === "copying"
                    ? "0px 2px 4px rgba(37, 99, 235, 0.6)"
                    : copyStatus === "success"
                    ? "0px 2px 4px rgba(22, 163, 74, 0.6)"
                    : copyStatus === "error"
                    ? "0px 2px 4px rgba(220, 38, 38, 0.6)"
                    : "0 1px 2px hsla(0, 2%, 27%, 0.40))",
                  filter: isFreeUser
                    ? "grayscale(50%)"
                    : "drop-shadow(0 1px 2px hsla(0, 2%, 27%, 0.40))",
                }}
                disabled={copyStatus === "copying" || isFreeUser}
                title={
                  isFreeUser
                    ? "Upgrade to Plus plan to copy reports"
                    : "Copy report content"
                }
              >
                <img
                  className="w-4 h-4 mt-1"
                  src={imgCoppyTable}
                  alt=""
                  style={{
                    filter: isFreeUser
                      ? "grayscale(50%) opacity(0.6)"
                      : "drop-shadow()",
                  }}
                />
                {copyStatus === "copying"
                  ? "Copying..."
                  : copyStatus === "success"
                  ? "Copied"
                  : copyStatus === "error"
                  ? "Error"
                  : "Copy"}
              </button>

              <span
                className={`absolute -top-[0.2px] -right-[25px] text-[8px] px-[10px] py-[1px] rounded-full font-medium ${
                  isFreeUser ? "text-gray-400" : "text-[#4374FF]"
                }`}
                style={{
                  background: isFreeUser
                    ? "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)"
                    : "linear-gradient(135deg, #E6EFFF 0%, #D9E3FF 100%)",
                  textShadow: isFreeUser
                    ? "none"
                    : "0px 1px 2px rgba(67, 116, 255, 0.5)",
                  filter: isFreeUser
                    ? "grayscale(100%) opacity(0.6)"
                    : "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.2))",
                }}
              >
                Plus
              </span>
            </div>
            <div className="relative">
              <button
                onClick={handleDownload}
                className={`px-3 py-[2px] pb-[4px] text-sm rounded-[10px] flex items-center gap-1 transition-all duration-200 ${
                  isFreeUser
                    ? "text-gray-400 cursor-not-allowed opacity-60"
                    : downloadStatus === "downloading"
                    ? "text-blue-600 cursor-pointer"
                    : downloadStatus === "success"
                    ? "text-gray-700 cursor-pointer"
                    : downloadStatus === "error"
                    ? "text-red-600 cursor-pointer"
                    : "text-gray-700 hover:text-gray-900 cursor-pointer"
                }`}
                style={{
                  textShadow: isFreeUser
                    ? "none"
                    : downloadStatus === "downloading"
                    ? "0px 2px 4px rgba(37, 99, 235, 0.6)"
                    : downloadStatus === "success"
                    ? ""
                    : downloadStatus === "error"
                    ? "0px 2px 4px rgba(220, 38, 38, 0.6)"
                    : "0 1px 2px hsla(0, 2%, 27%, 0.40))",
                  filter: isFreeUser
                    ? "grayscale(50%)"
                    : "drop-shadow(0 1px 2px hsla(0, 2%, 27%, 0.40))",
                }}
                disabled={downloadStatus === "downloading" || isFreeUser}
                title={
                  isFreeUser
                    ? "Upgrade to Plus plan to download reports"
                    : "Download report as PDF"
                }
              >
                <img
                  className="w-3 h-3"
                  src={imgDownloadTable}
                  alt=""
                  style={{
                    filter: isFreeUser
                      ? "grayscale(50%) opacity(0.6)"
                      : "drop-shadow()",
                  }}
                />
                {downloadStatus === "downloading"
                  ? "Downloading..."
                  : downloadStatus === "success"
                  ? "Downloaded"
                  : downloadStatus === "error"
                  ? "Error"
                  : "Download"}
              </button>

              <span
                className={`absolute -top-[0.2px] -right-[24px] text-[8px] px-[10px] py-[1px] rounded-full font-medium ${
                  isFreeUser ? "text-gray-400" : "text-[#4374FF]"
                }`}
                style={{
                  background: isFreeUser
                    ? "linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)"
                    : "linear-gradient(135deg, #E6EFFF 0%, #D9E3FF 100%)",
                  textShadow: isFreeUser
                    ? "none"
                    : "0px 1px 2px rgba(67, 116, 255, 0.5)",
                  filter: isFreeUser
                    ? "grayscale(100%) opacity(0.6)"
                    : "drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.2))",
                }}
              >
                Plus
              </span>
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
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
        )}
      </div>

      <div className="flex-1 overflow-y-auto research-split-scrollbar relative">
        {/* Dynamic watermarks positioned every 90vh */}
        {watermarkPositions.map((position, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: `${position}px`,
              left: 0,
              width: "100%",
              height: "90vh",
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            <WatermarkOverlay />
          </div>
        ))}

        <div className="pt-5 p-16 relative">
          <div
            className="prose prose-lg max-w-none"
            style={{ lineHeight: "1.8" }}
          >
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ children }) => (
                  <table className="w-full border-collapse border border-gray-300 my-6 shadow-sm rounded-lg overflow-hidden">
                    {children}
                  </table>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gray-50">{children}</thead>
                ),
                th: ({ children }) => (
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700 bg-gray-100">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">
                    {children}
                  </td>
                ),
                tr: ({ children }) => (
                  <tr className="hover:bg-gray-50 transition-colors">
                    {children}
                  </tr>
                ),
                p: ({ children }) => (
                  <p className="mb-4 leading-relaxed">{children}</p>
                ),
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold mb-6 mt-8 text-gray-800 border-b border-gray-200 pb-2">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-semibold mb-4 mt-6 text-gray-800">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-medium mb-3 mt-5 text-gray-700">
                    {children}
                  </h3>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal pl-6 mb-4 space-y-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="leading-relaxed">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 bg-blue-50 py-2 rounded-r">
                    {children}
                  </blockquote>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600">
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto">
                      {children}
                    </code>
                  );
                },
              }}
            >
              {researchData || "Báo cáo nghiên cứu thị trường"}
            </Markdown>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div className="p-12 text-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Đang tải báo cáo nghiên cứu thị trường...</p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="w-full bg-white shadow-lg overflow-hidden">
        <div className="min-h-[400px]">{renderLoadingState()}</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white overflow-hidden">
      {renderContent()}
    </div>
  );
};

export default ResearchScreenTable;
