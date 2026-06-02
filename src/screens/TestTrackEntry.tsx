import { useState } from 'react'
import { motion } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import IanInputBar from '../components/IanInputBar'
import BranchPicker from '../components/BranchPicker'
import scenario from '../scenario.json'
import { BEAT_AFTER_MILES } from '../timing'

interface Props { onAdvance: (screen: string) => void; showTooltip?: (msg: string) => void }

const s = scenario.screens['3.0']
const ianInput = (s as any).ianInput as { text: string }

// Sequence: Miles proposes the model -> Ian asks what tools exist -> Miles surfaces the toolkit -> tools appear
const PHASES = ['miles-open', 'ian-input', 'ian-sent', 'miles-tools', 'tools'] as const
type Phase = (typeof PHASES)[number]

export default function TestTrackEntry({ onAdvance, showTooltip }: Props) {
  const [phase, setPhase] = useState<Phase>('miles-open')
  const reached = (p: Phase) => PHASES.indexOf(phase) >= PHASES.indexOf(p)

  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-20">
      {/* Miles proposes going straight to the model */}
      <MilesMessage
        text={s.milesMessage}
        onDone={() => setTimeout(() => setPhase('ian-input'), BEAT_AFTER_MILES)}
      />

      {/* Ian asks what tools are available (sent) */}
      {reached('ian-sent') && (
        <motion.div className="flex justify-end" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{
            background: 'var(--ink)', color: '#fff',
            borderRadius: '14px 14px 4px 14px', padding: '10px 14px',
            fontSize: 14, fontFamily: 'var(--font-cp-sans)', maxWidth: '80%',
            lineHeight: 1.5, boxShadow: 'var(--shadow-1)',
          }}>
            {ianInput.text}
          </div>
        </motion.div>
      )}

      {/* Only now does Miles surface the Test Track toolkit */}
      {reached('miles-tools') && (
        <MilesMessage
          text={(s as any).milesToolsIntro}
          onDone={() => setTimeout(() => setPhase('tools'), BEAT_AFTER_MILES)}
        />
      )}

      {/* Test Track toolkit as pick-and-respond options (BMC advances; others redirect) */}
      {reached('tools') && (
        <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#231F20', fontFamily: 'Inter, sans-serif', margin: '0 0 10px' }}>
            The Test Track toolkit
          </h2>
          <BranchPicker branch={s.branch as any} onAdvance={onAdvance} showTooltip={showTooltip} />
        </motion.section>
      )}

      {/* Persistent input bar — Ian's "what tools?" auto-sends; branch owns the bar once tools show */}
      {phase !== 'tools' && (
        <IanInputBar
          driver="chat"
          placeholder="Ask Miles, or pick an option above"
          suggestion={phase === 'ian-input' ? ianInput.text : undefined}
          onSubmit={phase === 'ian-input'
            ? () => { setPhase('ian-sent'); setTimeout(() => setPhase('miles-tools'), BEAT_AFTER_MILES) }
            : () => {}}
        />
      )}
    </div>
  )
}
