import { useState } from 'react'
import { motion } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import InputBar from '../components/InputBar'
import scenario from '../scenario.json'

interface Props { onAdvance: (screen: string) => void }
const s = scenario.screens['1.3d']
const pc = s.personaCard

// REVIEW: Reconsider line — confirm framing works in demo context.
const RECONSIDER_TEXT =
  "Before we lock in an interviewee, I want to flag something. The prototype test included several people, but Mary stands out. She already experienced the runtime problem firsthand, and she books work through the same Facebook groups where your target market lives. Does she sound right to you?"

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
})

export default function LauraIntro({ onAdvance }: Props) {
  const [showInput, setShowInput]       = useState(false)
  const [showCard, setShowCard]         = useState(false)
  const [showFollowup, setShowFollowup] = useState(false)

  function confirmMary() {
    setShowInput(false)
    setShowCard(true)
  }

  return (
    <div className="flex flex-col gap-4 px-5 py-5 pb-20">
      {/* Miles surfaces Mary — doesn't assume */}
      <MilesMessage text={RECONSIDER_TEXT} onDone={() => setShowInput(true)} />

      {/* Ian weighs in before the card appears */}
      {showInput && !showCard && (
        <InputBar
          onChat={confirmMary}
          suggestion="Mary sounds right. Let's go with her"
          typeSuggestion
        />
      )}

      {/* Mary's profile card */}
      {showCard && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#E8E4DE] rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#7A1420] flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
              M
            </div>
            <div>
              <div className="font-semibold text-base text-[#1A1A1A]">{pc.name}</div>
              <div className="text-sm text-[#6B6B6B]">{pc.age} · {pc.location}</div>
            </div>
          </div>
          <div className="space-y-3">
            <Section title="Day in the life" items={pc.dayInLife} />
            <Section title="Pain points" items={pc.painPoints} boldIndex={pc.painPointBoldIndex} accent />
            <Section title="What she'd pay for" items={pc.wouldPayFor} />
            <Section title="Where to find her" items={pc.whereToFind} />
          </div>
        </motion.div>
      )}

      {showCard && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <MilesMessage text={s.milesFollowup} onDone={() => setShowFollowup(true)} />
        </motion.div>
      )}

      {showFollowup && (
        <motion.div {...fadeUp(0)}>
          <InputBar
            onChat={() => onAdvance(s.cta.advance)}
            suggestion={s.cta.label}
            typeSuggestion
          />
        </motion.div>
      )}
    </div>
  )
}

function Section({ title, items, boldIndex, accent = false }: {
  title: string; items: string[]; boldIndex?: number; accent?: boolean
}) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-[#A09A94] mb-1">{title}</div>
      <ul className="space-y-0.5">
        {items.map((item, i) => (
          <li key={i} className={`text-sm leading-snug ${accent && i === boldIndex ? 'font-semibold text-[#1A1A1A]' : 'text-[#6B6570]'}`}>
            · {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
