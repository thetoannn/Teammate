import React, { useState, useEffect, useMemo } from "react";
import PickAgentList from "./PickAgentList";
import { useSearchParams } from "react-router-dom";

interface Agent { icon: string; name: string; link: string; }
type AgentListProps = { forcedAgent?: string | null };

const assistantIconSide = "/icon-assistant.png";
const facebIconIconSide = "/icon-facebook-liner.png";
const researchIconSide   = "/icon-telescope.png";
const renderIconSide     = "/icon-media.svg";
const agentIconSide      = "/icon-assistant.png";
const slideListIconSide  = "/icon-slide-list.png";

const agents: Agent[] = [
  { icon: assistantIconSide, name: "Agent List", link: "/chat" },
  { icon: facebIconIconSide, name: "Agent List", link: "/chat?agent=facebook-lead" },
  { icon: researchIconSide,  name: "Agent List", link: "/chat?agent=research" },
  { icon: renderIconSide,    name: "Agent List", link: "/chat?agent=media-agent" },
  { icon: agentIconSide,     name: "Agent List", link: "/chat?agent=marketing-assistant" },
];

const AgentList: React.FC<AgentListProps> = ({ forcedAgent }) => {
  const [showAgentList, setShowAgentList] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [searchParams] = useSearchParams();

  const selectedFromURL = useMemo(() => {
    if (forcedAgent) {
      const byForced =
        agents.find(a => a.link.includes(`agent=${forcedAgent}`)) ||
        agents.find(a => a.link.split("?")[0] === `/${forcedAgent}`); 
      if (byForced) return byForced;
    }

    const agentParam = searchParams.get("agent");
    const toolParam  = searchParams.get("tool");

    if (agentParam) {
      const byAgent = agents.find(a => a.link.includes(`agent=${agentParam}`));
      if (byAgent) return byAgent;
    }
    if (toolParam) {
      const byTool = agents.find(a => a.link.includes(`tool=${toolParam}`));
      if (byTool) return byTool;
    }
    return agents[0];
  }, [forcedAgent, searchParams]);

  const [selectedAgent, setSelectedAgent] = useState<Agent>(selectedFromURL);
  useEffect(() => { setSelectedAgent(selectedFromURL); }, [selectedFromURL]);

  const toggleAgentList = () => setShowAgentList(s => !s);
  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent({ ...agent, name: "Agent List" });
    setShowAgentList(false);
  };

  return (
    <>
      <div className="relative flex flex-col items-center">
        <div className="relative">
          <button
            onClick={toggleAgentList}
            className="z-50 absolute right-[-13px] top-[10.6px] flex items-center justify-center w-5 h-5 transition-transform duration-300"
          >
            <img
              className={`w-4 h-4 object-contain transition-transform duration-300 ${showAgentList ? "rotate-180" : "rotate-0"}`}
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
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = assistantIconSide; }}
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
        <PickAgentList onAgentSelect={handleAgentSelect} onClose={() => setShowAgentList(false)} />
      )}
    </>
  );
};

export default AgentList;
