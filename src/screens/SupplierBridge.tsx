import { useState, useEffect } from 'react'
import { Mic } from 'lucide-react'
import { motion } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import IanInputBar from '../components/IanInputBar'
import scenario from '../scenario.json'
import { BEAT_AFTER_MILES, BEAT_BEFORE_ADVANCE } from '../timing'

interface Props { onAdvance: (screen: string) => void }

const s = scenario.screens['1.5']
const ianInput = (s as any).ianInput as { driver: string; text: string; voiceNote?: string }

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
})

// Small waveform bars — purely decorative
function WaveformBars() {
  const heights = [4, 8, 12, 8, 14, 10, 6, 12, 8, 4]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {heights.map((h, i) => (
        <div key={i} style={{ width: 3, height: h, borderRadius: 2, background: 'rgba(255,255,255,0.7)' }} />
      ))}
    </div>
  )
}

export default function SupplierBridge({ onAdvance }: Props) {
  const [showInput, setShowInput] = useState(false)
  const [sent, setSent] = useState(false)

  // Ian sends his one voice memo, then we advance to the Garage
  function send() {
    if (sent) return
    setSent(true)
    setTimeout(() => onAdvance((s as any).advance), BEAT_BEFORE_ADVANCE + 700)
  }

  // Auto-send (global autoSend): once the voice bar appears, Ian "records" for a beat then it posts on its own
  useEffect(() => {
    if (!showInput || sent) return
    const t = setTimeout(() => send(), 1100)
    return () => clearTimeout(t)
  }, [showInput, sent])

  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-20">
      {/* Miles asks how Ian wants to tackle supply chain */}
      <MilesMessage text={s.milesIntro} onDone={() => setTimeout(() => setShowInput(true), BEAT_AFTER_MILES)} />

      {/* Ian's voice clip — the one voice moment in the flow */}
      {sent && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
          <div
            aria-label={ianInput.voiceNote ?? ianInput.text}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'var(--ink)', color: '#fff',
              borderRadius: '20px 20px 4px 20px', padding: '10px 16px',
              boxShadow: 'var(--shadow-1)',
            }}
          >
            <Mic size={15} style={{ color: '#fff', flexShrink: 0 }} />
            <WaveformBars />
            <span style={{ fontSize: 13, fontFamily: 'var(--font-cp-sans)', fontWeight: 600, color: '#fff', marginLeft: 2 }}>0:08</span>
          </div>
        </motion.div>
      )}

      {/* Voice input bar — Ian records his reply (the one voice driver in the flow) */}
      {showInput && !sent && (
        <motion.div {...fadeUp(0.1)}>
          <IanInputBar driver="voice" suggestion={ianInput.text} autoSend={false} onSubmit={send} />
        </motion.div>
      )}
    </div>
  )
}
