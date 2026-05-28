import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import scenario from '../scenario.json'

interface JourneyCompleteProps {
  onAdvance: (screen: string) => void
}

const s = scenario.screens['3.5']

const STAGE_COLORS: Record<string, string> = {
  spark:     '#7CB342',
  garage:    '#42A5F5',
  testTrack: '#9575CD',
}

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.1, duration: 0.3 },
})

export default function JourneyComplete({ onAdvance }: JourneyCompleteProps) {
  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-20">
      {/* Headline */}
      <motion.h1 {...fadeUp(0)} className="text-xl font-bold text-[#1A1A1A] text-center">
        {s.headline}
      </motion.h1>

      {/* Three stage columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {s.columns.map((col, ci) => {
          const color = STAGE_COLORS[col.stage]
          return (
            <motion.div
              key={col.stage}
              {...fadeUp(ci + 1)}
              className="bg-white border border-[#E8E4DE] rounded-2xl p-4 shadow-sm"
            >
              <div
                className="text-sm font-semibold mb-3 pb-2 border-b border-[#E8E4DE]"
                style={{ color, fontFamily: "'Caveat', cursive", fontSize: 16 }}
              >
                {col.label}
              </div>
              <ul className="space-y-2">
                {col.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={14} style={{ color }} className="mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-[#1A1A1A] leading-snug">{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )
        })}
      </div>

      {/* Stat strip */}
      <motion.div {...fadeUp(4)} className="grid grid-cols-4 gap-2">
        {s.stats.map((stat) => (
          <div key={stat.label} className="bg-white border border-[#E8E4DE] rounded-2xl p-3 text-center shadow-sm">
            <div className="text-2xl font-bold text-[#1A1A1A]">{stat.value}</div>
            <div className="text-[10px] text-[#A09A94] mt-0.5 leading-tight">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Restart CTA */}
      <motion.button
        {...fadeUp(5)}
        onClick={() => onAdvance(s.cta.advance)}
        className="w-full border-2 border-[#CC0000] text-[#CC0000] font-semibold py-3.5 rounded-xl hover:bg-[#CC0000] hover:text-white transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {s.cta.label}
      </motion.button>
    </div>
  )
}
