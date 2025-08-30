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

const Home = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setInitCanvas } = useConfigs();

  const { mutate: createCanvasMutation, isPending } = useMutation({
    mutationFn: createCanvas,
    onSuccess: (data: { id: string }, variables: {
      name: string;
      canvas_id: string;
      messages: any[];
      session_id: string;
      text_model: any;
      tool_list: any[];
      system_prompt: string;
    }) => {
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
    <div className="flex flex-col h-screen">
      <ScrollArea className="h-full">
        <TopMenu />

        <div className="relative flex flex-col items-center justify-center h-fit min-h-[calc(100vh-460px)] pt-[60px] select-none">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold mb-2 mt-8 text-center">
              {t("home:title")}
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl text-gray-500 mb-8 text-center">
              {t("home:subtitle")}
            </p>
          </motion.div>

          <ChatTextarea
            className="w-full max-w-xl"
            messages={[]}
            onSendMessages={(messages, configs) => {
              createCanvasMutation({
                name: t("home:newCanvas"),
                canvas_id: nanoid(),
                messages: messages,
                session_id: nanoid(),
                text_model: {
                  provider: configs.textModel?.provider || '',
                  model: configs.textModel?.model || '',
                  url: configs.textModel?.url || '',
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

        <CanvasList />
      </ScrollArea>
    </div>
  );
};

export default Home;
