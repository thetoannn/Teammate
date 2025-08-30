import { deleteCanvas, ListCanvasesResponse } from '@/api/canvas'
import { ImageIcon, Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { formatDate } from '@/utils/formatDate'
import CanvasDeleteDialog from './CanvasDeleteDialog'
import { BASE_API_URL } from '@/constants'

type CanvasCardProps = {
  index: number
  canvas: ListCanvasesResponse
  handleCanvasClick: (id: string) => void
  handleDeleteCanvas: () => void
}

const CanvasCard: React.FC<CanvasCardProps> = ({
  index,
  canvas,
  handleCanvasClick,
  handleDeleteCanvas,
}) => {
  const { t } = useTranslation()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // ✅ Chốt an toàn: chặn click ngay sau khi dialog đóng
  const [blockClick, setBlockClick] = useState(false)
  const unblockTimer = useRef<number | null>(null)

  useEffect(() => {
    if (!showDeleteDialog) {
      // Dialog vừa đóng → chặn click ngắn hạn
      setBlockClick(true)
      if (unblockTimer.current) window.clearTimeout(unblockTimer.current)
      unblockTimer.current = window.setTimeout(() => setBlockClick(false), 180)
    }
    return () => {
      if (unblockTimer.current) window.clearTimeout(unblockTimer.current)
    }
  }, [showDeleteDialog])

  const handleDelete = async () => {
    try {
      await deleteCanvas(canvas.id)
      handleDeleteCanvas()
      toast.success(t('canvas:messages.canvasDeleted'))
    } catch (error) {
      toast.error(t('canvas:messages.failedToDelete'))
    }
    setShowDeleteDialog(false) // sẽ kích hoạt blockClick qua useEffect
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="
        flex-shrink-0 w-[230px] h-[150px]
        bg-[#2a2a2a] rounded-xl overflow-hidden
        border border-white/20
        cursor-pointer relative group
        transition-all duration-200 hover:scale-105 hover:border-gray-400 hover:bg-gray-800/20
      "
      // Nếu đang blockClick thì chặn bắt đầu pointer để không tạo click mới
      onPointerDown={(e) => {
        if (blockClick) e.stopPropagation()
      }}
    >
      <CanvasDeleteDialog
        show={showDeleteDialog}
        setShow={setShowDeleteDialog}
        handleDeleteCanvas={handleDelete}
      >
        <Button
          variant="secondary"
          size="icon"
          type="button"
          aria-label="Delete canvas"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white z-20"
          onPointerDown={(e) => e.stopPropagation()} // không “rơi” xuống card
          onClick={(e) => {
            e.stopPropagation()
            setShowDeleteDialog(true)
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CanvasDeleteDialog>

      <div
        className="w-full h-full"
        onClick={(e) => {
          if (blockClick) {
            e.stopPropagation()
            return
          }
          handleCanvasClick(canvas.id)
        }}
      >
        {canvas.thumbnail ? (
          <img
            src={
              canvas.thumbnail.startsWith('data:image')
                ? canvas.thumbnail
                : `${BASE_API_URL}${canvas.thumbnail}`
            }
            alt={canvas.name}
            className="w-full h-full object-cover select-none pointer-events-none"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
            <ImageIcon className="w-10 h-10 opacity-10" />
          </div>
        )}

        <div className="absolute bottom-2 left-2 bg-[#121212]/40 text-white text-[11px] px-2 py-1 rounded-[10px]">
          {canvas.name || 'Untitled'} – {formatDate(canvas.created_at)}
        </div>

        {/* Overlay hover: KHÔNG bắt sự kiện */}
        <div className="pointer-events-none absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />
      </div>
    </motion.div>
  )
}

export default CanvasCard
