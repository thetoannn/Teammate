import React, { useState } from "react";
import { SendOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import type { UploadProps } from "antd";

interface AgentChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const AgentChatInput: React.FC<AgentChatInputProps> = ({
  value,
  onChange,
  onSend,
  disabled = false,
  isLoading = false,
}) => {
  const handleSend = () => {
    if (value.trim()) {
      onSend(value);
      onChange("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      console.log("🔄 Enter key pressed, calling handleSend");
      handleSend();
    }
  };

  return (
    <div className="agent-chat-input flex items-center gap-2 p-4 border-t border-gray-200 no-overflow">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Bạn có thể hỏi bất cứ điều gì..."
        className="flex-1 p-2 border rounded resize-none chat-input-format responsive-text"
        rows={2}
        disabled={disabled}
        style={{
          minHeight: "50px",
          maxHeight: "120px",
          overflowY: "auto",
          overflowX: "hidden",
          wordWrap: "break-word",
          wordBreak: "break-word",
          whiteSpace: "pre-wrap",
        }}
      />
      <div className="relative group">
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim() || isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded flex items-center justify-center flex-shrink-0 hover:bg-blue-600 transition-colors"
          style={{ minWidth: "60px" }}
        >
          {isLoading ? (
            <img
              src="/icon-load-respond.png"
              alt="Loading"
              className="w-4 h-4 animate-spin"
            />
          ) : (
            "Send"
          )}
        </button>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
          Gửi tin nhắn
        </div>
      </div>
    </div>
  );
};
