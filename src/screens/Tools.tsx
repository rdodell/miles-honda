import { motion } from 'framer-motion'
import MilesAvatar from '../components/MilesAvatar'
import InputBar from '../components/InputBar'
import scenario from '../scenario.json'

interface ToolsProps {
  showTooltip: (msg: string) => void
}

const s = scenario.screens['T.1']

const STAGE_COLORS: Record<string, string> = {
  spark:     '#F4B942',
  garage:    '#5B5FD9',
  testTrack: '#7A1420',
}

export default function Tools({ showTooltip }: ToolsProps) {
  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-20 relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-xl font-bold text-[#1A1A1A]">{s.header}</h1>
        <p className="text-sm text-[#A09A94] mt-0.5">{s.subhead}</p>
      </motion.div>

      {/* Shelves */}
      {s.shelves.map((shelf, si) => {
        const color = STAGE_COLORS[shelf.stage]
        return (
          <motion.div
            key={shelf.stage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.1 }}
          >
            <div
              className="text-sm font-semibold mb-2"
              style={{ color, fontFamily: "Zilla Slab, Georgia, serif", fontSize: 16 }}
            >
              {shelf.header}
            </div>
            <div className="flex flex-wrap gap-2 pb-1">
              {shelf.tools.map((tool) => (
                <button
                  key={tool}
                  onClick={() => showTooltip(s.toolTooltip)}
                  className="flex-shrink-0 bg-white border border-[#E8E4DE] rounded-xl px-4 py-2.5 text-sm text-[#1A1A1A] hover:bg-[#F2EEE8] transition-colors shadow-sm whitespace-nowrap"
                >
                  {tool}
                </button>
              ))}
            </div>
          </motion.div>
        )
      })}

      {/* Miles corner message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-2.5 mt-2"
      >
        <MilesAvatar size={32} />
        <span className="text-sm text-[#6B6570] italic">{s.milesCorner}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <InputBar
          onChat={() => showTooltip(s.toolTooltip)}
          suggestion="Which tool should I start with?"
        />
      </motion.div>
    </div>
  )
}
