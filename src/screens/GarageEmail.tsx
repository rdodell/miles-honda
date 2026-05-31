// Screen 2.2 — Priya scheduling confirmation
// Miles has made the intro; Priya replied; ready to book.

import { useState } from 'react'
import { CalendarDays, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import scenario from '../scenario.json'

interface GarageEmailProps {
  onAdvance: (screen: string) => void
}

const s = scenario.screens['2.2']

const RESCHEDULE_REPLY =
  "No problem. Priya said she can also do Friday at 11 AM or Monday at 3 PM. Both still work on her end. Which one do you want me to lock in?"

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.12, duration: 0.3 },
})

export default function GarageEmail({ onAdvance }: GarageEmailProps) {
  const m = s.meetingCard
  const [suggestingAlt, setSuggestingAlt] = useState(false)
  const [milesReplied, setMilesReplied] = useState(false)

  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-20">

      <MilesMessage text={s.milesMessage} instant />

      {/* Meeting card */}
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

        {/* Actions — hidden while suggesting alt */}
        <AnimatePresence>
          {!suggestingAlt && (
            <motion.div
              className="flex gap-2"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => setSuggestingAlt(true)}
                className="flex-1 py-2.5 rounded-xl font-medium"
                style={{ background: '#fff', border: '1.5px solid #E5E5E5', color: '#231F20', fontSize: 14, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}
              >
                Suggest another time
              </button>
              <button
                onClick={() => onAdvance('2.3')}
                className="flex-1 py-2.5 rounded-xl font-semibold transition-opacity hover:opacity-90"
                style={{ background: '#5B5FD9', color: '#fff', fontSize: 14, fontFamily: 'Inter, sans-serif', border: 'none', cursor: 'pointer' }}
              >
                Book it →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Miles back-and-forth when user asks to reschedule */}
      <AnimatePresence>
        {suggestingAlt && (
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Ian's "request" bubble */}
            <div className="flex justify-end">
              <div
                className="rounded-2xl px-4 py-2.5 max-w-xs"
                style={{ background: '#5B5FD9', color: '#fff', fontSize: 14, lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}
              >
                Thursday doesn't work. Can you find another time?
              </div>
            </div>

            {/* Miles replies */}
            <MilesMessage text={RESCHEDULE_REPLY} onDone={() => setMilesReplied(true)} />

            {/* Book it button reappears after Miles replies */}
            {milesReplied && (
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => onAdvance('2.3')}
                className="w-full py-2.5 rounded-xl font-semibold transition-opacity hover:opacity-90"
                style={{ background: '#5B5FD9', color: '#fff', fontSize: 14, fontFamily: 'Inter, sans-serif', border: 'none', cursor: 'pointer' }}
              >
                Friday at 11 AM works →
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
