import React, { useState, useMemo } from "react";
import { Image } from "antd";
import type { ComponentPropsWithoutRef } from "react";

type AgentMessageProps = {
  content: string;
  time: string;
  sender: "user" | "ai" | "agent";
  agentName?: string;
};

const MarkdownImage = React.memo((props: ComponentPropsWithoutRef<"img">) => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div className="my-3 flex justify-center">
      <img
        onClick={() => setVisible(true)}
        style={{ width: "150px", height: "auto", cursor: "pointer" }}
        {...props}
        alt={props.alt || ""}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="max-w-sm max-h-64 w-auto h-auto cursor-pointer rounded-lg shadow-sm"
      />

      <Image.PreviewGroup
        preview={{
          visible,
          onVisibleChange: (vis) => setVisible(vis),
        }}
      >
        <Image
          src={props.src}
          alt={props.alt || ""}
          style={{ display: "none" }}
        />
      </Image.PreviewGroup>
    </div>
  );
});

const AgentMessage = React.memo((props: AgentMessageProps) => {
  const { content, time, sender, agentName } = props;
  const isUser = sender === "user";

  const transformedContent = useMemo(() => {
    if (!content) return "";

    // Remove markdown formatting characters
    let cleanedContent = content
      .replace(/\*\*\*(.*?)\*\*\*/g, "$1") // Remove ***bold italic***
      .replace(/\*\*(.*?)\*\*/g, "$1") // Remove **bold**
      .replace(/\*(.*?)\*/g, "$1") // Remove *italic*
      .replace(/__(.*?)__/g, "$1") // Remove __underline__
      .replace(/_(.*?)_/g, "$1"); // Remove _underline_

    return cleanedContent;
  }, [content]);

  const messageContent = useMemo(
    () => (
      <div className="text-[#ffffff] text-[14px] leading-[1.6] tracking-[0.2px] font-sans font-regular py-2 rounded-2xl rounded-tl-none dark:text-white overflow-hidden chat-message-format">
        <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
          {transformedContent}
        </pre>
      </div>
    ),
    [transformedContent]
  );

  const userMessageContent = useMemo(
    () => (
      <div className="bg-[#db2777] text-white text-[14px] leading-[1.6] tracking-[0.2px] font-sans font-regular px-4 py-2 rounded-2xl rounded-tr-none dark:bg-st-dark-tertiary-1 dark:text-white overflow-hidden chat-message-format">
        <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
          {transformedContent}
        </pre>
      </div>
    ),
    [transformedContent]
  );

  return (
    <div
      className={`flex items-start ${
        isUser ? "justify-end" : "justify-start"
      } mb-3`}
    >
      {!isUser && (
        <div className="flex gap-3">
          <div className="w-full max-w-[800px]">{messageContent}</div>
        </div>
      )}

      {isUser && (
        <div className="flex gap-3 flex-row-reverse">
          <div className="text-left max-w-[800px]">
            {userMessageContent}
            <p className="text-xs text-gray-500 mt-1 text-right">{time}</p>
          </div>
        </div>
      )}
    </div>
  );
});

AgentMessage.displayName = "AgentMessage";

export default AgentMessage;
