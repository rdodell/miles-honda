import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import Tooltip from '../components/Tooltip'
import scenario from '../scenario.json'

interface GarageWelcomeProps { onAdvance: (screen: string) => void }

const s = scenario.screens['2.1']

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.12, duration: 0.3 },
})

type Person = {
  id: string; name: string; title: string; initial: string; color: string;
  reason?: string; advance?: string; primary?: boolean; tooltip?: string;
}
type ExistingConnection = {
  id: string; name: string; title: string; initial: string; color: string; metLabel: string;
}

export default function GarageWelcome({ onAdvance }: GarageWelcomeProps) {
  const existing = (s as any).existingConnections as ExistingConnection[]
  const [showRest, setShowRest] = useState(false)

  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-20">
      <MilesMessage text={s.milesMessage} onDone={() => setShowRest(true)} />

      <AnimatePresence>
        {showRest && (
          <motion.div
            className="flex flex-col gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
      {/* Existing network — non-empty */}
      <motion.section {...fadeUp(1)}>
        <div className="flex items-center justify-between mb-2.5">
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#231F20', fontFamily: 'Inter, sans-serif', margin: 0 }}>
            Your network
          </h2>
          <span style={{ fontSize: 13, color: '#5B5FD9', fontWeight: 600 }}>{existing.length} connections</span>
        </div>
        <div className="flex flex-col gap-2">
          {existing.map((person) => (
            <div key={person.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-[#E5E5E5]">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: person.color }}>
                {person.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div style={{ fontSize: 14, fontWeight: 600, color: '#231F20' }}>{person.name}</div>
                <div style={{ fontSize: 12, color: '#6B6B6B' }}>{person.title}</div>
              </div>
              <span style={{ fontSize: 11, color: '#A09A94', flexShrink: 0 }}>{person.metLabel}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Recommended */}
      <motion.section {...fadeUp(2)}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#231F20', fontFamily: 'Inter, sans-serif', margin: '0 0 10px' }}>
          Recommended for you
        </h2>
        <div className="flex flex-col gap-3">
          {(s.recommended as Person[]).map((person) =>
            person.primary ? (
              <div key={person.id} className="bg-white rounded-2xl p-4 shadow-sm" style={{ border: '1.5px solid #E5E5E5' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: person.color, fontSize: 16, fontWeight: 700 }}>
                    {person.initial}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#231F20' }}>{person.name}</div>
                    <div style={{ fontSize: 13, color: '#6B6B6B' }}>{person.title}</div>
                  </div>
                </div>
                <p className="rounded-xl px-3 py-2.5 mb-3" style={{ background: '#E8ECFA', fontSize: 14, color: '#231F20', lineHeight: 1.5, margin: '0 0 12px' }}>
                  💬&nbsp; {person.reason}
                </p>
                <button
                  onClick={() => onAdvance(person.advance!)}
                  className="w-full py-2.5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                  style={{ background: '#5B5FD9', color: '#fff', fontSize: 14, border: 'none', cursor: 'pointer' }}
                >
                  Connect with {person.name.split(' ')[0]}
                </button>
              </div>
            ) : (
              <Tooltip key={person.id} text={person.tooltip ?? 'Demo flow continues with Priya.'}>
                <div className="bg-white rounded-2xl p-4 opacity-70" style={{ border: '1.5px solid #E5E5E5' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: person.color }}>
                      {person.initial}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#231F20' }}>{person.name}</div>
                      <div style={{ fontSize: 12, color: '#6B6B6B' }}>{person.title}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.5, margin: 0 }}>{person.reason}</p>
                </div>
              </Tooltip>
            )
          )}
        </div>
      </motion.section>

      {/* Directory */}
      <motion.div {...fadeUp(3)}>
        <Tooltip text="The full directory isn't in this demo preview.">
          <button className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 hover:bg-[#F5F5F5] transition-colors" style={{ background: '#fff', border: '1.5px solid #E5E5E5', cursor: 'pointer' }}>
            <BookOpen size={18} color="#6B6B6B" style={{ flexShrink: 0 }} />
            <div className="text-left">
              <div style={{ fontSize: 14, fontWeight: 600, color: '#231F20' }}>The directory</div>
              <div style={{ fontSize: 13, color: '#6B6B6B', marginTop: 1 }}>{s.directoryStats}</div>
            </div>
            <span style={{ marginLeft: 'auto', color: '#6B6B6B', fontSize: 20 }}>›</span>
          </button>
        </Tooltip>
      </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
