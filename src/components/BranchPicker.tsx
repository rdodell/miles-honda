import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MilesMessage from './MilesMessage'
import IanInputBar from './IanInputBar'
import { BEAT_BEFORE_MILES_REPLY, BEAT_BEFORE_ADVANCE } from '../timing'

export interface BranchOption {
  id: string
  label: string
  recommended?: boolean
  ianReply: string
  milesReply: string
  resort?: string
  advance: string | null
  /** When true, the scripted advance happens by Ian TYPING this reply in the chat input,
      not by a second card tap (1.3c interviews). */
  viaInput?: boolean
}

interface BranchPickerProps {
  branch: {
    type: string
    recommended: string
    presenterPath: string[]
    options: BranchOption[]
  }
  onAdvance: (screen: string) => void
  showTooltip?: (msg: string) => void
  placeholder?: string
  renderOption?: (opt: BranchOption, isSelected: boolean, isRecommended: boolean, resortLabel?: string) => React.ReactNode
}

type PickState =
  | { phase: 'idle' }
  | { phase: 'ian-typing'; optId: string }
  | { phase: 'miles-reply'; optId: string }
  | { phase: 'done'; optId: string }

export default function BranchPicker({
  branch,
  onAdvance,
  renderOption,
  placeholder = 'Ask Miles, or pick an option above',
}: BranchPickerProps) {
  const [pickState, setPickState] = useState<PickState>({ phase: 'idle' })
  // null-advance options that have been addressed (dimmed, can't re-pick)
  const [addressed, setAddressed] = useState<Set<string>>(new Set())
  // resort overrides per option id
  const [resorted, setResorted] = useState<Record<string, string>>({})
  // a viaInput option primed for typed acceptance (after a pushback)
  const [primedOptId, setPrimedOptId] = useState<string | null>(null)

  const currentOpt =
    pickState.phase !== 'idle'
      ? branch.options.find((o) => o.id === pickState.optId) ?? null
      : null
  const primedOpt = primedOptId ? branch.options.find((o) => o.id === primedOptId) ?? null : null

  function handlePick(opt: BranchOption) {
    if (pickState.phase !== 'idle') return
    setPrimedOptId(null)
    setPickState({ phase: 'ian-typing', optId: opt.id })
  }

  // Ian's reply has finished typing into the input line → beat → Miles responds
  function handleIanTyped() {
    if (pickState.phase !== 'ian-typing') return
    const optId = pickState.optId
    setTimeout(() => {
      setPickState((cur) => (cur.phase === 'ian-typing' && cur.optId === optId ? { phase: 'miles-reply', optId } : cur))
    }, BEAT_BEFORE_MILES_REPLY)
  }

  // Ian sends the primed (viaInput) reply through the chat input → Miles responds
  function handlePrimedSend() {
    if (!primedOpt) return
    const optId = primedOpt.id
    setPrimedOptId(null)
    setPickState({ phase: 'miles-reply', optId })
  }

  function handleMilesDone() {
    if (pickState.phase === 'idle') return
    const opt = branch.options.find((o) => o.id === pickState.optId)
    if (!opt) return

    if (opt.advance) {
      setPickState({ phase: 'done', optId: opt.id })
      const target = opt.advance
      setTimeout(() => onAdvance(target), BEAT_BEFORE_ADVANCE)
    } else {
      // Push-back: mark addressed, apply resort, reset so Ian can pick again
      setAddressed((prev) => new Set([...prev, opt.id]))
      if (opt.resort) setResorted((prev) => ({ ...prev, [opt.id]: opt.resort! }))
      // If the recommended option accepts typed input, prime it so Ian advances by typing
      const rec = branch.options.find(
        (o) => (o.recommended === true || o.id === branch.recommended) && o.viaInput && o.advance,
      )
      setPrimedOptId(rec ? rec.id : null)
      setPickState({ phase: 'idle' })
    }
  }

  function defaultRenderOption(opt: BranchOption, isSelected: boolean, isRec: boolean, resortLabel?: string) {
    return (
      <div
        style={{
          width: '100%', textAlign: 'left',
          background: isSelected ? 'rgba(122,20,32,0.04)' : isRec ? 'rgba(122,20,32,0.04)' : '#fff',
          border: `1.5px solid ${isSelected || isRec ? '#7A1420' : '#E8E4DE'}`,
          borderRadius: 12, padding: '12px 14px',
          transition: 'border-color 0.15s, background 0.15s',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
          fontFamily: 'var(--font-cp-sans)',
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)' }}>{opt.label}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {resortLabel ? (
            <span style={{
              fontSize: 11, fontWeight: 600,
              background: 'rgba(244,185,66,0.18)', color: '#B8851E',
              borderRadius: 99, padding: '2px 8px',
            }}>
              {resortLabel}
            </span>
          ) : isRec ? (
            <span style={{
              fontSize: 11, fontWeight: 600,
              background: 'rgba(122,20,32,0.1)', color: '#7A1420',
              borderRadius: 99, padding: '2px 8px',
            }}>
              Recommended
            </span>
          ) : null}
        </span>
      </div>
    )
  }

  const barSuggestion =
    pickState.phase !== 'idle' ? currentOpt?.ianReply : primedOpt ? primedOpt.ianReply : undefined

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Option list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {branch.options.map((opt) => {
          const isSelected = pickState.phase !== 'idle' && pickState.optId === opt.id
          const isRec = opt.recommended === true || opt.id === branch.recommended
          const isAddressed = addressed.has(opt.id)
          const resortLabel = resorted[opt.id]
          return (
            <motion.div
              key={opt.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: isAddressed ? 0.45 : 1, y: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => !isSelected && !isAddressed && handlePick(opt)}
              style={{ cursor: isSelected || isAddressed ? 'default' : 'pointer' }}
            >
              {renderOption
                ? renderOption(opt, isSelected, isRec, resortLabel)
                : defaultRenderOption(opt, isSelected, isRec, resortLabel)}
            </motion.div>
          )
        })}
      </div>

      {/* Miles' reply — appears after Ian's reply finishes typing in the input line */}
      <AnimatePresence>
        {(pickState.phase === 'miles-reply' || pickState.phase === 'done') && currentOpt && (
          <motion.div
            key={`miles-${currentOpt.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginTop: 2 }}
          >
            <MilesMessage text={currentOpt.milesReply} onDone={handleMilesDone} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input line — passive until Ian picks; his reply types here. When a viaInput option is
          primed, his reply types here and Send advances (no second card tap). */}
      <IanInputBar
        driver="chat"
        placeholder={placeholder}
        suggestion={barSuggestion}
        onSuggestionTyped={handleIanTyped}
        onSubmit={primedOpt && pickState.phase === 'idle' ? handlePrimedSend : () => {}}
      />
    </div>
  )
}
