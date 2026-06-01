import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import IanTyping from './IanTyping'
import MilesMessage from './MilesMessage'

export interface BranchOption {
  id: string
  label: string
  recommended?: boolean
  ianReply: string
  milesReply: string
  resort?: string
  advance: string | null
}

interface BranchPickerProps {
  branch: {
    type: string
    recommended: string
    presenterPath: string[]
    options: BranchOption[]
  }
  onAdvance: (screen: string) => void
  showTooltip: (msg: string) => void
  renderOption?: (opt: BranchOption, isSelected: boolean, isRecommended: boolean) => React.ReactNode
}

type PickState =
  | { phase: 'idle' }
  | { phase: 'ian-typing'; optId: string }
  | { phase: 'miles-reply'; optId: string }
  | { phase: 'done'; optId: string }

export default function BranchPicker({ branch, onAdvance, renderOption }: BranchPickerProps) {
  const [pickState, setPickState] = useState<PickState>({ phase: 'idle' })
  // Track which null-advance options have been addressed (dismissed)
  const [addressed, setAddressed] = useState<Set<string>>(new Set())
  // Track resort overrides per option id
  const [resorted, setResorted] = useState<Record<string, string>>({})

  const currentOpt =
    pickState.phase !== 'idle'
      ? branch.options.find((o) => o.id === pickState.optId) ?? null
      : null

  function handlePick(opt: BranchOption) {
    if (pickState.phase !== 'idle') return
    setPickState({ phase: 'ian-typing', optId: opt.id })
  }

  function handleIanSent() {
    setPickState((s) => s.phase === 'ian-typing' ? { phase: 'miles-reply', optId: s.optId } : s)
  }

  function handleMilesDone() {
    const opt = branch.options.find((o) => o.id === (pickState as { optId: string }).optId)
    if (!opt) return

    if (opt.advance) {
      setPickState({ phase: 'done', optId: opt.id })
      onAdvance(opt.advance)
    } else {
      // Push-back: mark addressed, apply resort if present
      setAddressed((prev) => new Set([...prev, opt.id]))
      if (opt.resort) {
        setResorted((prev) => ({ ...prev, [opt.id]: opt.resort! }))
      }
      setPickState({ phase: 'idle' })
    }
  }

  // Default option renderer
  function defaultRenderOption(opt: BranchOption, isSelected: boolean, isRec: boolean) {
    const resortLabel = resorted[opt.id]
    return (
      <button
        key={opt.id}
        onClick={() => handlePick(opt)}
        disabled={isSelected || addressed.has(opt.id)}
        style={{
          width: '100%', textAlign: 'left',
          background: isRec ? 'rgba(122,20,32,0.04)' : '#fff',
          border: `1.5px solid ${isRec ? '#7A1420' : '#E8E4DE'}`,
          borderRadius: 12, padding: '12px 14px',
          cursor: isSelected || addressed.has(opt.id) ? 'default' : 'pointer',
          opacity: addressed.has(opt.id) ? 0.45 : 1,
          transition: 'border-color 0.15s, background 0.15s',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
          fontFamily: 'var(--font-cp-sans)',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{opt.label}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {resortLabel && (
            <span style={{
              fontSize: 11, fontWeight: 600,
              background: 'rgba(244,185,66,0.18)', color: '#B8851E',
              borderRadius: 99, padding: '2px 8px',
            }}>
              {resortLabel}
            </span>
          )}
          {isRec && !resortLabel && (
            <span style={{
              fontSize: 11, fontWeight: 600,
              background: 'rgba(122,20,32,0.1)', color: '#7A1420',
              borderRadius: 99, padding: '2px 8px',
            }}>
              Recommended
            </span>
          )}
        </span>
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Option list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {branch.options.map((opt) => {
          const isSelected = pickState.phase !== 'idle' && (pickState as { optId: string }).optId === opt.id
          const isRec = opt.recommended === true || opt.id === branch.recommended
          if (renderOption) {
            return (
              <div key={opt.id} onClick={() => !isSelected && !addressed.has(opt.id) && handlePick(opt)}
                style={{ cursor: isSelected || addressed.has(opt.id) ? 'default' : 'pointer' }}
              >
                {renderOption(opt, isSelected, isRec)}
              </div>
            )
          }
          return (
            <motion.div
              key={opt.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {defaultRenderOption(opt, isSelected, isRec)}
            </motion.div>
          )
        })}
      </div>

      {/* Ian typing + Miles reply thread */}
      <AnimatePresence>
        {(pickState.phase === 'ian-typing' || pickState.phase === 'miles-reply' || pickState.phase === 'done') && currentOpt && (
          <motion.div
            key={`thread-${currentOpt.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}
          >
            <IanTyping message={currentOpt.ianReply} onSent={handleIanSent} />
            {(pickState.phase === 'miles-reply' || pickState.phase === 'done') && (
              <MilesMessage
                text={currentOpt.milesReply}
                onDone={handleMilesDone}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
