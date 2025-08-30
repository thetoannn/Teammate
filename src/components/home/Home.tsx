import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useConfigs } from "@/contexts/configs";
import { useMutation } from "@tanstack/react-query";
import { createCanvas } from "@/api/canvas";
import { toast } from "sonner";
import { motion } from "framer-motion";
import ChatTextarea from "@/components/chat/ChatTextarea";
import CanvasList from "@/components/home/CanvasList";
import AvailableTemplatesGallery from "./AvailableTemplatesGallery";
import { nanoid } from "nanoid";
import { DEFAULT_SYSTEM_PROMPT } from "@/constants";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { setInitCanvas } = useConfigs();

  const { mutate: createCanvasMutation, isPending } = useMutation({
    mutationFn: createCanvas,
    onSuccess: (data, variables) => {
      setInitCanvas(true);
      navigate(`/canvas/${data.id}?sessionId=${variables.session_id}`);
    },
    onError: (error: Error) => {
      toast.error(t("common:messages.error"), { description: error.message });
    },
  });

  return (
    <>
      <div className="relative flex flex-col items-center h-fit py-[60px] select-none">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
            className="w-full text-white rounded-4xl p-4 border border-[#656262] bg-[#353535]"
            messages={[]}
            onSendMessages={(messages, configs) => {
              createCanvasMutation({
                name: t("home:newCanvas"),
                canvas_id: nanoid(),
                messages,
                session_id: nanoid(),
                text_model: {
                  provider: configs.textModel?.provider || "",
                  model: configs.textModel?.model || "",
                  url: configs.textModel?.url || "",
                },
                tool_list: configs.toolList || [],
                system_prompt: localStorage.getItem("system_prompt") || DEFAULT_SYSTEM_PROMPT,
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
    </>
  );
}
