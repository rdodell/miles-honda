import { motion } from 'framer-motion'
import { Zap, Hammer, TestTube2, Wrench } from 'lucide-react'
import MilesMessage from '../components/MilesMessage'
import scenario from '../scenario.json'

interface DashboardProps {
  onAdvance: (screen: string) => void
}

const s = scenario.screens['D.1']

const STAGE_COLORS: Record<string, string> = {
  spark:     '#F4B942',
  garage:    '#5B5FD9',
  testTrack: '#7A1420',
}

const STAGE_ICONS: Record<string, React.FC<{ size?: number; color?: string }>> = {
  spark:     Zap,
  garage:    Hammer,
  testTrack: TestTube2,
}

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.1, duration: 0.3 },
})

export default function Dashboard({ onAdvance }: DashboardProps) {
  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-20">
      <MilesMessage text={s.milesMessage} instant />

      {/* This week */}
      <motion.section {...fadeUp(1)}>
        <h2 className="text-base font-semibold text-[#1A1A1A] mb-2.5">This week</h2>
        <div className="flex flex-col gap-2">
          {s.weekActivity.map((item, i) => {
            const color = item.stage ? STAGE_COLORS[item.stage] : '#6B6B6B'
            const Icon = item.stage ? STAGE_ICONS[item.stage] : Wrench
            return (
              <motion.div
                key={i}
                {...fadeUp(i + 2)}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-[#E8E4DE] shadow-sm"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
                  <Icon size={13} color={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[#1A1A1A]">{item.label}</div>
                  <div className="text-xs text-[#A09A94]">{item.detail}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* Where to next */}
      <motion.section {...fadeUp(5)}>
        <h2 className="text-base font-semibold text-[#1A1A1A] mb-2.5">Where do you want to go?</h2>
        <div className="grid grid-cols-2 gap-2">
          {s.suggestions.map((sug, i) => {
            const color = sug.stage ? STAGE_COLORS[sug.stage] : '#6B6B6B'
            const Icon = sug.stage ? STAGE_ICONS[sug.stage] : Wrench
            return (
              <motion.button
                key={sug.label}
                {...fadeUp(i + 6)}
                onClick={() => onAdvance(sug.advance)}
                className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3 border border-[#E8E4DE] text-left hover:bg-[#F9F9F9] transition-colors shadow-sm"
              >
                <Icon size={15} color={color} />
                <span className="text-sm font-medium text-[#1A1A1A]">{sug.label}</span>
              </motion.button>
            )
          })}
        </div>
      </motion.section>
    </div>
  )
}
