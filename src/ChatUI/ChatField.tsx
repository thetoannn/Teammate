import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ChatInput from "./ChatInput";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AgentMessage } from "./AgentChat/AgentChatTypes";
import { StreamingChatService } from "./AgentChat/StreamingChatService";

import { FileHelper } from "../helper/FileHelper";
import { StringHelper } from "../helper/StringHelper";
import AgentTable from "./AgentChat/components/AgentTable";
import { ProductToolWrapper } from "./AgentChat/ProductListTable";
import AgentResearchNoMessage from "./components/AgentRearchNoMessage";
import ImageToolWrapper from "./components/ImageToolWrapper";
import ResearchToolWrapper from "./components/ResearchToolWrapper";
import ResizableSplitPane from "./components/ResizableSplitPane";
import { ImageAILayout } from "./ImgToolLayout";
import { SplitImgViewer } from "./ImgToolLayout/SplitImgViewer";
import {
  isImageRelatedMessage,
  isMarketingAssistantPage,
} from "./utils/imageMessageDetector";
import { detectProductListMessage } from "./utils/productListMessageDetector";
import {
  detectResearchMessage,
  isResearchAgentPage,
} from "./utils/researchMessageDetector";

const streamingService = StreamingChatService.getInstance();
const waitImgEffect = "/icon-wait.png";

interface ChatFieldProps {
  onResearchSplitToggle?: (isOpen: boolean, data?: any) => void;
  showResearchSplit?: boolean;
}

