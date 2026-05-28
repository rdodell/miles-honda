import { motion, AnimatePresence } from 'framer-motion'

interface RestartDialogProps {
  visible: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function RestartDialog({ visible, onConfirm, onCancel }: RestartDialogProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="restart"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 max-w-xs w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[15px] font-medium text-[#1A1A1A] mb-4">
              Restart Ian's journey from the beginning?
            </p>
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-2 rounded-xl border border-[#E8E4DE] text-sm text-[#1A1A1A] hover:bg-[#F2EEE8] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-2 rounded-xl bg-[#CC0000] text-white text-sm font-medium hover:bg-[#AA0000] transition-colors"
              >
                Restart
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
