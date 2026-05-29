import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown } from 'lucide-react'
import MilesMessage from '../components/MilesMessage'
import scenario from '../scenario.json'

interface TestTrackFinanceProps {
  onAdvance: (screen: string) => void
}

const s = scenario.screens['3.2']
const cmp = s.comparison
const tbl = s.updatedTable

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.1, duration: 0.3 },
})

export default function TestTrackFinance({ onAdvance }: TestTrackFinanceProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [showActions, setShowActions] = useState(false)

  return (
    <div className="flex flex-col gap-4 px-5 py-5 pb-20">
      <MilesMessage text={s.milesMessage} onDone={() => setShowDetails(true)} />

      {showDetails && (
        <>
          {/* Comparison card */}
          <motion.div {...fadeUp(0)} className="bg-white border border-[#E8E4DE] rounded-2xl p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-[#F2EEE8] rounded-xl p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-[#A09A94] mb-1">{cmp.original.label}</div>
                <div className="text-lg font-bold text-[#1A1A1A]">{cmp.original.value}</div>
                <div className="text-xs text-[#A09A94]">{cmp.original.note}</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 mb-1">{cmp.updated.label}</div>
                <div className="text-lg font-bold text-amber-700">{cmp.updated.value}</div>
                <div className="text-xs text-amber-500">{cmp.updated.note}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-red-50 rounded-xl px-3 py-2">
              <TrendingDown size={14} className="text-[#CC0000]" />
              <span className="text-xs text-[#CC0000] font-medium">Gross margin: {cmp.marginBefore} → {cmp.marginAfter}</span>
            </div>
          </motion.div>

          {/* Updated table */}
          <motion.div {...fadeUp(1)} className="bg-white border border-[#E8E4DE] rounded-2xl p-4 shadow-sm">
            <p className="text-sm text-[#6B6570] mb-3">{tbl.intro}</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-semibold uppercase tracking-wide text-[#A09A94]">
                  <th className="text-left pb-2">Item</th>
                  <th className="text-right pb-2">Before</th>
                  <th className="text-right pb-2">After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DE]">
                {tbl.rows.map((row, i) => (
                  <tr key={i}>
                    <td className="py-2 text-[#1A1A1A]">{row.item}</td>
                    <td className="py-2 text-right text-[#A09A94]">{row.before}</td>
                    <td className="py-2 text-right font-semibold text-amber-700">{row.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Miles question */}
          <motion.div {...fadeUp(2)}>
            <MilesMessage text={s.milesQuestion} instant onDone={() => setShowActions(true)} />
          </motion.div>
        </>
      )}

      {/* Action buttons */}
      {showActions && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2"
        >
          {s.actions.map((action) => (
            <button
              key={action.label}
              onClick={() => onAdvance((action as any).advance)}
              className="flex-1 bg-[#CC0000] text-white font-semibold py-3 rounded-xl hover:bg-[#AA0000] transition-colors shadow-sm"
            >
              {action.label}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  )
}