export default function ChatField({
  onResearchSplitToggle,
  showResearchSplit = false,
}: ChatFieldProps = {}) {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentAiResponse, setCurrentAiResponse] = useState<string>("");
  const [lastImageResponse, setLastImageResponse] = useState<string>("");
  const [lastProductResponse, setLastProductResponse] = useState<string>("");
  const [lastResearchResponse, setLastResearchResponse] = useState<string>("");
  const [showImageSplit, setShowImageSplit] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
  const sessionId = "default-session";

  const isImageAITool = searchParams.get("tool") === "media-ai";

  // Utility functions for agent-specific storage
  const getCurrentAgent = (): string => {
    const agent = searchParams.get("agent");
    return agent || "marketing-assistant"; // Default to marketing-assistant
  };

  const getStorageKeyForAgent = (agent: string): string => {
    return `chat-messages-${agent}`;
  };

  const getCurrentStorageKey = (): string => {
    return getStorageKeyForAgent(getCurrentAgent());
  };

  const handleSendMessageFromURL = async (message: string) => {
    if (!message.trim()) return;

    console.log("🔄 ChatField: Sending message from URL:", message);

    setCurrentAiResponse("");

    setIsTyping(true);

    const currentAgent = searchParams.get("agent");

    let currentStreamAiResponse = "";
    try {
      await streamingService.sendMessage(
        sessionId,
        message,
        {
          onChunk: (chunk: string) => {
            currentStreamAiResponse += chunk;

            if (isImageRelatedMessage(message)) {
              setLastImageResponse((prev) => prev + chunk);
            }

            if (detectProductListMessage(message)) {
              setLastProductResponse((prev) => prev + chunk);
            }

            if (detectResearchMessage(message)) {
              setLastResearchResponse((prev) => prev + chunk);
            }

            if (isImageAITool && chunk.includes("http")) {
              const imageUrlMatch = chunk.match(
                /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))/i
              );
              if (imageUrlMatch) {
                setCurrentImageUrl(imageUrlMatch[0]);
                setShowImageSplit(true);
              }
            }

            if (chunk.trim()) {
              setMessages((prev) => [
                ...prev.filter((m) => m.id !== "ai-temp"),
                {
                  id: "ai-temp",
                  content: currentAiResponse + chunk,
                  type: "text",
                  timestamp: new Date(),
                  sender: "ai",
                },
              ]);
            }
          },
          onComplete: (fullResponse: string) => {
            setCurrentAiResponse(fullResponse);

            if (isImageRelatedMessage(message)) {
              setLastImageResponse(fullResponse);
            }

            if (detectProductListMessage(message)) {
              setLastProductResponse(fullResponse);
            }

            if (detectResearchMessage(message)) {
              setLastResearchResponse(fullResponse);
            }

            if (isImageAITool && fullResponse.includes("http")) {
              const imageUrlMatch = fullResponse.match(
                /(https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp))/i
              );
              if (imageUrlMatch) {
                setCurrentImageUrl(imageUrlMatch[0]);
                setShowImageSplit(true);
              }
            }

            setMessages((prev) => [
              ...prev.filter((m) => m.id !== "ai-temp"),
              {
                id: `ai-${Date.now()}-${Math.random()
                  .toString(36)
                  .substr(2, 9)}`,
                content: fullResponse,
                type: "text",
                timestamp: new Date(),
                sender: "ai",
              },
            ]);

            setIsTyping(false);
          },
          onError: (error: Error) => {
            console.error("❌ ChatField: Stream error:", error);
            const errorContent = "AI error: " + error.message;
            setCurrentAiResponse(errorContent);

            setMessages((prev) => [
              ...prev,
              {
                id: `ai-${Date.now()}`,
                content: errorContent,
                type: "text",
                timestamp: new Date(),
                sender: "ai",
              },
            ]);

            setIsTyping(false);
          },
        },
        currentAgent || undefined
      );
    } catch (error: any) {
      console.error("❌ ChatField: Error in handleSendMessageFromURL:", error);
      const errorContent = "AI error: " + (error?.message || "Unknown error");
      setCurrentAiResponse(errorContent);

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          content: errorContent,
          type: "text",
          timestamp: new Date(),
          sender: "ai",
        },
      ]);

      setIsTyping(false);
    }
  };

  useEffect(() => {
    const currentStorageKey = getCurrentStorageKey();
    const stored = localStorage.getItem(currentStorageKey);
    let parsed: AgentMessage[] = stored ? JSON.parse(stored) : [];

    parsed = parsed.map((msg) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));

    setMessages(parsed);

    const messageFromURL = searchParams.get("message");
    const decoded = messageFromURL
      ? decodeURIComponent(messageFromURL.trim())
      : null;

    if (decoded && decoded !== "") {
      const alreadyExists = parsed.some((m) => m.content === decoded);

      if (!alreadyExists) {
        const newMessage: AgentMessage = {
          id: `user-${uuidv4()}`,
          content: decoded,
          type: "text",
          timestamp: new Date(),
          sender: "user",
        };

        setMessages((prev) => {
          const updated = [...prev, newMessage];
          localStorage.setItem(currentStorageKey, JSON.stringify(updated));
          return updated;
        });

        const currentAgent = searchParams.get("agent");
        const currentTool = searchParams.get("tool");

        let targetUrl = "";
        if (currentAgent) {
          targetUrl = `/chat?agent=${currentAgent}`;
        } else if (currentTool) {
          targetUrl = `/chat?tool=${currentTool}`;
        } else {
          targetUrl = `/chat?agent=marketing-assistant`;
        }

        navigate(targetUrl, { replace: true });

        setTimeout(() => {
          handleSendMessageFromURL(decoded);
        }, 500);
      }
    }
  }, [searchParams]);

  const saveMessage = (messages: AgentMessage[]) => {
    const currentStorageKey = getCurrentStorageKey();
    localStorage.setItem(currentStorageKey, JSON.stringify(messages));
    console.log("🔄 ChatField: Saved messages to", currentStorageKey, messages);
  };

  useEffect(() => {
    const currentStorageKey = getCurrentStorageKey();
    localStorage.setItem(currentStorageKey, JSON.stringify(messages));
  }, [messages, searchParams]);

  const handleSendMessage = async (message: string, images?: File[]) => {
    if (!message.trim() && (!images || images.length === 0)) return;

    if (isImageAITool && !showImageSplit) {
      setTimeout(() => {
        setShowImageSplit(true);
      }, 300);
    }

    const userMessage: AgentMessage = {
      id: `user-${uuidv4()}`,
      content: message,
      type: "text",
      timestamp: new Date(),
      sender: "user",
    };

    if (images && images.length > 0) {
      const base64Images = await Promise.all(
        images.map(FileHelper.fileToBase64)
      );
      userMessage.metadata = {
        ...userMessage.metadata,
        imageUrls: base64Images,
      };

      if (isImageAITool && base64Images.length > 0) {
        setCurrentImageUrl(base64Images[0]);
        setShowImageSplit(true);
      }
    }

    const newMessages = [
      ...messages,
      userMessage,
      {
        id: "ai-temp",
        content: "",
        type: "text",
        timestamp: new Date(),
        sender: "ai",
        variant: "text",
      } as AgentMessage,
    ];
    setMessages(newMessages);
    saveMessage(newMessages);

    setIsTyping(true);

    const currentAgent = searchParams.get("agent");

    let currentStreamAiResponse = "";
    let currentVariant: "text" | "canvas" = "text";
    let currentTempId = "ai-temp";

    try {
      currentVariant = "text";
      await streamingService.sendMessage(
        sessionId,
        message,
        {
          onChunk: (chunk: string, variant: "text" | "canvas") => {
            console.log(
              "📝 Received chunk with variant:",
              variant,
              "Current variant:",
              currentVariant
            );

            if (
              variant !== currentVariant &&
              currentStreamAiResponse.length > 0
            ) {
              setMessages((prev) => {
                const finalizedMessages = prev.map((m) =>
                  m.id === currentTempId
                    ? {
                        ...m,
                        id: `ai-${uuidv4()}`,
                        content: currentStreamAiResponse,
                        variant: currentVariant,
                        timestamp: new Date(),
                      }
                    : m
                );

                const newTempId = `ai-temp-${Date.now()}`;
                currentTempId = newTempId;
                currentVariant = variant;
                currentStreamAiResponse = chunk;

                return [
                  ...finalizedMessages,
                  {
                    id: newTempId,
                    content: chunk,
                    type: "text",
                    timestamp: new Date(),
                    sender: "ai",
                    variant: variant,
                  } as AgentMessage,
                ];
              });
            } else {
              currentStreamAiResponse += chunk;
              currentVariant = variant;

              if (!StringHelper.isEmpty(chunk)) {
                setMessages((prev) => [
                  ...prev.filter((m) => m.id !== currentTempId),
                  {
                    id: currentTempId,
                    content: currentStreamAiResponse,
                    type: "text",
                    timestamp: new Date(),
                    sender: "ai",
                    variant: variant,
                  },
                ]);
              }
            }

            console.log(
              "🔄 ChatField: Updated messages with variant:",
              variant
            );
          },
          onComplete: () => {
            setMessages((prev) => {
              const newMessages = prev.map((m) =>
                m.id === currentTempId
                  ? {
                      ...m,
                      id: `ai-${uuidv4()}`,
                      timestamp: new Date(),
                    }
                  : m
              );
              saveMessage(newMessages);
              return newMessages;
            });

            setIsTyping(false);
          },
          onError: (error: Error) => {
            console.error("❌ ChatField: Stream error:", error);
            const errorContent = "AI error: " + error.message;

            setMessages((prev) => {
              const newMessages = prev.map((m) =>
                m.id === currentTempId
                  ? {
                      ...m,
                      id: `ai-${uuidv4()}`,
                      content: errorContent,
                      timestamp: new Date(),
                    }
                  : m
              );
              saveMessage(newMessages);
              return newMessages;
            });

            setIsTyping(false);
          },
        },
        currentAgent || undefined
      );
    } catch (error: any) {
      console.error("❌ ChatField: Error in handleSendMessage:", error);
      currentStreamAiResponse =
        "AI error: " + (error?.message || "Unknown error");

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${uuidv4()}`,
          content: currentStreamAiResponse,
          type: "text",
          timestamp: new Date(),
          sender: "ai",
        },
      ]);

      setIsTyping(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const renderImageGroups = (images: string[]) => {
    const containerWidth = 660;
    const minImageWidth = 200;
    const gap = 8;

    const imagesPerRow = Math.floor(containerWidth / (minImageWidth + gap));
    const rowCount = Math.ceil(images.length / imagesPerRow);

    const groups = [];
    for (let i = 0; i < rowCount; i++) {
      groups.push(images.slice(i * imagesPerRow, (i + 1) * imagesPerRow));
    }

    return groups.map((group, groupIndex) => (
      <div key={groupIndex} className="flex gap-2 mb-2">
        {group.map((image, index) => (
          <div
            key={index}
            className="flex-1 min-w-[120px] max-w-[calc(33.333%-8px)] bg-transparent"
          >
            <img
              src={image}
              alt={`uploaded-${groupIndex * imagesPerRow + index}`}
              className="w-full h-auto max-h-[120px] object-cover rounded-lg bg-transparent"
            />
          </div>
        ))}
      </div>
    ));
  };

  const renderMessageContent = (
    message: AgentMessage,
    messageIndex: number
  ) => {
    const { content, metadata, type, sender } = message;

    if (message.variant === "canvas") {
      return <></>;
    }
    if (sender === "user") {
      return (
        <div className="flex flex-col gap-2 max-w-[700px] m-auto">
          {metadata?.imageUrls && metadata.imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {metadata.imageUrls.map((imageUrl: string, index: number) => (
                <div key={index} className="relative w-[120px] h-[90px]">
                  <img
                    src={imageUrl}
                    alt={`User uploaded image ${index + 1}`}
                    className="w-full h-full rounded-lg object-cover border border-gray-600"
                  />
                </div>
              ))}
            </div>
          )}

          {content && (
            <div className="bg-[#343434] text-white text-[14px] leading-[1.6] tracking-[0.2px] font-sans font-regular px-4 py-2 rounded-xl rounded-br-none overflow-hidden chat-message-format">
              {content}
            </div>
          )}
        </div>
      );
    }

    const defaultColumns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        ellipsis: true,
      },
      {
        title: "Value",
        dataIndex: "value",
        key: "value",
        ellipsis: true,
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        ellipsis: true,
      },
    ];

    if (type === "table" || metadata?.tableData) {
      const tableData = metadata?.tableData || [];
      const columns =
        metadata?.columns ||
        (tableData.length > 0
          ? Object.keys(tableData[0] || {}).map((key) => ({
              title: key.charAt(0).toUpperCase() + key.slice(1),
              dataIndex: key,
              key: key,
              ellipsis: true,
            }))
          : defaultColumns);

      return (
        <>
          {content && (
            <div className="text-white text-[14px] leading-[1.6] tracking-[0.2px] font-sans font-regular py-2 rounded-2xl rounded-tl-none overflow-hidden chat-message-format">
              <ReactMarkdown
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
                    <p className="mb-4 leading-relaxed text-white">
                      {children}
                    </p>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mb-6 mt-8 text-white border-b border-gray-200 pb-2">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold mb-4 mt-6 text-white">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-medium mb-3 mt-5 text-white">
                      {children}
                    </h3>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 mb-4 space-y-2 marker:text-white">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-6 mb-4 space-y-2 marker:text-white">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed mb-4 text-white">
                      {children}
                    </li>
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
                {content}
              </ReactMarkdown>
            </div>
          )}
          <AgentTable data={tableData} columns={columns} />
        </>
      );
    }

    if (type === "image" || metadata?.imageUrl || metadata?.imageUrls) {
      const imageUrls = metadata?.imageUrls || [metadata?.imageUrl];
      return (
        <>
          {content && (
            <div className="text-white text-[14px] leading-[1.6] tracking-[0.2px] font-sans font-regular py-2 rounded-2xl rounded-tl-none overflow-hidden chat-message-format">
              <ReactMarkdown
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
                    <p className="mb-4 leading-relaxed text-white">
                      {children}
                    </p>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mb-6 mt-8 text-white border-b border-gray-200 pb-2">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold mb-4 mt-6 text-white">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-medium mb-3 mt-5 text-white">
                      {children}
                    </h3>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 mb-4 space-y-2 marker:text-white">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-6 mb-4 space-y-2 marker:text-white">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed mb-4 text-white">
                      {children}
                    </li>
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
                {content}
              </ReactMarkdown>
            </div>
          )}
          {renderImageGroups(imageUrls)}
        </>
      );
    }

    if (type === "mixed") {
      const tableData = metadata?.tableData || [];
      const columns =
        metadata?.columns ||
        (tableData.length > 0
          ? Object.keys(tableData[0] || {}).map((key) => ({
              title: key.charAt(0).toUpperCase() + key.slice(1),
              dataIndex: key,
              key: key,
              ellipsis: true,
            }))
          : defaultColumns);

      return (
        <>
          {content && (
            <div className="text-white text-[14px] leading-[1.6] tracking-[0.2px] font-sans font-regular py-2 rounded-2xl rounded-tl-none overflow-hidden chat-message-format">
              <ReactMarkdown
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
                    <p className="mb-4 leading-relaxed text-white">
                      {children}
                    </p>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-bold mb-6 mt-8 text-white border-b border-gray-200 pb-2">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold mb-4 mt-6 text-white">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-medium mb-3 mt-5 text-white">
                      {children}
                    </h3>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 mb-4 space-y-2 marker:text-white">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-6 mb-4 space-y-2 marker:text-white">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="leading-relaxed mb-4 text-white">
                      {children}
                    </li>
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
                {content}
              </ReactMarkdown>
            </div>
          )}
          {metadata?.tableData && (
            <AgentTable data={metadata.tableData || []} columns={columns} />
          )}
          {metadata?.imageUrls && renderImageGroups(metadata.imageUrls)}
          {metadata?.imageUrl && !metadata?.imageUrls && (
            <img
              src={metadata.imageUrl}
              alt={metadata.imageAlt || "AI Generated Image"}
              className="w-full h-auto max-h-[200px] object-cover rounded-lg"
            />
          )}
        </>
      );
    }

    return (
      <div className="text-white text-[14px] leading-[1.6] tracking-[0.2px] font-sans font-regular py-2 rounded-2xl rounded-tl-none overflow-hidden chat-message-format">
        <ReactMarkdown
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
              <tr className="hover:bg-gray-50 transition-colors">{children}</tr>
            ),
            p: ({ children }) => (
              <p className="mb-4 leading-relaxed text-white">{children}</p>
            ),
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold mb-6 mt-8 text-white border-b border-gray-200 pb-2">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-semibold mb-4 mt-6 text-white">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-medium mb-3 mt-5 text-white">
                {children}
              </h3>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-6 mb-4 space-y-2 marker:text-white">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-6 mb-4 space-y-2 marker:text-white">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed mb-4 text-white">{children}</li>
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
          {content}
        </ReactMarkdown>
      </div>
    );
  };

  const renderChatContent = () => (
    <div
      className={`flex-1 overflow-y-auto ${
        showResearchSplit || (isImageAITool && showImageSplit)
          ? "chat-field-split-scrollbar"
          : " "
      }`}
      style={{
        backgroundColor: "transparent",
        height:
          showResearchSplit || (isImageAITool && showImageSplit)
            ? "calc(100% - 108px)"
            : "calc(80vh - 200px)",
        paddingTop:
          showResearchSplit || (isImageAITool && showImageSplit)
            ? "0px"
            : "80px",
        paddingBottom:
          showResearchSplit || (isImageAITool && showImageSplit)
            ? "40px"
            : "80px",
        marginTop:
          showResearchSplit || (isImageAITool && showImageSplit)
            ? "80px"
            : "0px",
      }}
    >
      {messages.length === 0 && searchParams.get("tool") === "media-ai" ? (
        <div className="w-full overflow-x-hidden">
          <div className="w-full max-w-[730px] mx-auto px-4 sm:px-[8px]">
            <div className="vietnamese-greeting mb-6">
              Xin chào, Bạn muốn{" "}
              <span className="sparkle-container">
                <img
                  src="/icon-spaik-liner.svg"
                  alt="sparkle"
                  className="sparkle-icon"
                />
                <span className="gradient-text-sang-tao mr-4">sáng tạo</span>
              </span>{" "}
              gì hôm nay?
            </div>

            <div className="w-full">
              <ChatInput
                onSendMessage={handleSendMessage}
                isLoading={isTyping}
                showResearchSplit={false}
                isImageAITool={isImageAITool}
              />
            </div>
          </div>

          <div className="w-full ml-5 mt-2">
            <ImageAILayout onSendMessage={handleSendMessage} />
          </div>
        </div>
      ) : (
        <div className="w-full overflow-x-hidden">
          {/* Chat messages container with proper alignment */}
          <div className="w-full max-w-[730px] mx-auto px-4 sm:px-[8px]">
            {messages.length === 0 ? (
              <div className="text-center text-white">
                <div className="py-15 text-[30px] font-bold mb-[-30px]">
                  Xin chào, tôi có thể giúp gì cho bạn?
                </div>
                <AgentResearchNoMessage onSendMessage={handleSendMessage} />
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`${
                    index === messages.length - 1 ? "mb-2" : "mb-4"
                  } w-full`}
                >
                  <div
                    className={clsx(
                      "flex gap-2 items-start w-full",
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={clsx(
                        "flex flex-col gap-1 max-w-[85%] break-words",
                        msg.sender === "user" ? "items-end" : "items-start"
                      )}
                      style={{
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        wordBreak: "break-word"
                      }}
                    >
                      {renderMessageContent(msg, index)}
                      {msg.sender === "user" && (
                        <div
                          className={clsx(
                            "message-timestamp text-xs text-gray-500 mt-1",
                            "text-right"
                          )}
                        >
                          {msg.timestamp.toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {msg.sender === "user" &&
                    isImageRelatedMessage(msg.content) &&
                    isMarketingAssistantPage(
                      location.pathname,
                      location.search
                    ) && (
                      <div className="w-full mt-3 mb-2">
                        <ImageToolWrapper
                          aiResponse={lastImageResponse}
                          isVisible={true}
                          isLoading={isTyping}
                        />
                      </div>
                    )}

                  {msg.sender === "user" &&
                    detectProductListMessage(msg.content) &&
                    isMarketingAssistantPage(
                      location.pathname,
                      location.search
                    ) && (
                      <div className="w-full mt-3 mb-2">
                        <ProductToolWrapper
                          aiResponse={lastProductResponse}
                          isVisible={true}
                          isLoading={isTyping}
                        />
                      </div>
                    )}

                  {msg.sender === "ai" &&
                    msg.variant === "canvas" &&
                    isResearchAgentPage(location.pathname, location.search) && (
                      <div className="w-full mt-3 mb-2">
                        <ResearchToolWrapper
                          aiResponse={msg.content}
                          researchData={msg.content}
                          isLoading={isTyping}
                          onSplitScreenToggle={onResearchSplitToggle}
                        />
                      </div>
                    )}
                </div>
              ))
            )}
            {isTyping && (
              <div className="agent-typing-indicator flex items-center gap-2 mb-4">
                <img
                  className="w-5 h-5 loading-icon"
                  src="/loading.gif"
                  alt="Loading..."
                />
                <div className="loading-text active text-sm">
                  {searchParams.get("tool") === "media-ai" ||
                  searchParams.get("agent")
                    ? "Vui lòng chờ trong giây lát..."
                    : `${searchParams.get("agent")} đang phản hồi...`}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
    </div>
  );

  const renderChatInput = () => (
    <div
      className="flex-shrink-0 relative w-full"
      style={{
        height:
          showResearchSplit || (isImageAITool && showImageSplit)
            ? "108px"
            : "120px",
        minHeight:
          showResearchSplit || (isImageAITool && showImageSplit)
            ? "158px"
            : "120px",
        backgroundColor: "transparent",
        position:
          showResearchSplit || (isImageAITool && showImageSplit)
            ? "relative"
            : "fixed",
        bottom:
          showResearchSplit || (isImageAITool && showImageSplit) ? "auto" : "0",
        left:
          showResearchSplit || (isImageAITool && showImageSplit) ? "auto" : "0",
        right:
          showResearchSplit || (isImageAITool && showImageSplit) ? "auto" : "0",
      }}
    >
      <div className="w-full overflow-x-hidden">
        <div className="left-[24px] w-full max-w-[730px] mx-auto px-4 sm:px-[8px] h-full flex items-center relative">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isTyping}  
            showResearchSplit={
              showResearchSplit || (isImageAITool && showImageSplit)
            }
            isImageAITool={isImageAITool}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="flex flex-col text-white"
      style={{
        height:
          showResearchSplit || (isImageAITool && showImageSplit)
            ? "100%"
            : searchParams.get("tool") === "media-ai" && messages.length === 0
            ? "100vh"
            : "85vh",
      }}
    >
      {/* Use ResizableSplitPane for image split screen */}
      {isImageAITool && showImageSplit ? (
        <ResizableSplitPane
          defaultLeftWidth={40}
          minLeftWidth={30}
          maxLeftWidth={70}
          leftPane={
            <div className="w-full flex flex-col relative min-h-0 h-full">
              {renderChatContent()}

              {!(
                searchParams.get("tool") === "media-ai" && messages.length === 0
              ) && renderChatInput()}
            </div>
          }
          rightPane={
            <div className="bg-white rounded-xl  shadow-lg mt-16 mr-2 mb-2 ml-1 min-h-0 h-full overflow-hidden">
              <div className="h-full flex flex-col min-h-0">
                <div className="flex-1 min-h-0 h-full">
                  <SplitImgViewer
                    isOpen={true}
                    imageUrl={currentImageUrl}
                    imageUrls={
                      messages.length > 0 &&
                      messages[messages.length - 1]?.metadata?.imageUrls
                        ? messages[messages.length - 1].metadata!.imageUrls
                        : undefined
                    }
                    onClose={() => setShowImageSplit(false)}
                  />
                </div>
              </div>
            </div>
          }
        />
      ) : (
        <>
          {renderChatContent()}

          {!(
            searchParams.get("tool") === "media-ai" && messages.length === 0
          ) && renderChatInput()}
        </>
      )}
    </div>
  );
}
