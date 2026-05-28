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
  Mic: Mic,
  MessageCircle: MessageCircle,
  Wrench: Wrench,
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
})

export default function SparkWelcome({ onAdvance, showTooltip }: SparkWelcomeProps) {
  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-20">
      {/* Miles greeting */}
      <MilesMessage text={s.milesMessages[0].text} instant>
        {/* Summary cards */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {s.summaryCards.map((card) => (
            <button
              key={card.label}
              onClick={() => showTooltip(card.tooltip)}
              className="flex-1 min-w-[110px] bg-white border border-[#E8E4DE] rounded-xl px-3 py-2.5 text-left hover:bg-[#F2EEE8] transition-colors"
            >
              <div className="text-sm font-semibold text-[#1A1A1A]">{card.label}</div>
              <div className="text-xs text-[#A09A94] mt-0.5">{card.sublabel}</div>
            </button>
          ))}
        </div>
      </MilesMessage>

      {/* Prompt */}
      <motion.p {...fadeUp(0.1)} className="text-base font-medium text-[#1A1A1A] px-1">
        {s.promptMessage}
      </motion.p>

      {/* Input mode buttons */}
      <motion.div {...fadeUp(0.2)} className="flex gap-3">
        {s.inputModes.map((mode) => {
          const Icon = ICONS[mode.icon]
          const isChat = mode.id === 'chat'
          if (isChat) {
            return (
              <button
                key={mode.id}
                onClick={() => onAdvance(mode.advance!)}
                className="flex-1 flex items-center justify-center gap-2 bg-[#CC0000] text-white font-semibold py-3 rounded-xl hover:bg-[#AA0000] transition-colors shadow-sm"
              >
                <Icon size={16} />
                {mode.label}
              </button>
            )
          }
          return (
            <Tooltip key={mode.id} text={mode.tooltip!}>
              <button className="flex-1 flex items-center justify-center gap-2 border border-[#E8E4DE] text-[#A09A94] font-medium py-3 rounded-xl bg-white">
                <Icon size={16} />
                {mode.label}
              </button>
            </Tooltip>
          )
        })}
      </motion.div>

      {/* Footer recommendation */}
      <motion.div {...fadeUp(0.3)} className="text-sm text-[#A09A94] px-1">
        → {s.footerLine}{' '}
        <button
          onClick={() => onAdvance(s.footerLinkAdvance)}
          className="text-[#CC0000] font-medium underline underline-offset-2 hover:opacity-80"
        >
          {s.footerLinkText}
        </button>
      </motion.div>
    </div>
  )
}
