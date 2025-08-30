import React from "react";
import { useSearchParams, useLocation } from "react-router-dom";

interface AgentResearchNoMessageProps {
  onSendMessage: (message: string) => void;
}

const AgentResearchNoMessage: React.FC<AgentResearchNoMessageProps> = ({
  onSendMessage,
}) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const currentAgent = searchParams.get("agent") || "marketing-assistant";
  const isResearchAgent = currentAgent === "research";
  const isMarketingAssistant = currentAgent === "marketing-assistant";

  const handleButtonClick = (buttonType: string) => {
    let message = "";
    switch (buttonType) {
      case "customer-profile":
        message = "Tôi muốn xây dựng hồ sơ khách hàng";
        break;
      case "market-research":
        message = "Tôi muốn nghiên cứu thị trường";
        break;
      case "trending":
        message = "Tôi muốn cập nhật trending";
        break;
      default:
        return;
    }
    onSendMessage(message);
  };

  // Show research agent options
  if (isResearchAgent) {
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
        <button
          onClick={() => handleButtonClick("customer-profile")}
          className="research-button flex flex-col items-center gap-3 p-6 rounded-xl border-1 border-dashed border-gray-500 hover:border-gray-400 hover:bg-gray-800/20 transition-all duration-200 bg-[#292929] min-w-[150px] h-[110px] justify-center group cursor-pointer"
        >
          <img
            src="/icon-profile-customer.png"
            alt="Customer Profile"
            className="w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <div className="text-sm font-medium text-center leading-tight text-gray-200 group-hover:text-white transition-colors">
            Xây dựng hồ sơ
            <br />
            khách hàng
          </div>
        </button>

        <button
          onClick={() => handleButtonClick("market-research")}
          className="research-button flex flex-col items-center gap-3 p-6 rounded-xl border-1 border-dashed border-gray-500 hover:border-gray-400 hover:bg-gray-800/20 transition-all duration-200 bg-[#292929] min-w-[150px] h-[110px] justify-center group cursor-pointer"
        >
          <img
            src="/icon-trend-topic.png"
            alt="Market Research"
            className="w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <div className="text-sm font-medium text-center leading-tight text-gray-200 group-hover:text-white transition-colors">
            Nghiên cứu thị
            <br />
            trường
          </div>
        </button>

        <button
          onClick={() => handleButtonClick("trending")}
          className="research-button flex flex-col items-center gap-3 p-6 rounded-xl border-1 border-dashed border-gray-500 hover:border-gray-400 hover:bg-gray-800/20 transition-all duration-200 bg-[#292929] min-w-[150px] h-[110px] justify-center group cursor-pointer"
        >
          <img
            src="/icon-tea.png"
            alt="Trending"
            className="w-8 h-8 opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <div className="text-sm font-medium text-center leading-tight text-gray-200 group-hover:text-white transition-colors">
            Cập nhật
            <br />
            Trending
          </div>
        </button>
      </div>
    );
  }

  // For marketing-assistant or other agents, show nothing (just the greeting message)
  return null;
};

export default AgentResearchNoMessage;
