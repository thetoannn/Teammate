import { cn } from '@/lib/utils'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'motion/react'
import * as React from 'react'

type CommonDialogProps = Omit<
  React.ComponentProps<typeof Dialog.Content>,
  'children'
> & {
  open: boolean
  children: React.ReactNode
  className?: string
  /** Độ “3D tilt” khi mở */
  transformPerspective?: number
}

const CommonDialogContent: React.FC<CommonDialogProps> = ({
  open,
  children,
  className,
  transformPerspective = 500,
  // ⬇️ Forward các handler của Radix để chặn click xuyên nếu cần
  onInteractOutside,
  onPointerDownOutside,
  onEscapeKeyDown,
  onCloseAutoFocus,
  ...rest
}) => {
  const openState = {
    opacity: 1,
    filter: 'blur(0px)',
    rotateX: 0,
    rotateY: 0,
    z: 0,
    transition: {
      duration: 0.45,
      ease: [0.17, 0.67, 0.51, 1],
      opacity: { delay: 0.1, duration: 0.3, ease: 'easeOut' },
    },
  }

  const initialState = {
    opacity: 0,
    filter: 'blur(8px)',
    z: -80,
    rotateY: 4,
    rotateX: 18,
    transition: { duration: 0.28, ease: [0.67, 0.17, 0.62, 0.64] },
  }

  return (
    <AnimatePresence>
      {open ? (
        <Dialog.Portal forceMount>
          <Dialog.Overlay asChild>
            <motion.div
              className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          </Dialog.Overlay>

          <Dialog.Content
            asChild
            onInteractOutside={(e) => {
              onInteractOutside?.(e)
              e.preventDefault()
            }}
            onPointerDownOutside={(e) => {
              onPointerDownOutside?.(e)
              e.preventDefault()
            }}
            onEscapeKeyDown={(e) => {
              onEscapeKeyDown?.(e)
              e.stopPropagation()
            }}
            onCloseAutoFocus={(e) => {
              onCloseAutoFocus?.(e)
              e.preventDefault()
            }}
            {...rest}
          >
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
              <motion.div
                className={cn(
                  'w-[min(92vw,520px)] rounded-xl border border-white/10',
                  'bg-zinc-900/95 text-zinc-100 shadow-2xl ring-1 ring-white/10',
                  'p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30',
                  'grid gap-4',
                  className
                )}
                initial={initialState}
                animate={openState}
                exit={initialState}
                style={{ transformPerspective }}
              >
                {children}
              </motion.div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      ) : null}
    </AnimatePresence>
  )
}

export default CommonDialogContent
