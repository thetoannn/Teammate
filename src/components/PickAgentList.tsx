import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

interface Agent {
  icon: string;
  name: string;
  link: string;
}

interface PickAgentListProps {
  onAgentSelect: (agent: Agent) => void;
  onClose: () => void;
}
const iconSpark = "/icon-spark.png";
const facebIconIconSide = "/icon-facebook-liner.png";
const teleIconSide = "/icon-telescope.png";
const renderIconSide = "/icon-media.svg";
const agentIconSide = "/icon-assistant.png";

const whiteBrandIconSide = "/white-brand-logo-main.png";

const PickAgentList: React.FC<PickAgentListProps> = ({
  onAgentSelect,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const agents: Agent[] = [
    {
      icon: agentIconSide,
      name: "Marketing Assistant Agent",
      link: "/chat?agent=marketing-assistant",
    },

    {
      icon: teleIconSide,
      name: "Research Agent",
      link: "/chat?agent=research",
    },
    {
      icon: facebIconIconSide,
      name: "Facebook Lead Agent",
      link: "/chat?agent=facebook-lead",
    },
    {
      icon: renderIconSide,
      name: "Media Creator Agent",
      link: "/chat?tool=media-ai",
    },
  ];

  const handleAgentClick = (agent: Agent) => {
    onAgentSelect(agent);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      className="fixed left-[65px] bottom-[198px] w-[254px] bg-[#312E2E] h-[320px] text-white p-4 shadow-lg z-10 animate-slideRightAgent rounded-[20px]"
      ref={containerRef}
    >
      <div className="flex items-center space-x-2 mb-4">
        <img src={whiteBrandIconSide} alt="Brand Logo" className="w-6 h-6 " />
        <span className="text-sm font-medium">Agent List</span>
        <img
          className="absolute top-4 left-29 w-3 h-3"
          src={iconSpark}
          alt=""
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {agents.map((agent, index) => (
          <div key={index} className="aspect-square">
            <Link
              to={agent.link}
              onClick={() => handleAgentClick(agent)}
              className="flex flex-col items-center justify-center w-full h-full p-2 rounded-3xl bg-[#454343] shadow-[0_2px_19px_0_rgba(255,255,255,0.1)] hover:bg-[#3d3d3d] transition-colors duration-300 group min-h-[100px]"
            >
              <img
                src={agent.icon}
                alt={agent.name}
                className={`${
                  agent.icon.includes("assistant.png") ? "w-9 h-8" : "w-8 h-8"
                } mb-1 group-hover:scale-[1.2] transition-transform duration-300`}
              />
              <span className="text-[10px] text-gray-300 text-center leading-tight line-clamp-2">
                {agent.name}
              </span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PickAgentList;
