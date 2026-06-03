// Screen 2.2 — Priya scheduling confirmation
// Miles has made the intro; Priya replied; ready to book.

import { useState, useEffect } from 'react'
import { CalendarDays, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import IanInputBar from '../components/IanInputBar'
import scenario from '../scenario.json'
import { BEAT_AFTER_MILES, BEAT_AFTER_CONTENT } from '../timing'

interface GarageEmailProps {
  onAdvance: (screen: string) => void
}

const s = scenario.screens['2.2']
const ianInput = (s as any).ianInput as { driver: string; text: string }

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.12, duration: 0.3 },
})

export default function GarageEmail({ onAdvance }: GarageEmailProps) {
  const m = s.meetingCard
  const [showRest, setShowRest] = useState(false)
  const [showInput, setShowInput] = useState(false)

  // Hold a beat after the meeting card lands before Ian's reply types in
  useEffect(() => {
    if (!showRest) return
    const t = setTimeout(() => setShowInput(true), BEAT_AFTER_CONTENT)
    return () => clearTimeout(t)
  }, [showRest])

  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-20">

      <MilesMessage text={s.milesMessage} onDone={() => setTimeout(() => setShowRest(true), BEAT_AFTER_MILES)} />

      {/* Meeting card */}
      {showRest && (
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
        <div className="flex gap-3">
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
        <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.5, fontFamily: 'Inter, sans-serif', margin: '16px 0 0' }}>
          {m.context}
        </p>
      </motion.div>
      )}

      {/* Ian types his reply to advance — held a beat after the card */}
      {showInput && (
        <motion.div {...fadeUp(0)}>
          <IanInputBar
            driver="chat"
            suggestion={ianInput.text}
            onSubmit={() => onAdvance('2.3')}
          />
        </motion.div>
      )}

    </div>
  )
}
