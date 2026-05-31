import { motion } from 'framer-motion'
import { Mic, MessageCircle, Wrench } from 'lucide-react'
import MilesMessage from '../components/MilesMessage'
import Tooltip from '../components/Tooltip'
import scenario from '../scenario.json'

interface SparkWelcomeProps {
  onAdvance: (screen: string) => void
  showTooltip: (msg: string) => void
}

const s = scenario.screens['1.1']
const ICONS: Record<string, React.FC<{ size?: number }>> = {
  Mic, MessageCircle, Wrench,
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
})

const cardContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.09 } } }
const cardItem = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' as const } },
}

export default function SparkWelcome({ onAdvance, showTooltip }: SparkWelcomeProps) {
  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-20">
      {/* Miles greeting */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.8 }}
      >
        <MilesMessage text={s.milesMessages[0].text} instant>
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
                whileHover={{ y: -2, boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }}
                onClick={() => showTooltip(card.tooltip)}
                className="flex-1 min-w-[110px] bg-white border border-[#E8E4DE] rounded-xl px-3 py-2.5 text-left hover:bg-[#F2EEE8] transition-colors"
              >
                <div className="text-sm font-semibold text-[#1A1A1A]">{card.label}</div>
                <div className="text-xs text-[#A09A94] mt-0.5">{card.sublabel}</div>
              </motion.button>
            ))}
          </motion.div>
        </MilesMessage>
      </motion.div>

      {/* Recommended next step — above input modes */}
      <motion.div
        {...fadeUp(0.1)}
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
      <motion.p {...fadeUp(0.2)} className="text-base font-medium text-[#1A1A1A] px-1">
        {s.promptMessage}
      </motion.p>

      {/* Input mode buttons */}
      <motion.div {...fadeUp(0.3)} className="flex gap-3">
        {s.inputModes.map((mode) => {
          const Icon = ICONS[mode.icon]
          const isChat = mode.id === 'chat'
          if (isChat) {
            return (
              <button
                key={mode.id}
                onClick={() => onAdvance(mode.advance!)}
                className="flex-1 flex items-center justify-center gap-2 bg-[#7A1420] text-white font-semibold py-3 rounded-xl hover:bg-[#5C0F18] transition-colors shadow-sm"
              >
                <Icon size={16} />
                {mode.label}
              </button>
            )
          }
          return (
            <Tooltip key={mode.id} text={mode.tooltip!} className="relative flex-1">
              <button className="w-full flex items-center justify-center gap-2 border border-[#E8E4DE] text-[#1A1A1A] font-medium py-3 rounded-xl bg-[#F2EEE8]">
                <Icon size={16} />
                {mode.label}
              </button>
            </Tooltip>
          )
        })}
      </motion.div>
    </div>
  )
}
