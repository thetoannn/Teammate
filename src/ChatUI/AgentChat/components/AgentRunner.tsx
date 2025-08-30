import React, { useState } from "react";
import { AgentMessage as AgentMessageType } from "../AgentChatTypes";
import { v4 as uuidv4 } from "uuid";
import { AgentChatService } from "../AgentChatService";
import AgentMessage from "./AgentMessage";

export const AgentRunner: React.FC = () => {
  const [messages, setMessages] = useState<AgentMessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const chatService = AgentChatService.getInstance();

  const runAgent = async () => {
    setLoading(true);

    // Create initial AI message that will be updated with streaming content
    const initialAiMessage: AgentMessageType = {
      id: uuidv4(),
      sender: "ai",
      content: "",
      metadata: { agentName: "AI Agent" },
      type: "text",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, initialAiMessage]);

    try {
      const sessionId = `session-${Date.now()}`;
      const promptData = "Hello, show me agent activities";

      console.log("🚀 Starting agent run with:", { sessionId, promptData });

      const response = await chatService.runSuperAgent(sessionId, promptData);

      let currentMessage = "";
      await chatService.processStreamingResponse(
        response,
        // onChunk callback - update the message content as chunks arrive
        (chunk: string) => {
          console.log("==========");
          currentMessage += chunk;
          console.log("📊 Received chunk:", chunk);
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
        (fullResponse: string) => {
          console.log("✅ Stream completed with full response:", fullResponse);
          setLoading(false);

          // If no content was received, show a fallback message
          if (!fullResponse || fullResponse.trim() === "") {
            setMessages((prev) => {
              return prev.map((msg) => {
                if (msg.id === initialAiMessage.id) {
                  return {
                    ...msg,
                    content:
                      "No response received from AI. The API may be unavailable or returned empty content.",
                  };
                }
                return msg;
              });
            });
          }
        },
        // onError callback - handle errors
        (error: Error) => {
          console.error("❌ Stream error:", error);
          setLoading(false);

          setMessages((prev) => {
            return prev.map((msg) => {
              if (msg.id === initialAiMessage.id) {
                return {
                  ...msg,
                  content: `Error: ${
                    error.message || "Unknown error occurred"
                  }`,
                };
              }
              return msg;
            });
          });
        }
      );
    } catch (error) {
      console.error("❌ Error running agent:", error);
      setLoading(false);

      // Update the AI message with error content
      setMessages((prev) => {
        return prev.map((msg) => {
          if (msg.id === initialAiMessage.id) {
            return {
              ...msg,
              content: `Error: ${
                error instanceof Error
                  ? error.message
                  : "Unknown error occurred"
              }`,
            };
          }
          return msg;
        });
      });
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-4 flex gap-2">
        <button
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={runAgent}
          disabled={loading}
        >
          {loading ? "Running agent..." : "Run AI Agent"}
        </button>

        <button
          className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
          onClick={clearMessages}
          disabled={loading}
        >
          Clear Messages
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            Click "Run AI Agent" to test the API connection
          </div>
        ) : (
          messages.map((msg, idx) => (
            <AgentMessage
              key={msg.id || idx}
              content={msg.content}
              time={msg.timestamp.toLocaleTimeString()}
              sender={msg.sender}
              agentName={msg.metadata?.agentName}
            />
          ))
        )}

        {loading && (
          <div className="flex items-center gap-2 text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>AI is processing your request...</span>
          </div>
        )}
      </div>
    </div>
  );
};
