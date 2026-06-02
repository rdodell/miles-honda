import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import BranchPicker from '../components/BranchPicker'
import type { BranchOption } from '../components/BranchPicker'
import scenario from '../scenario.json'

interface Props { onAdvance: (screen: string) => void; showTooltip: (msg: string) => void }
const s = scenario.screens['1.3c']

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
})

const toneColor = (tone: string) => {
  if (tone === 'next') return '#7A1420'
  if (tone === 'done') return '#7CB342'
  return '#6B6B6B'
}

// Map each branch option id to its static step card data
const OPTION_TO_STEP: Record<string, string> = {
  interviews: 'Customer interviews',
  observation: 'Direct observation',
  smoke: 'Smoke test',
  competitor: 'Competitor teardown',
  research: 'Existing research scan',
}
const getStep = (optId: string) => s.steps.find((st) => st.title === OPTION_TO_STEP[optId])

export default function EvidencePlaybook({ onAdvance, showTooltip }: Props) {
  const [showContent, setShowContent] = useState(false)

  // Step-card renderer for the branch picker. resortLabel re-tags a pushed-back option
  // (e.g. Direct observation -> "After 3 interviews").
  function renderOption(opt: BranchOption, isSelected: boolean, isRec: boolean, resortLabel?: string) {
    const step = getStep(opt.id)
    if (!step) return null
    const statusLabel = resortLabel ?? step.status
    const statusColor = resortLabel ? '#B8851E' : toneColor(step.tone)
    const statusBg = resortLabel ? 'rgba(244,185,66,0.18)' : `${toneColor(step.tone)}18`
    return (
      <div
        className={`bg-white border rounded-xl px-4 py-3 shadow-sm flex items-center gap-3 ${step.tone === 'skip' ? 'opacity-60' : ''}`}
        style={{
          transition: 'border-color 0.15s, background 0.15s',
          background: isSelected ? 'rgba(122,20,32,0.04)' : '#fff',
          borderColor: isSelected || isRec ? '#7A1420' : '#E8E4DE',
          cursor: isSelected ? 'default' : 'pointer',
        }}
      >
        <span className="text-xs font-mono text-[#A09A94] flex-shrink-0 w-6">{step.n}</span>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-semibold text-[#1A1A1A] ${step.tone === 'skip' ? 'line-through text-[#A09A94]' : ''}`}>{step.title}</div>
          <div className="text-xs text-[#6B6B6B] mt-0.5">{step.sub}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
          {/* Single status badge only (the recommended step already reads "Recommended next") */}
          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: statusColor, background: statusBg }}>
            {statusLabel}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 px-5 pt-8 pb-20">
      {/* Stage chip */}
      <motion.div {...fadeUp(0)}>
        <span style={{
          background: 'rgba(244,185,66,0.15)',
          border: '1px solid #F4B942',
          color: '#B8851E',
          fontFamily: 'Zilla Slab, Georgia, serif',
          fontSize: 13,
          padding: '2px 10px',
          borderRadius: 99,
          display: 'inline-block',
        }}>{s.step}</span>
      </motion.div>

      {/* Miles speaks first */}
      <MilesMessage text={s.milesIntro} onDone={() => setShowContent(true)} />

      <AnimatePresence>
        {showContent && (
          <motion.div
            className="flex flex-col gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Counter */}
            <motion.div {...fadeUp(0.1)} className="flex items-center mt-0">
              <span className="text-sm text-[#A09A94]">
                <span style={{ color: '#7CB342' }}>1 done</span>
                {' · '}
                <span style={{ color: '#7A1420' }}>1 next</span>
                {' · 2 later · 1 skip'}
              </span>
            </motion.div>

            {/* Branch picker — Ian's reply types in the input line, then Miles responds */}
            <BranchPicker
              branch={s.branch as any}
              onAdvance={onAdvance}
              showTooltip={showTooltip}
              renderOption={renderOption}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
