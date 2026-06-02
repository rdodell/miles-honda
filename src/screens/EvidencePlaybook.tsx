import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import IanInputBar from '../components/IanInputBar'
import scenario from '../scenario.json'
import { BEAT_AFTER_MILES, BEAT_BEFORE_ADVANCE } from '../timing'

interface Props { onAdvance: (screen: string) => void; showTooltip?: (msg: string) => void }
const s = scenario.screens['1.3c']
const ex = (s as any).typedExchange as {
  turns: { speaker: 'ian' | 'miles'; text: string; advance?: string }[]
  sendMode: string
}

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

// Display-only playbook card (no tapping)
function MethodCard({ step }: { step: (typeof s.steps)[number] }) {
  const isRec = step.tone === 'next'
  const c = toneColor(step.tone)
  return (
    <div
      className={`bg-white border rounded-xl px-4 py-3 shadow-sm flex items-center gap-3 ${step.tone === 'skip' ? 'opacity-60' : ''}`}
      style={{ borderColor: isRec ? '#7A1420' : '#E8E4DE' }}
    >
      <span className="text-xs font-mono text-[#A09A94] flex-shrink-0 w-6">{step.n}</span>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-semibold text-[#1A1A1A] ${step.tone === 'skip' ? 'line-through text-[#A09A94]' : ''}`}>{step.title}</div>
        <div className="text-xs text-[#6B6B6B] mt-0.5">{step.sub}</div>
      </div>
      <span className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0" style={{ color: c, background: `${c}18` }}>
        {step.status}
      </span>
    </div>
  )
}

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

export default function EvidencePlaybook({ onAdvance }: Props) {
  const [introDone, setIntroDone] = useState(false)
  // turnIdx = the turn currently in progress (Ian primed in the bar, or Miles streaming)
  const [turnIdx, setTurnIdx] = useState(0)
  const turns = ex.turns
  const active = introDone && turnIdx < turns.length ? turns[turnIdx] : null

  // Manual send: presenter clicks Send to commit the active Ian line
  function sendIan() {
    const t = turns[turnIdx]
    if (!t || t.speaker !== 'ian') return
    setTurnIdx(turnIdx + 1) // commit -> it renders as a sent bubble
    if (t.advance) setTimeout(() => onAdvance(t.advance!), BEAT_BEFORE_ADVANCE)
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

      {/* Miles intro */}
      <MilesMessage text={s.milesIntro} onDone={() => setTimeout(() => setIntroDone(true), BEAT_AFTER_MILES)} />

      <AnimatePresence>
        {introDone && (
          <motion.div className="flex flex-col gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {/* Counter */}
            <span className="text-sm text-[#A09A94]">
              <span style={{ color: '#7CB342' }}>1 done</span>
              {' · '}
              <span style={{ color: '#7A1420' }}>1 next</span>
              {' · 2 later · 1 skip'}
            </span>

            {/* The playbook — display-only context, not tappable */}
            <div className="flex flex-col gap-2">
              {s.steps.map((step) => <MethodCard key={step.n} step={step} />)}
            </div>

            {/* Scripted typed exchange */}
            <div className="flex flex-col gap-3 mt-1">
              {turns.slice(0, turnIdx + 1).map((turn, i) => {
                if (turn.speaker === 'ian') {
                  // active Ian line lives in the input bar, not a bubble, until sent
                  return i < turnIdx ? <IanBubble key={i} text={turn.text} /> : null
                }
                return (
                  <MilesMessage
                    key={i}
                    text={turn.text}
                    instant={i < turnIdx}
                    onDone={i === turnIdx ? () => setTimeout(() => setTurnIdx(i + 1), BEAT_AFTER_MILES) : undefined}
                  />
                )
              })}
            </div>

            {/* Input bar — Ian types his line here; the presenter clicks Send to commit */}
            <IanInputBar
              driver="chat"
              autoSend={false}
              placeholder="Type your reply to Miles…"
              suggestion={active && active.speaker === 'ian' ? active.text : undefined}
              onSubmit={sendIan}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
