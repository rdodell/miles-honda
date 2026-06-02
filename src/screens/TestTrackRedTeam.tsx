import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import MilesMessage from '../components/MilesMessage'
import IanInputBar from '../components/IanInputBar'
import Tooltip from '../components/Tooltip'
import scenario from '../scenario.json'

interface TestTrackRedTeamProps {
  onAdvance: (screen: string) => void
}

const s = scenario.screens['3.3']
const ianInput = (s as any).ianInput as { driver: string; text: string }

function RedTeamCard({ q, index, delay }: { q: typeof s.questions[0]; index: number; delay: number }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="bg-white border border-[#E8E4DE] rounded-2xl p-4 shadow-sm"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start justify-between gap-2 text-left"
      >
        <div className="flex items-start gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[#9575CD]/10 text-[#9575CD] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            {index + 1}
          </span>
          <span className="font-semibold text-sm text-[#1A1A1A] leading-snug">{q.header}</span>
        </div>
        {expanded ? <ChevronUp size={16} className="text-[#A09A94] flex-shrink-0 mt-0.5" /> : <ChevronDown size={16} className="text-[#A09A94] flex-shrink-0 mt-0.5" />}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-[#7A1420] mb-1">The challenge</div>
            <p className="text-xs text-[#6B6570] leading-relaxed">{q.challenge}</p>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-[#7CB342] mb-1">How Ian could respond</div>
            <p className="text-xs text-[#1A1A1A] leading-relaxed">{q.response}</p>
          </div>
          <Tooltip text={q.buttonTooltip}>
            <button className="text-xs text-[#9575CD] font-medium border border-[#9575CD]/30 rounded-lg px-3 py-1.5 hover:bg-[#9575CD]/5 transition-colors">
              Strengthen this answer →
            </button>
          </Tooltip>
        </div>
      )}
    </motion.div>
  )
}

export default function TestTrackRedTeam({ onAdvance }: TestTrackRedTeamProps) {
  const [showCards, setShowCards] = useState(false)

  return (
    <div className="flex flex-col gap-4 px-5 py-5 pb-20">
      <MilesMessage text={s.milesIntro} onDone={() => setShowCards(true)} />

      {showCards && (
        <>
          {s.questions.map((q, i) => (
            <RedTeamCard key={q.id} q={q} index={i} delay={i * 0.15} />
          ))}

          <motion.button
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: s.questions.length * 0.15 + 0.1 }}
            onClick={() => onAdvance(s.footerCta.advance)}
            className="w-full text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm"
            style={{ background: '#7A1420' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {s.footerCta.label}
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: s.questions.length * 0.15 + 0.25 }}
          >
            <IanInputBar
              driver="chat"
              suggestion={ianInput.text}
              onSubmit={() => onAdvance(s.footerCta.advance)}
            />
          </motion.div>
        </>
      )}
    </div>
  )
}
