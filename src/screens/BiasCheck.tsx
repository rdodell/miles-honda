import { motion } from 'framer-motion'
import { Flag } from 'lucide-react'
import MilesMessage from '../components/MilesMessage'
import scenario from '../scenario.json'

interface Props { onAdvance: (screen: string) => void }
const s = scenario.screens['1.3b']

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
})

export default function BiasCheck({ onAdvance }: Props) {
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

      {/* Spectrum lane */}
      <motion.div {...fadeUp(0.15)} className="relative">
        {/* Labels */}
        <div className="flex justify-between text-[11px] font-semibold mb-2">
          <span style={{ color: '#CC0000' }}>◀ Your hunches</span>
          <span style={{ color: '#7CB342' }}>User-validated ▶</span>
        </div>

        {/* Gradient bar */}
        <div className="relative h-2 rounded-full mb-6" style={{
          background: 'linear-gradient(90deg, rgba(204,0,0,0.45), #FAFAFA 50%, rgba(124,179,66,0.45))'
        }} />

        {/* Items positioned along the spectrum — staggered into 2 rows */}
        <div className="relative" style={{ height: 110 }}>
          {s.items.map((item, i) => {
            const isFlag = 'flag' in item && item.flag
            const row = i % 2
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${item.pos}%`,
                  top: row === 0 ? 0 : 56,
                  transform: 'translateX(-50%)',
                  minWidth: 110,
                  maxWidth: 140,
                }}
              >
                <div className={`rounded-xl px-2.5 py-2 text-xs text-center shadow-sm border ${
                  isFlag
                    ? 'bg-red-50 border-[#CC0000]/30 text-[#CC0000]'
                    : 'bg-green-50 border-[#7CB342]/30 text-[#3A7D22]'
                }`}>
                  <div className="font-medium leading-tight">{item.text}</div>
                  {isFlag && (
                    <div className="flex items-center justify-center gap-0.5 mt-0.5 text-[#CC0000]">
                      <Flag size={10} />
                      <span style={{ fontSize: 10 }}>{(item as { flag?: string }).flag}</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Log card */}
      <motion.div {...fadeUp(0.3)}>
        <div className="rounded-xl px-4 py-3 text-sm text-[#B8851E]" style={{
          background: 'rgba(244,185,66,0.15)',
          border: '1px solid #F4B942',
        }}>
          ● {s.log}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div {...fadeUp(0.35)} className="flex justify-end">
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
