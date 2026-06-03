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
}

interface BranchPickerProps {
  branch: {
    type: string
    recommended: string
    presenterPath: string[]
    options: BranchOption[]
    /** When set, the recommended option is not click-to-advance; instead Ian
     *  types this confirmation after a push-back, and sending it advances. */
    confirm?: { text: string; advance: string }
  }
  onAdvance: (screen: string) => void
  showTooltip?: (msg: string) => void
  placeholder?: string
  renderOption?: (opt: BranchOption, isSelected: boolean, isRecommended: boolean, resortLabel?: string) => React.ReactNode
}

// The current in-progress pick. The pick IS the send: ianReply posts as a bubble immediately.
type Current =
  | { optId: string; phase: 'ian-sent' }    // Ian's reply bubble shown, waiting before Miles replies
  | { optId: string; phase: 'miles-reply' } // Miles streaming his reply
  | { optId: string; phase: 'done' }        // advancing

// Ian's sent chat bubble — identical to his normal sent messages on chat screens
function IanBubble({ text }: { text: string }) {
  return (
    <motion.div className="flex justify-end" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{
        background: 'var(--ink)', color: '#fff',
        borderRadius: '14px 14px 4px 14px', padding: '10px 14px',
        fontSize: 14, fontFamily: 'var(--font-cp-sans)', maxWidth: '80%',
        lineHeight: 1.5, boxShadow: 'var(--shadow-1)',
      }}>
        {text}
      </div>
    </motion.div>
  )
}

export default function BranchPicker({
  branch,
  onAdvance,
  renderOption,
  placeholder = 'Ask Miles, or pick an option above',
}: BranchPickerProps) {
  // Completed push-back exchanges accumulate as a transcript
  const [transcript, setTranscript] = useState<{ ianReply: string; milesReply: string }[]>([])
  const [current, setCurrent] = useState<Current | null>(null)
  const [addressed, setAddressed] = useState<Set<string>>(new Set())
  const [resorted, setResorted] = useState<Record<string, string>>({})
  const [confirmed, setConfirmed] = useState(false)

  // Typed-confirm flow (2.1): Ian types the confirmation and sending it advances.
  function handleConfirm() {
    if (confirmed || !branch.confirm) return
    setConfirmed(true)
    const target = branch.confirm.advance
    setTimeout(() => onAdvance(target), BEAT_BEFORE_ADVANCE)
  }

  const currentOpt = current ? branch.options.find((o) => o.id === current.optId) ?? null : null

  // Tapping an option IS the send: post its ianReply as a sent bubble, then Miles replies
  function handlePick(opt: BranchOption) {
    if (current) return
    setCurrent({ optId: opt.id, phase: 'ian-sent' })
    setTimeout(() => {
      setCurrent((c) => (c && c.optId === opt.id && c.phase === 'ian-sent' ? { optId: opt.id, phase: 'miles-reply' } : c))
    }, BEAT_BEFORE_MILES_REPLY)
  }

  function handleMilesDone() {
    if (!current) return
    const opt = branch.options.find((o) => o.id === current.optId)
    if (!opt) return

    if (opt.advance) {
      setCurrent({ optId: opt.id, phase: 'done' })
      const target = opt.advance
      setTimeout(() => onAdvance(target), BEAT_BEFORE_ADVANCE)
    } else {
      // Push-back: commit this exchange to the transcript, dim/resort the option, let Ian pick again
      setTranscript((prev) => [...prev, { ianReply: opt.ianReply, milesReply: opt.milesReply }])
      setAddressed((prev) => new Set([...prev, opt.id]))
      if (opt.resort) setResorted((prev) => ({ ...prev, [opt.id]: opt.resort! }))
      setCurrent(null)
    }
  }

  function defaultRenderOption(opt: BranchOption, isSelected: boolean, isRec: boolean, resortLabel?: string) {
    return (
      <div
        style={{
          width: '100%', textAlign: 'left',
          background: isSelected || isRec ? 'rgba(122,20,32,0.04)' : '#fff',
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
            <span style={{ fontSize: 11, fontWeight: 600, background: 'rgba(244,185,66,0.18)', color: '#B8851E', borderRadius: 99, padding: '2px 8px' }}>
              {resortLabel}
            </span>
          ) : isRec ? (
            <span style={{ fontSize: 11, fontWeight: 600, background: 'rgba(122,20,32,0.1)', color: '#7A1420', borderRadius: 99, padding: '2px 8px' }}>
              Recommended
            </span>
          ) : null}
        </span>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Option list — tap to pick */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {branch.options.map((opt) => {
          const isSelected = current?.optId === opt.id
          const isRec = opt.recommended === true || opt.id === branch.recommended
          const isAddressed = addressed.has(opt.id)
          const resortLabel = resorted[opt.id]
          // With a typed-confirm flow, the recommended option is display-only —
          // Ian confirms by typing, not by clicking it.
          const isConfirmTarget = !!branch.confirm && (opt.recommended === true || opt.id === branch.recommended)
          const clickable = !current && !isAddressed && !confirmed && !isConfirmTarget
          return (
            <motion.div
              key={opt.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: isAddressed ? 0.45 : 1, y: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => clickable && handlePick(opt)}
              style={{ cursor: clickable ? 'pointer' : 'default' }}
            >
              {renderOption
                ? renderOption(opt, isSelected, isRec, resortLabel)
                : defaultRenderOption(opt, isSelected, isRec, resortLabel)}
            </motion.div>
          )
        })}
      </div>

      {/* Transcript of completed push-back exchanges */}
      {transcript.map((ex, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <IanBubble text={ex.ianReply} />
          <MilesMessage text={ex.milesReply} instant />
        </div>
      ))}

      {/* Current pick — Ian's bubble, then Miles's reply */}
      <AnimatePresence>
        {current && currentOpt && (
          <motion.div key={`pick-${current.optId}`} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <IanBubble text={currentOpt.ianReply} />
            {(current.phase === 'miles-reply' || current.phase === 'done') && (
              <MilesMessage text={currentOpt.milesReply} onDone={handleMilesDone} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ian's typed confirmation (2.1), shown as a sent bubble once committed */}
      {confirmed && branch.confirm && <IanBubble text={branch.confirm.text} />}

      {/* Input bar: active typed-confirm after a push-back; otherwise passive (the pick is the send) */}
      {branch.confirm && !confirmed && !current && transcript.length > 0 ? (
        <IanInputBar
          driver="chat"
          placeholder={placeholder}
          suggestion={branch.confirm.text}
          onSubmit={handleConfirm}
        />
      ) : (
        <IanInputBar driver="chat" placeholder={placeholder} onSubmit={() => {}} />
      )}
    </div>
  )
}
