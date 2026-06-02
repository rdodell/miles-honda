// Screen 2.3 — Post-meeting recap: Priya is now in Ian's network
// This screen appears after Ian and Priya have actually met on Thursday.

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import IanInputBar from '../components/IanInputBar'
import scenario from '../scenario.json'
import priyaAvatar from '../assets/priya-avatar.png'

interface GarageMeetingProps {
  onAdvance: (screen: string) => void
  showTooltip?: (msg: string) => void
}

const s = scenario.screens['2.3']

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.12, duration: 0.3 },
})

export default function GarageMeeting({ onAdvance }: GarageMeetingProps) {
  const c = s.networkContact
  const [showRest, setShowRest] = useState(false)

  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-20">
      {/* Meeting transition label */}
      <motion.div {...fadeUp(0)}>
        <span style={{
          background: 'rgba(91,95,217,0.1)',
          border: '1px solid #5B5FD9',
          color: '#5B5FD9',
          fontFamily: 'Zilla Slab, Georgia, serif',
          fontSize: 13,
          padding: '2px 10px',
          borderRadius: 99,
          display: 'inline-block',
        }}>Thursday · After the call with Priya</span>
      </motion.div>

      <MilesMessage text={s.milesMessage} onDone={() => setShowRest(true)} />

      <AnimatePresence>
        {showRest && (
          <motion.div
            className="flex flex-col gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
      {/* Your network — now has 1 new person */}
      <motion.section {...fadeUp(1)}>
        <div className="flex items-center justify-between mb-2.5">
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#231F20', fontFamily: 'Inter, sans-serif', margin: 0 }}>
            Your network
          </h2>
          <span style={{ fontSize: 13, color: '#5B5FD9', fontWeight: 600 }}>3 connections</span>
        </div>

        <div className="flex items-center gap-3 bg-white rounded-2xl p-3.5 shadow-sm" style={{ border: '1.5px solid #E5E5E5' }}>
          <div className="w-11 h-11 rounded-full flex-shrink-0 overflow-hidden">
            <img src={priyaAvatar} alt={c.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div style={{ fontSize: 15, fontWeight: 600, color: '#231F20', fontFamily: 'Inter, sans-serif' }}>{c.name}</div>
            <div style={{ fontSize: 13, color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>{c.title}</div>
          </div>
          <span style={{ fontSize: 11, color: '#6B6B6B', fontFamily: 'Inter, sans-serif', fontWeight: 500, flexShrink: 0 }}>{c.metLabel}</span>
        </div>
      </motion.section>

      {/* What came out of it */}
      <motion.section {...fadeUp(2)}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#231F20', fontFamily: 'Inter, sans-serif', margin: '0 0 10px' }}>
          What came out of it
        </h2>
        <div className="flex flex-col gap-2">
          {s.takeaways.map((t, i) => (
            <motion.div
              key={i}
              {...fadeUp(i + 3)}
              className="flex items-start gap-2.5 bg-white rounded-xl px-3.5 py-3"
              style={{ border: '1.5px solid #E5E5E5' }}
            >
              <CheckCircle2 size={16} color="#5B5FD9" style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 14, color: '#231F20', lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}>{t}</span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Ian sends his input line to advance */}
      <motion.div {...fadeUp(6)}>
        <IanInputBar
          driver="chat"
          suggestion={(s as any).ianInput?.text}
          onSubmit={() => onAdvance(s.advance)}
        />
      </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
