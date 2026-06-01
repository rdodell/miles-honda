import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, Send } from 'lucide-react'
import MilesMessage from '../components/MilesMessage'
import scenario from '../scenario.json'

interface Props { onAdvance: (screen: string) => void }

const s = scenario.screens['1.3e']
const c = s.confirmation

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.12, duration: 0.3 },
})

export default function EmailConfirm({ onAdvance }: Props) {
  const [showRest, setShowRest] = useState(false)

  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-20">
      <MilesMessage text={s.milesMessage} onDone={() => setShowRest(true)} />

      <AnimatePresence>
        {showRest && (
          <motion.div
            className="flex flex-col gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
      {/* Confirmation cards */}
      <motion.div {...fadeUp(1)} className="flex flex-col gap-3">

        {/* Message sent */}
        <div className="bg-white border border-[#E8E4DE] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Send size={14} className="text-[#7CB342]" />
            <span className="text-xs font-semibold uppercase tracking-wide text-[#7CB342]">Message sent</span>
          </div>
          <div className="text-xs text-[#6B6B6B] mb-1">To: <span className="font-medium text-[#1A1A1A]">{c.recipient}</span> via {c.channel}</div>
          <div className="bg-[#F9F9F9] rounded-xl px-3 py-3 mt-2 border border-[#E8E4DE]">
            <p className="text-sm text-[#1A1A1A] leading-relaxed italic">"{c.previewNote}"</p>
          </div>
        </div>

        {/* Calendar blocked */}
        <div className="bg-white border border-[#E8E4DE] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays size={14} className="text-[#5B5FD9]" />
            <span className="text-xs font-semibold uppercase tracking-wide text-[#5B5FD9]">Calendar blocked</span>
          </div>
          <div className="text-sm font-medium text-[#1A1A1A]">{c.calendarSlot}</div>
          <div className="text-xs text-[#A09A94] mt-0.5">Call with {c.recipient}</div>
        </div>
      </motion.div>

      <motion.button
        {...fadeUp(3)}
        onClick={() => onAdvance(s.cta.advance)}
        className="w-full bg-[#7A1420] text-white font-semibold py-3.5 rounded-xl hover:bg-[#5C0F18] transition-colors shadow-sm"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {s.cta.label}
      </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
