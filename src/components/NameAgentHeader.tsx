import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

interface NameAgentHeaderProps {
  agentName: string;
}

const NameAgentHeader: React.FC<NameAgentHeaderProps> = ({ agentName }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const agents = ["GPT-4o", "Claude Sonnet 4", "Gemini 2.0 Pro"];

  const [selectedAgent, setSelectedAgent] = useState(() => {
    const stored = localStorage.getItem("selectedModel");
    return stored && agents.includes(stored) ? stored : "GPT-4o";
  });

  const handleAgentSelect = (agent: string) => {
    localStorage.setItem("selectedModel", agent);
    setSelectedAgent(agent);

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("model", agent);
    setSearchParams(newSearchParams);

    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const urlModel = searchParams.get("model");
    if (urlModel && agents.includes(urlModel)) {
      localStorage.setItem("selectedModel", urlModel);
      setSelectedAgent(urlModel);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <div className=" flex items-center space-x-2 cursor-pointer">
        <div className="text-base font-medium text-[18px]">{agentName}</div>
        {/* <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-xs bg-white/10 px-3 py-1 rounded-2xl hover:bg-white/20 transition-colors flex items-center cursor-pointer"
          >
            <span className="flex items-center">
              {selectedAgent}
              <svg
                className={`w-3 h-3 ml-1 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </button>

          {isDropdownOpen && (
            <div className="">
              <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 w-32  p-2  bg-[#2E2E2E] rounded-xl shadow-lg z-30 text-nowrap">
                {agents.map((agent) => (
                  <button
                    key={agent}
                    className="block w-full text-center px-4 rounded-lg py-2 hover:bg-white/10 transition-colors cursor-pointer text-xs text-white text-nowrap"
                    onClick={() => handleAgentSelect(agent)}
                  >
                    {agent}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div> */}
      </div>
    </>
  );
};

export default NameAgentHeader;
