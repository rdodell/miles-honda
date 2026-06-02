import { useState } from 'react'
import { motion } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import IanInputBar from '../components/IanInputBar'
import scenario from '../scenario.json'
import { BEAT_AFTER_MILES } from '../timing'

interface SparkChatProps {
  onAdvance: (screen: string) => void
  showTooltip?: (msg: string) => void
}

const s = scenario.screens['1.2']
const ianInput = (s as any).ianInput as { text: string }

// Plain chat beat: Ian opens -> Miles responds -> Ian's reply auto-sends -> advance
const PHASES = ['open', 'opened', 'miles', 'reply'] as const
type Phase = (typeof PHASES)[number]

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

export default function SparkChat({ onAdvance }: SparkChatProps) {
  const [phase, setPhase] = useState<Phase>('open')
  const reached = (p: Phase) => PHASES.indexOf(phase) >= PHASES.indexOf(p)

  return (
    <div className="flex flex-col gap-4 px-5 py-5 pb-20">
      {/* Ian opens (sent after it auto-types in the input bar) */}
      {reached('opened') && <IanBubble text={s.ianMessage} />}

      {/* Miles responds */}
      {reached('miles') && (
        <MilesMessage
          text={s.milesResponse}
          onDone={() => setTimeout(() => setPhase('reply'), BEAT_AFTER_MILES)}
        />
      )}

      {/* Persistent input bar — Ian's lines auto-type and auto-send here */}
      <IanInputBar
        driver="chat"
        placeholder="Ask Miles something…"
        suggestion={phase === 'open' ? s.ianMessage : phase === 'reply' ? ianInput.text : undefined}
        onSubmit={
          phase === 'open'
            ? () => { setPhase('opened'); setTimeout(() => setPhase('miles'), BEAT_AFTER_MILES) }
            : phase === 'reply'
              ? () => onAdvance('1.3')
              : () => {}
        }
      />
    </div>
  )
}
