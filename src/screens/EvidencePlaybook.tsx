import { motion } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import scenario from '../scenario.json'

interface Props { onAdvance: (screen: string) => void }
const s = scenario.screens['1.3c']

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
})

const toneColor = (tone: string) => {
  if (tone === 'next') return '#CC0000'
  if (tone === 'done') return '#7CB342'
  return '#6B6B6B'
}

export default function EvidencePlaybook({ onAdvance }: Props) {
  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-20">
      {/* Stage chip */}
      <motion.div {...fadeUp(0)}>
        <span style={{
          background: 'rgba(244,185,66,0.15)',
          border: '1px solid #F4B942',
          color: '#B8851E',
          fontFamily: 'Caveat, cursive',
          fontSize: 13,
          padding: '2px 10px',
          borderRadius: 99,
          display: 'inline-block',
        }}>{s.step}</span>
      </motion.div>

      {/* Miles intro */}
      <MilesMessage text={s.milesIntro} />

      {/* Step rows */}
      <motion.div {...fadeUp(0.15)} className="flex flex-col gap-3">
        {s.steps.map((step, i) => (
          <div
            key={i}
            className={`bg-white border border-[#E8E4DE] rounded-xl px-4 py-3 shadow-sm flex items-center gap-3 ${step.tone === 'skip' ? 'opacity-60' : ''}`}
          >
            <span className="text-xs font-mono text-[#A09A94] flex-shrink-0 w-6">{step.n}</span>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-semibold text-[#1A1A1A] ${step.tone === 'skip' ? 'line-through text-[#A09A94]' : ''}`}>{step.title}</div>
              <div className="text-xs text-[#6B6B6B] mt-0.5">{step.sub}</div>
            </div>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
              style={{
                color: toneColor(step.tone),
                background: `${toneColor(step.tone)}18`,
              }}
            >
              {step.status}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.div {...fadeUp(0.25)} className="flex items-center justify-between mt-1">
        <span className="text-sm text-[#A09A94]">
          <span style={{ color: '#7CB342' }}>1 done</span>
          {' · '}
          <span style={{ color: '#CC0000' }}>1 next</span>
          {' · 2 later · 1 skip'}
        </span>
        <button
          onClick={() => onAdvance(s.cta.advance)}
          className="bg-[#CC0000] text-white font-semibold py-2.5 px-5 rounded-xl hover:bg-[#AA0000] transition-colors shadow-sm text-sm"
        >
          {s.cta.label}
        </button>
      </motion.div>
    </div>
  )
}
