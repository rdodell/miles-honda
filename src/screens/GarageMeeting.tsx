// Screen 2.3 — Post-meeting: Priya is now in Ian's network
// The Garage framing: people-layer, connection, not work-in-flight.

import { CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import scenario from '../scenario.json'

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

  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-20">

      <MilesMessage text={s.milesMessage} instant />

      {/* ── Your network — now has 1 person ── */}
      <motion.section {...fadeUp(1)}>
        <div className="flex items-center justify-between mb-2.5">
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#231F20', fontFamily: 'Inter, sans-serif', margin: 0 }}>
            Your network
          </h2>
          <span style={{ fontSize: 13, color: '#5B5FD9', fontWeight: 600 }}>1 connection</span>
        </div>

        {/* Priya — now connected */}
        <div
          className="flex items-center gap-3 bg-white rounded-2xl p-3.5 shadow-sm"
          style={{ border: '1.5px solid #E5E5E5' }}
        >
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white flex-shrink-0 relative"
            style={{ background: c.color, fontSize: 16, fontWeight: 700 }}
          >
            {c.initial}
            {/* Connected checkmark badge */}
            <div
              className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full flex items-center justify-center"
              style={{ background: '#fff', padding: 1 }}
            >
              <CheckCircle2 size={14} color="#5B5FD9" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div style={{ fontSize: 15, fontWeight: 600, color: '#231F20', fontFamily: 'Inter, sans-serif' }}>
              {c.name}
            </div>
            <div style={{ fontSize: 13, color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>
              {c.title}
            </div>
          </div>
          <span style={{ fontSize: 11, color: '#6B6B6B', fontFamily: 'Inter, sans-serif', fontWeight: 500, flexShrink: 0 }}>
            {c.metLabel}
          </span>
        </div>
      </motion.section>

      {/* ── What came out of it ── */}
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
              <span style={{ fontSize: 14, color: '#231F20', lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}>
                {t}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Continue CTA ── */}
      <motion.button
        {...fadeUp(6)}
        onClick={() => onAdvance(s.advance)}
        className="w-full py-3.5 rounded-xl font-semibold transition-opacity hover:opacity-90"
        style={{ background: '#CC0000', color: '#fff', fontSize: 14, fontFamily: 'Inter, sans-serif', border: 'none', cursor: 'pointer' }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Wrap up The Garage →
      </motion.button>

    </div>
  )
}
