import { motion, AnimatePresence } from 'framer-motion'
import scenario from '../scenario.json'

interface PresenterGuideProps {
  visible: boolean
  onClose: () => void
}

export default function PresenterGuide({ visible, onClose }: PresenterGuideProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="guide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-base text-[#1A1A1A]">Click path</h2>
                <p className="text-xs text-[#A09A94] mt-0.5">The 13 clicks that walk through the full demo.</p>
              </div>
              <button
                onClick={onClose}
                className="text-[#A09A94] hover:text-[#1A1A1A] text-xl leading-none"
              >×</button>
            </div>
            <ol className="space-y-1.5">
              {scenario.presenterClickPath.map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className="w-5 h-5 rounded-full bg-[#F2EEE8] text-[#A09A94] text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-medium">
                    {i + 1}
                  </span>
                  <span>
                    <span className="text-[#A09A94] text-xs mr-1.5">{step.screen}</span>
                    <span className="text-[#1A1A1A]">{step.action}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="text-xs text-[#A09A94] mt-4 pt-3 border-t border-[#E8E4DE]">
              Press <kbd className="bg-[#F2EEE8] rounded px-1 py-0.5 text-[#1A1A1A] font-mono text-xs">?</kbd> to toggle · <kbd className="bg-[#F2EEE8] rounded px-1 py-0.5 text-[#1A1A1A] font-mono text-xs">Esc</kbd> to restart
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
