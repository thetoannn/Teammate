import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import NameAgentHeader from "../NameAgentHeader";
import ChatPropose from "../ChatPropose";
import ChatNotifications from "../ChatNotifications";
import TokenHeaderDis from "../TokenHeaderDis";
import { useNavigate } from "react-router-dom";

type TopBarProps = {
  title?: string;
};

export default function TopBar({ title = "Media Creator Agent" }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <header
      className="sticky top-0 z-50 text-white py-1 pl-[86px]"
      style={{ backgroundColor: "#1F1F1F" }}
    >
      <div className="flex items-center justify-between ml-[-85px]">
        <div className="w-[85px]" />

        <div className="flex-1 flex justify-center items-center relative">
          <NameAgentHeader agentName={title} />
        </div>

        <div className="flex items-center gap-2 pr-4">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 rounded-md hover:bg-white/10 text-white/90"
            onClick={() => navigate("/assets")}
          >
            <ImageIcon className="mr-2 h-4 w-4 opacity-90" />
            Library
          </Button>

          <ChatPropose />
          <ChatNotifications />
          <TokenHeaderDis />
        </div>
      </div>
    </header>
  );
}
