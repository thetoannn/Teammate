import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useConfigs } from "@/contexts/configs";
import { useMutation } from "@tanstack/react-query";
import { createCanvas } from "@/api/canvas";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import ChatTextarea from "@/components/chat/ChatTextarea";
import CanvasList from "@/components/home/CanvasList";
import { nanoid } from "nanoid";
import TopMenu from "@/components/TopMenu";
import { DEFAULT_SYSTEM_PROMPT } from "@/constants";
import SideBar from "@/HomePage/PageOne/SideBar";
import TopBar from "./TopBar";
import { ImageAILayout } from "@/ChatUI/ImgToolLayout";
import AvailableTemplatesGallery from "./AvailableTemplatesGallery";

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setInitCanvas } = useConfigs();

  const { mutate: createCanvasMutation, isPending } = useMutation({
    mutationFn: createCanvas,
    onSuccess: (
      data: { id: string },
      variables: {
        name: string;
        canvas_id: string;
        messages: any[];
        session_id: string;
        text_model: any;
        tool_list: any[];
        system_prompt: string;
      }
    ) => {
      setInitCanvas(true);
      navigate(`/canvas/${data.id}?sessionId=${variables.session_id}`);
    },
    onError: (error: Error) => {
      toast.error(t("common:messages.error"), {
        description: error.message,
      });
    },
  });

  return (
    <div className="flex h-screen bg-background">
      <SideBar />

      <div className="flex flex-1 flex-col ml-16">
        <TopBar />

        <ScrollArea className="h-full py-2 px-6 lg:px-10 flex-1">
          <div className="relative flex flex-col items-center h-fit py-[60px] select-none">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-2xl font-semibold mb-4 text-center text-white">
                {t("home:title")}
                <span className="bg-gradient-to-r from-fuchsia-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  sáng tạo
                </span>
                <sup className="ml-1 text-base">
                  <span className="bg-gradient-to-r from-fuchsia-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    ✨
                  </span>
                </sup>{" "}
                gì hôm nay?
              </div>
            </motion.div>

            <div className="w-full max-w-4xl mt-2">
              <ChatTextarea
                className="w-full bg-[#2A2A2A] text-white rounded-4xl p-4 border border-[#656262] bg-[#353535]"
                messages={[]}
                onSendMessages={(messages, configs) => {
                  createCanvasMutation({
                    name: t("home:newCanvas"),
                    canvas_id: nanoid(),
                    messages: messages,
                    session_id: nanoid(),
                    text_model: {
                      provider: configs.textModel?.provider || "",
                      model: configs.textModel?.model || "",
                      url: configs.textModel?.url || "",
                    },
                    tool_list: configs.toolList || [],
                    system_prompt:
                      localStorage.getItem("system_prompt") ||
                      DEFAULT_SYSTEM_PROMPT,
                  });
                }}
                pending={isPending}
              />
            </div>
          </div>

          <div>
            <CanvasList />
          </div>

          <div>
            <AvailableTemplatesGallery />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Home;
