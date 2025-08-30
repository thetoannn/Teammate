import CommonDialogContent from '@/components/common/DialogContent'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type CanvasDeleteDialogProps = {
  show: boolean
  className?: string
  children?: React.ReactNode
  setShow: (show: boolean) => void
  handleDeleteCanvas: () => void
}

const CanvasDeleteDialog: React.FC<CanvasDeleteDialogProps> = ({
  show,
  className,
  children,
  setShow,
  handleDeleteCanvas,
}) => {
  const { t } = useTranslation()

  return (
    <Dialog open={show} onOpenChange={setShow}>
      {/* Trigger: nếu không truyền children thì dùng nút mặc định và CHẶN nổi bọt */}
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            variant="destructive"
            size="icon"
            className={className}
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>

      {/* Content: chặn click ra ngoài & các sự kiện đóng gây “rơi xuyên” */}
      <CommonDialogContent
        open={show}
        /* Các prop dưới đây phải được forward vào Radix <DialogContent> bên trong CommonDialogContent */
        onInteractOutside={(e: any) => e.preventDefault()}
        onPointerDownOutside={(e: any) => e.preventDefault()}
        onEscapeKeyDown={(e: any) => e.stopPropagation()}
        onCloseAutoFocus={(e: any) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t('canvas:deleteDialog.title')}</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          {t('canvas:deleteDialog.description')}
        </DialogDescription>

        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              setShow(false)
            }}
          >
            {t('canvas:deleteDialog.cancel')}
          </Button>

          <Button
            variant="destructive"
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={async (e) => {
              e.stopPropagation()
              await handleDeleteCanvas()
              // setShow(false) sẽ được gọi trong handleDeleteCanvas hoặc ở nơi bạn đang gọi
            }}
          >
            {t('canvas:deleteDialog.delete')}
          </Button>
        </DialogFooter>
      </CommonDialogContent>
    </Dialog>
  )
}

export default CanvasDeleteDialog
