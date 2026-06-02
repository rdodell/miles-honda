import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import InputBar from '../components/InputBar'
import scenario from '../scenario.json'

interface SparkWelcomeProps {
  onAdvance: (screen: string) => void
  showTooltip: (msg: string) => void
}

const s = scenario.screens['1.1']

const cardContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }
const cardItem = {
  hidden:   { opacity: 0, y: 6 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' as const } },
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
})

export default function SparkWelcome({ onAdvance }: SparkWelcomeProps) {
  const [showRest, setShowRest] = useState(false)

  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-20">
      {/* Miles greeting */}
      <MilesMessage text={s.milesMessages[0].text} onDone={() => setShowRest(true)}>
        <motion.div
          className="flex gap-2 mt-3 flex-wrap"
          variants={cardContainer}
          initial="hidden"
          animate="visible"
        >
          {s.summaryCards.map((card) => (
            <motion.button
              key={card.label}
              variants={cardItem}
              whileHover={{ boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}
              className="flex-1 min-w-[110px] bg-white border border-[#E8E4DE] rounded-xl px-3 py-2.5 text-left hover:bg-[#F2EEE8] transition-colors"
            >
              <div className="text-sm font-semibold text-[#1A1A1A]">{card.label}</div>
              <div className="text-xs text-[#A09A94] mt-0.5">{card.sublabel}</div>
            </motion.button>
          ))}
        </motion.div>
      </MilesMessage>

      <AnimatePresence>
        {showRest && (
          <motion.div
            className="flex flex-col gap-5"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Recommended next step */}
            <motion.div
              {...fadeUp(0.05)}
              className="rounded-xl border border-[#E8E4DE] bg-[#FAFAFA] px-3 py-2.5"
            >
              <p className="text-sm font-medium text-[#1A1A1A]">
                {s.footerLine}{' '}
                <button
                  onClick={() => onAdvance(s.footerLinkAdvance)}
                  className="text-[#7A1420] font-semibold underline underline-offset-2 hover:opacity-80"
                >
                  {s.footerLinkText}
                </button>
              </p>
              <p className="text-xs text-[#A09A94] mt-1">{(s as any).footerReason}</p>
            </motion.div>

            {/* Prompt */}
            <motion.p {...fadeUp(0.12)} className="text-sm font-medium text-[#1A1A1A] px-1">
              {s.promptMessage}
            </motion.p>

            {/* Unified input bar — Voice | Chat | Scratch Pad */}
            <motion.div {...fadeUp(0.2)}>
              <InputBar
                onChat={() => onAdvance((s.inputModes.find((m) => m.id === 'chat') as any)?.advance ?? '1.3')}
                suggestion={(s as any).ianInput?.text}
                typeSuggestion
                autoSend={(scenario.inputModel as { autoSend?: boolean }).autoSend === true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
