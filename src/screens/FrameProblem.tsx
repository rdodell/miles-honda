import { motion } from 'framer-motion'
import { Flag } from 'lucide-react'
import MilesMessage from '../components/MilesMessage'
import scenario from '../scenario.json'

interface Props { onAdvance: (screen: string) => void }
const s = scenario.screens['1.3']

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
})

export default function FrameProblem({ onAdvance }: Props) {
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

      {/* Question rows */}
      <motion.div {...fadeUp(0.15)} className="flex flex-col gap-3">
        {s.questions.map((q, i) => (
          <div
            key={i}
            className={`bg-white rounded-xl px-4 py-3 ${q.filled ? 'border border-[#E8E4DE]' : 'border border-dashed border-[#E8E4DE]'} shadow-sm`}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[#A09A94] mb-0.5">{q.q}</div>
            {q.filled && q.a ? (
              <div className="text-sm text-[#1A1A1A]">{q.a}</div>
            ) : (
              <div className="text-sm text-[#A09A94] italic">{(q as { hint?: string }).hint}</div>
            )}
            {'flag' in q && q.flag && (
              <div className="flex items-center gap-1 mt-1.5 text-[#CC0000]">
                <Flag size={12} />
                <span className="text-xs">← {q.flag}</span>
              </div>
            )}
          </div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.div {...fadeUp(0.25)} className="flex items-center justify-between mt-1">
        <span className="text-sm">
          {s.counter.includes('flag') ? (
            <>
              <span className="text-[#A09A94]">{s.counter.split(' · ')[0]} · </span>
              <span className="text-[#CC0000] font-medium">{s.counter.split(' · ')[1]}</span>
            </>
          ) : (
            <span className="text-[#A09A94]">{s.counter}</span>
          )}
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
