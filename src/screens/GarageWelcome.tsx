import { Users, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import Tooltip from '../components/Tooltip'
import scenario from '../scenario.json'

interface GarageWelcomeProps {
  onAdvance: (screen: string) => void
}

const s = scenario.screens['2.1']

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.12, duration: 0.3 },
})

export default function GarageWelcome({ onAdvance }: GarageWelcomeProps) {
  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-20">

      {/* Miles greeting */}
      <MilesMessage text={s.milesMessage} instant />

      {/* ── Your network (empty state) ── */}
      <motion.section {...fadeUp(1)}>
        <div className="flex items-center justify-between mb-2.5">
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#231F20', fontFamily: 'Inter, sans-serif', margin: 0 }}>
            Your network
          </h2>
          <span style={{ fontSize: 13, color: '#6B6B6B', fontWeight: 500 }}>0 connections</span>
        </div>

        {/* Empty state shell */}
        <div
          className="flex flex-col items-center justify-center gap-2.5 rounded-2xl py-8"
          style={{ border: '1.5px dashed #E5E5E5', background: '#FAFAFA' }}
        >
          <div className="flex gap-2">
            {[0.4, 0.55, 0.7].map((op, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: '#E5E5E5', opacity: op }}
              >
                <Users size={16} color="#aaa" />
              </div>
            ))}
          </div>
          <p style={{ fontSize: 14, color: '#6B6B6B', fontFamily: 'Inter, sans-serif', margin: 0 }}>
            {s.emptyNetworkMsg}
          </p>
        </div>
      </motion.section>

      {/* ── Recommended for you ── */}
      <motion.section {...fadeUp(2)}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#231F20', fontFamily: 'Inter, sans-serif', margin: '0 0 10px' }}>
          Recommended for you
        </h2>

        {s.recommended.map((person) => (
          <div
            key={person.id}
            className="bg-white rounded-2xl p-4 shadow-sm"
            style={{ border: '1.5px solid #E5E5E5' }}
          >
            {/* Person header */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white flex-shrink-0"
                style={{ background: person.color, fontSize: 16, fontWeight: 700 }}
              >
                {person.initial}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#231F20', fontFamily: 'Inter, sans-serif' }}>
                  {person.name}
                </div>
                <div style={{ fontSize: 13, color: '#6B6B6B', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
                  {person.title}
                </div>
              </div>
            </div>

            {/* Miles reasoning — sky-wash pill */}
            <p
              className="rounded-xl px-3 py-2.5 mb-3"
              style={{ background: '#E8ECFA', fontSize: 14, color: '#231F20', fontFamily: 'Inter, sans-serif', lineHeight: 1.5, margin: '0 0 12px' }}
            >
              💬&nbsp; {person.reason}
            </p>

            {/* Primary CTA */}
            <button
              onClick={() => onAdvance(person.advance)}
              className="w-full py-2.5 rounded-xl font-semibold transition-opacity hover:opacity-90"
              style={{ background: '#5B5FD9', color: '#fff', fontSize: 14, fontFamily: 'Inter, sans-serif', border: 'none', cursor: 'pointer' }}
            >
              Connect with {person.name.split(' ')[0]} →
            </button>
          </div>
        ))}
      </motion.section>

      {/* ── The directory ── */}
      <motion.div {...fadeUp(3)}>
        <Tooltip text="The full directory isn't in this demo preview.">
          <button
            className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 hover:bg-[#F5F5F5] transition-colors"
            style={{ background: '#fff', border: '1.5px solid #E5E5E5', cursor: 'pointer' }}
          >
            <BookOpen size={18} color="#6B6B6B" style={{ flexShrink: 0 }} />
            <div className="text-left">
              <div style={{ fontSize: 14, fontWeight: 600, color: '#231F20', fontFamily: 'Inter, sans-serif' }}>
                The directory
              </div>
              <div style={{ fontSize: 13, color: '#6B6B6B', fontFamily: 'Inter, sans-serif', marginTop: 1 }}>
                {s.directoryStats}
              </div>
            </div>
            <span style={{ marginLeft: 'auto', color: '#6B6B6B', fontSize: 20, lineHeight: 1 }}>›</span>
          </button>
        </Tooltip>
      </motion.div>

    </div>
  )
}
