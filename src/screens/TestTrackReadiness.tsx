import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import MilesMessage from '../components/MilesMessage'
import IanInputBar from '../components/IanInputBar'
import BranchPicker from '../components/BranchPicker'
import scenario from '../scenario.json'

interface TestTrackReadinessProps {
  onAdvance: (screen: string) => void
  showTooltip?: (msg: string) => void
}

const s = scenario.screens['3.4']

export default function TestTrackReadiness({ onAdvance, showTooltip }: TestTrackReadinessProps) {
  const [showScorecard, setShowScorecard] = useState(false)
  const [showBranch, setShowBranch] = useState(false)

  return (
    <div className="flex flex-col gap-4 px-5 py-5 pb-20">
      <MilesMessage text={s.milesMessage} onDone={() => setShowScorecard(true)} />

      {showScorecard && (
        <>
          {/* Scorecard */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#E8E4DE] rounded-2xl p-4 shadow-sm"
          >
            <div className="space-y-3">
              {s.scorecard.map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  {row.status === 'pass'
                    ? <CheckCircle2 size={18} className="text-[#7CB342] flex-shrink-0 mt-0.5" />
                    : <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  }
                  <div>
                    <div className="text-sm font-medium text-[#1A1A1A]">{row.label}</div>
                    <div className="text-xs text-[#A09A94]">{row.detail}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Miles followup */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <MilesMessage text={s.milesFollowup} instant onDone={() => setShowBranch(true)} />
          </motion.div>
        </>
      )}

      {/* BranchPicker for prep vs seed-review */}
      {showBranch && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <BranchPicker
            branch={s.branch as any}
            onAdvance={onAdvance}
            showTooltip={(msg) => showTooltip?.(msg)}
          />
        </motion.div>
      )}

      {/* IanInputBar */}
      {showBranch && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <IanInputBar
            driver="chat"
            suggestion={(s as any).ianInput?.text}
            onSubmit={() => {}}
          />
        </motion.div>
      )}
    </div>
  )
}
