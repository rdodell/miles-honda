import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import IanInputBar from '../components/IanInputBar'
import scenario from '../scenario.json'
import { BEAT_AFTER_MILES } from '../timing'
import lauraAvatar from '../assets/laura-avatar.png'

interface Props { onAdvance: (screen: string) => void }
const s = scenario.screens['1.3d']
const pc = s.personaCard
const ianInput = (s as any).ianInput as { text: string }

// milesIntro -> card (readable) -> beat -> milesFollowup -> input
const PHASES = ['intro', 'card', 'followup', 'input'] as const
type Phase = (typeof PHASES)[number]

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
})

export default function LauraIntro({ onAdvance }: Props) {
  const [phase, setPhase] = useState<Phase>('intro')
  const reached = (p: Phase) => PHASES.indexOf(phase) >= PHASES.indexOf(p)

  // After the card appears, hold a beat so it's readable before Miles follows up
  useEffect(() => {
    if (phase !== 'card') return
    const t = setTimeout(() => setPhase('followup'), BEAT_AFTER_MILES)
    return () => clearTimeout(t)
  }, [phase])

  return (
    <div className="flex flex-col gap-4 px-5 py-5 pb-20">
      {/* Miles surfaces Laura, then the card appears (no prompt before it) */}
      <MilesMessage text={s.milesIntro} onDone={() => setTimeout(() => setPhase('card'), BEAT_AFTER_MILES)} />

      {/* Laura's profile card */}
      {reached('card') && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#E8E4DE] rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <img src={lauraAvatar} alt={pc.name} className="w-12 h-12 rounded-full flex-shrink-0 object-cover" />
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

      {reached('followup') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <MilesMessage text={s.milesFollowup} onDone={() => setTimeout(() => setPhase('input'), BEAT_AFTER_MILES)} />
        </motion.div>
      )}

      {reached('input') && (
        <motion.div {...fadeUp(0)}>
          <IanInputBar
            driver="chat"
            suggestion={ianInput.text}
            onSubmit={() => onAdvance(s.cta.advance)}
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
