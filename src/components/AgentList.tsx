import React, { useState, useEffect } from "react";
import PickAgentList from "./PickAgentList";
import { useSearchParams } from "react-router-dom";

interface Agent {
  icon: string;
  name: string;
  link: string;
}

const assistantIconSide = "/icon-assistant.png";
const facebIconIconSide = "/icon-facebook-liner.png";
const researchIconSide = "/icon-telescope.png";
const renderIconSide = "/icon-media.svg";
const agentIconSide = "/icon-assistant.png";

const slideListIconSide = "/icon-slide-list.png";

const AgentList: React.FC = () => {
  const agents: Agent[] = [
    {
      icon: assistantIconSide,
      name: "Agent List",
      link: "/chat",
    },
    {
      icon: facebIconIconSide,
      name: "Agent List",
      link: "/chat?agent=facebook-lead",
    },
    {
      icon: researchIconSide,
      name: "Agent List",
      link: "/chat?agent=research",
    },
    {
      icon: renderIconSide,
      name: "Agent List",
      link: "/chat?tool=media-ai",
    },
    {
      icon: agentIconSide,
      name: "Agent List",
      link: "/chat?agent=marketing-assistant",
    },
  ];

  const [showAgentList, setShowAgentList] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [searchParams] = useSearchParams();

  const getAgentFromUrl = () => {
    const agentParam = searchParams.get("agent");
    const toolParam = searchParams.get("tool");

    if (agentParam) {
      const matchedAgent = agents.find((agent) =>
        agent.link.includes(`agent=${agentParam}`)
      );
      return matchedAgent || agents[0];
    }

    if (toolParam) {
      const matchedTool = agents.find((agent) =>
        agent.link.includes(`tool=${toolParam}`)
      );
      return matchedTool || agents[0];
    }

    return agents[0];
  };

  const [selectedAgent, setSelectedAgent] = useState<Agent>(getAgentFromUrl);

  const toggleAgentList = () => {
    setShowAgentList(!showAgentList);
  };

  const handleAgentSelect = (agent: Agent) => {
    const agentWithFixedName = { ...agent, name: "Agent List" };
    setSelectedAgent(agentWithFixedName);
    setShowAgentList(false);
  };

  useEffect(() => {
    const newAgent = getAgentFromUrl();
    setSelectedAgent(newAgent);
  }, [searchParams]);

  return (
    <>
      <div className="relative flex flex-col items-center">
        <div className="relative">
          <button
            onClick={toggleAgentList}
            className="z-50 absolute right-[-13px] top-[10.6px] flex items-center justify-center w-5 h-5 transition-transform duration-300"
          >
            <img
              className={`w-4 h-4 object-contain transition-transform duration-300 ${
                showAgentList ? "rotate-180" : "rotate-0"
              }`}
              src={slideListIconSide}
              alt="Slide List"
            />
          </button>

          <button
            onClick={toggleAgentList}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="flex items-center p-1 py-2 w-10 justify-center leading-[27px] relative box-border rounded-[14px] group bg-[#313131] hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
          >
            <div className="block text-white flex justify-center items-center">
              <img
                className="w-6 h-6 object-contain transform transition-transform duration-300 ease-in-out group-hover:scale-[1.1]"
                src={selectedAgent.icon}
                alt={selectedAgent.name}
              />
            </div>
          </button>
        </div>

        <div className="text-gray-300 text-[9px] max-w-[80px] whitespace-nowrap text-center mt-1">
          {selectedAgent.name}
        </div>

        {showTooltip && (
          <div className="absolute left-full ml-2 top-0 bg-[#3D3939] text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50">
            {selectedAgent.name}
          </div>
        )}
      </div>
      {showAgentList && (
        <PickAgentList
          onAgentSelect={handleAgentSelect}
          onClose={() => setShowAgentList(false)}
        />
      )}
    </>
  );
};

export default AgentList;
