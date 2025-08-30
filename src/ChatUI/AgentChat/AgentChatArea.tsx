import React, { useState } from "react";

import { AgentChatInput } from "./AgentChatInput";
import { StreamingChatService } from "./StreamingChatService";
import { AgentMessage as AgentMessageType } from "./AgentChatTypes";
import AgentMessage from "./components/AgentMessage";

interface AgentChatAreaProps {
  agentId?: string;
  sessionId?: string;
}

export const AgentChatArea: React.FC<AgentChatAreaProps> = ({
  agentId,
  sessionId = "default-session",
}) => {
  const [messages, setMessages] = useState<AgentMessageType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [currentAgent, setCurrentAgent] = useState<string | null>(null);
  const streamingService = StreamingChatService.getInstance();

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    console.log("🔄 AgentChatArea: Starting to send message:", message);

    const userMessage: AgentMessageType = {
      id: `user-${Date.now()}`,
      content: message,
      type: "text",
      timestamp: new Date(),
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setCurrentAgent("AI");

    // Create initial AI message that will be updated with streaming content
    const initialAiMessage: AgentMessageType = {
      id: `ai-${Date.now()}`,
      content: "",
      type: "text",
      timestamp: new Date(),
      sender: "ai",
      metadata: { agentName: "AI" },
    };

    setMessages((prev) => [...prev, initialAiMessage]);

    try {
      await streamingService.sendMessage(sessionId, message, {
        // onChunk callback - update the message content as chunks arrive
        onChunk: (chunk: string) => {
          console.log(
            "📊 AgentChatArea: Received chunk:",
            chunk.substring(0, 100)
          );
          setMessages((prev) => {
            return prev.map((msg) => {
              if (msg.id === initialAiMessage.id) {
                return {
                  ...msg,
                  content: (msg.content || "") + chunk,
                };
              }
              return msg;
            });
          });
        },
        // onComplete callback - finalize the response
        onComplete: (fullResponse: string) => {
          console.log(
            "✅ AgentChatArea: Stream completed with full response length:",
            fullResponse.length
          );
          setIsTyping(false);
          setCurrentAgent(null);

          // Ensure the final message has the complete response
          setMessages((prev) => {
            return prev.map((msg) => {
              if (msg.id === initialAiMessage.id) {
                return {
                  ...msg,
                  content: fullResponse,
                };
              }
              return msg;
            });
          });
        },
        // onError callback - handle errors
        onError: (error: Error) => {
          console.error("❌ AgentChatArea: Stream error:", error);
          setIsTyping(false);
          setCurrentAgent(null);

          setMessages((prev) => {
            return prev.map((msg) => {
              if (msg.id === initialAiMessage.id) {
                return {
                  ...msg,
                  content:
                    "Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại sau.",
                };
              }
              return msg;
            });
          });
        },
      });
    } catch (error) {
      console.error("❌ AgentChatArea: Error in handleSendMessage:", error);
      setIsTyping(false);
      setCurrentAgent(null);

      // Update the AI message with error content
      setMessages((prev) => {
        return prev.map((msg) => {
          if (msg.id === initialAiMessage.id) {
            return {
              ...msg,
              content: "Hệ thống đang nâng cấp, vui lòng quay lại sau ít phút!",
            };
          }
          return msg;
        });
      });
    }
  };

  return (
    <div className="agent-chat-area flex flex-col h-full bg-white dark:bg-st-dark-secondary">
      <div className="chat-messages flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <AgentMessage
            key={message.id}
            content={message.content}
            time={message.timestamp.toLocaleTimeString()}
            sender={message.sender}
            agentName={message.metadata?.agentName}
          />
        ))}
        {isTyping && (
          <div className="agent-typing-indicator flex items-center gap-2">
            <img
              className="w-5 h-5 loading-icon"
              src="/loading.gif"
              alt="Loading..."
            />
            <div className="loading-text active text-sm">
              {currentAgent
                ? "Vui lòng chờ trong giây lát..."
                : `${currentAgent} đang phản hồi...`}
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-container border-t border-gray-200 dark:border-st-dark-border">
        <AgentChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          disabled={isTyping}
          isLoading={isTyping}
        />
      </div>
    </div>
  );
};
