import { listCanvases } from "@/api/canvas";
import CanvasCard from "@/components/home/CanvasCard";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { memo, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useEmblaCarousel from "embla-carousel-react";

const CanvasList: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isHomePage = location.pathname === "/media-agent";

  const { data: canvases, refetch } = useQuery({
    queryKey: ["canvases"],
    queryFn: listCanvases,
    enabled: isHomePage,
    refetchOnMount: "always",
  });

  const navigate = useNavigate();
  const handleCanvasClick = (id: string) => navigate(`/canvas/${id}`);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    loop: false,
    duration: 20,
    slidesToScroll: 1,
    skipSnaps: true,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi?.off("select", onSelect);
      emblaApi?.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, canvases?.length]);

  if (!canvases?.length) return null;

  return (
    <section
      className="w-full text-white -mx-4 px-4"
      style={{ width: "calc(100% + 2rem)" }}
    >
      <div className="mb-6 pr-6 flex items-center justify-between">
        <motion.h2
          className="text-xl text-left"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {t("home:allProjects")}
        </motion.h2>

        <div className="hidden sm:flex items-center gap-2">
          <button
            aria-label="Prev"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className="h-7 w-7 grid place-items-center rounded-md border border-white/20 text-white/80 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ‹
          </button>
          <button
            aria-label="Next"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            className="h-7 w-7 grid place-items-center rounded-md border border-white/20 text-white/80 hover:text-white hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ›
          </button>
        </div>
      </div>

      <AnimatePresence>
        <div className="mx-auto max-w-full md:max-w-[calc(5*230px+4*32px)] xl:max-w-[calc(7*230px+6*32px)]">
          <div
            ref={emblaRef}
            role="region"
            aria-label="Canvas slider"
            className="overflow-hidden hover:overflow-x-auto pb-2"
            style={{ touchAction: "pan-y" }}
          >
            <div className="flex gap-8">
              {canvases?.map((canvas, index) => (
                <div
                  key={canvas.id}
                  className="
                  flex-shrink-0 w-[230px] h-[150px]
                  /* ép UI bên trong CanvasCard bằng child selectors, không đổi content */
                  [&>*]:w-full [&>*]:h-full
                  [&>*]:rounded-xl
                  [&>*]:overflow-hidden
                  [&>*]:bg-[#2a2a2a]
                  [&>*]:border [&>*]:border-white/20
                  hover:[&>*]:border-gray-400 hover:[&>*]:bg-gray-800/20
                  transition-all duration-200 hover:scale-105
                  relative group cursor-pointer
                "
                  onClick={() => handleCanvasClick(canvas.id)}
                  onDragStart={(e) => e.preventDefault()}
                >
                  <CanvasCard
                    index={index}
                    canvas={canvas}
                    handleCanvasClick={handleCanvasClick}
                    handleDeleteCanvas={() => refetch()}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatePresence>
    </section>
  );
};

export default memo(CanvasList);
