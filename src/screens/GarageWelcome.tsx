import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import IanInputBar from '../components/IanInputBar'
import BranchPicker from '../components/BranchPicker'
import type { BranchOption } from '../components/BranchPicker'
import Tooltip from '../components/Tooltip'
import scenario from '../scenario.json'
import priyaAvatar from '../assets/priya-avatar.png'
import karenAvatar  from '../assets/karen-avatar.svg'
import danielAvatar from '../assets/daniel-avatar.svg'

interface GarageWelcomeProps { onAdvance: (screen: string) => void; showTooltip?: (msg: string) => void }

const s = scenario.screens['2.1']

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.12, duration: 0.3 },
})

export default function GarageWelcome({ onAdvance, showTooltip }: GarageWelcomeProps) {
  const [showRest, setShowRest] = useState(false)

  function handleShowTooltip(msg: string) {
    showTooltip?.(msg)
  }

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
            {/* Recommended contacts via BranchPicker */}
            <motion.section {...fadeUp(1)}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#231F20', fontFamily: 'Inter, sans-serif', margin: '0 0 10px' }}>
                Recommended for you
              </h2>
              <BranchPicker
                branch={s.branch as any}
                onAdvance={onAdvance}
                showTooltip={handleShowTooltip}
                renderOption={(opt, isSelected, isRec) => (
                  <ContactCard opt={opt} isSelected={isSelected} isRec={isRec} />
                )}
              />
            </motion.section>

            {/* Directory */}
            <motion.div {...fadeUp(2)}>
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

            {/* IanInputBar */}
            <IanInputBar
              driver="chat"
              placeholder="Ask Miles, or pick an option above"
              onSubmit={() => {}}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Contact card renderer for BranchPicker
function ContactCard({ opt, isSelected, isRec }: { opt: BranchOption; isSelected: boolean; isRec: boolean }) {
  // Find the matching person data from s.recommended
  const person = (s.recommended as Array<{
    id: string; name: string; title: string; initial: string; color: string; reason?: string
  }>).find((p) => p.id === opt.id)

  if (!person) return null

  if (isRec) {
    return (
      <div
        className="bg-white rounded-2xl p-4 shadow-sm"
        style={{
          border: `1.5px solid ${isSelected ? '#5B5FD9' : '#E5E5E5'}`,
          transition: 'border-color 0.15s',
          cursor: 'pointer',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          {person.id === 'priya'
            ? <img src={priyaAvatar}  alt={person.name} className="w-11 h-11 rounded-full flex-shrink-0 object-cover" />
            : person.id === 'karen'
              ? <img src={karenAvatar}  alt={person.name} className="w-11 h-11 rounded-full flex-shrink-0 object-cover" />
              : person.id === 'daniel'
                ? <img src={danielAvatar} alt={person.name} className="w-11 h-11 rounded-full flex-shrink-0 object-cover" />
                : <div className="w-11 h-11 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: person.color, fontSize: 16, fontWeight: 700 }}>{person.initial}</div>
          }
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#231F20' }}>{person.name}</div>
            <div style={{ fontSize: 13, color: '#6B6B6B' }}>{person.title}</div>
          </div>
          <span style={{
            marginLeft: 'auto', fontSize: 11, fontWeight: 600,
            background: 'rgba(91,95,217,0.12)', color: '#5B5FD9',
            borderRadius: 99, padding: '2px 8px', flexShrink: 0,
          }}>
            Recommended
          </span>
        </div>
        {person.reason && (
          <p className="rounded-xl px-3 py-2.5" style={{ background: '#E8ECFA', fontSize: 14, color: '#231F20', lineHeight: 1.5, margin: '0 0 0' }}>
            💬&nbsp; {person.reason}
          </p>
        )}
      </div>
    )
  }

  return (
    <div
      className="bg-white rounded-2xl p-4 opacity-75"
      style={{ border: '1.5px solid #E5E5E5', cursor: 'pointer', transition: 'opacity 0.15s' }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: person.color }}>
          {person.initial}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#231F20' }}>{person.name}</div>
          <div style={{ fontSize: 12, color: '#6B6B6B' }}>{person.title}</div>
        </div>
      </div>
      {person.reason && (
        <p style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.5, margin: 0 }}>{person.reason}</p>
      )}
    </div>
  )
}
