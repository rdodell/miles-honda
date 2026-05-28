// Screen 2.2 — Priya scheduling confirmation
// Miles has made the intro; Priya replied; ready to book.

import { CalendarDays, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import Tooltip from '../components/Tooltip'
import scenario from '../scenario.json'

interface GarageEmailProps {
  onAdvance: (screen: string) => void
}

const s = scenario.screens['2.2']

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.12, duration: 0.3 },
})

export default function GarageEmail({ onAdvance }: GarageEmailProps) {
  const m = s.meetingCard

  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-20">

      <MilesMessage text={s.milesMessage} instant />

      {/* ── Meeting card ── */}
      <motion.div
        {...fadeUp(1)}
        className="bg-white rounded-2xl p-4 shadow-sm"
        style={{ border: '1.5px solid #E5E5E5' }}
      >
        {/* Person row */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-white flex-shrink-0"
            style={{ background: m.color, fontSize: 16, fontWeight: 700 }}
          >
            {m.initial}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#231F20', fontFamily: 'Inter, sans-serif' }}>
              {m.person}
            </div>
            <div style={{ fontSize: 13, color: '#6B6B6B', fontFamily: 'Inter, sans-serif' }}>
              {m.title}
            </div>
          </div>
        </div>

        {/* Time details */}
        <div className="flex gap-3 mb-4">
          <div
            className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{ background: '#E8ECFA' }}
          >
            <CalendarDays size={15} color="#5B5FD9" />
            <div>
              <div style={{ fontSize: 11, color: '#6B6B6B', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Inter, sans-serif' }}>
                Day
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#231F20', fontFamily: 'Inter, sans-serif' }}>
                {m.day}
              </div>
            </div>
          </div>
          <div
            className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{ background: '#E8ECFA' }}
          >
            <Clock size={15} color="#5B5FD9" />
            <div>
              <div style={{ fontSize: 11, color: '#6B6B6B', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Inter, sans-serif' }}>
                Time
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#231F20', fontFamily: 'Inter, sans-serif' }}>
                {m.time} · {m.duration}
              </div>
            </div>
          </div>
        </div>

        {/* Context note */}
        <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.5, fontFamily: 'Inter, sans-serif', margin: '0 0 16px' }}>
          {m.context}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          {s.actions.map((action) => {
            if ((action as any).primary) {
              return (
                <button
                  key={action.label}
                  onClick={() => onAdvance((action as any).advance)}
                  className="flex-1 py-2.5 rounded-xl font-semibold transition-opacity hover:opacity-90"
                  style={{ background: '#5B5FD9', color: '#fff', fontSize: 14, fontFamily: 'Inter, sans-serif', border: 'none', cursor: 'pointer' }}
                >
                  {action.label}
                </button>
              )
            }
            return (
              <Tooltip key={action.label} text={(action as any).tooltip}>
                <button
                  className="flex-1 py-2.5 rounded-xl font-medium"
                  style={{ background: '#fff', border: '1.5px solid #E5E5E5', color: '#231F20', fontSize: 14, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}
                >
                  {action.label}
                </button>
              </Tooltip>
            )
          })}
        </div>
      </motion.div>

    </div>
  )
}
