import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import IanInputBar from '../components/IanInputBar'
import BranchPicker from '../components/BranchPicker'
import type { BranchOption } from '../components/BranchPicker'
import scenario from '../scenario.json'
import { BEAT_AFTER_MILES } from '../timing'
import priyaAvatar from '../assets/priya-avatar.png'
import karenAvatar  from '../assets/karen-avatar.svg'
import danielAvatar from '../assets/daniel-avatar.svg'

interface GarageWelcomeProps { onAdvance: (screen: string) => void; showTooltip?: (msg: string) => void }

const s = scenario.screens['2.1']
const ianInput = (s as any).ianInput as { text: string }

// Sequence: Miles asks -> Ian states his pricing goal -> Miles surfaces contacts -> contacts appear
const PHASES = ['miles-open', 'ian-input', 'ian-sent', 'miles-contacts', 'contacts'] as const
type Phase = (typeof PHASES)[number]

export default function GarageWelcome({ onAdvance, showTooltip }: GarageWelcomeProps) {
  const [phase, setPhase] = useState<Phase>('miles-open')
  const reached = (p: Phase) => PHASES.indexOf(phase) >= PHASES.indexOf(p)

  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-20">
      {/* Miles asks what's next (interviews are done) */}
      <MilesMessage
        text={s.milesMessage}
        onDone={() => setTimeout(() => setPhase('ian-input'), BEAT_AFTER_MILES)}
      />

      {/* Ian states his pricing goal as a sent message */}
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

      {/* Only now does Miles surface the contacts */}
      {reached('miles-contacts') && (
        <MilesMessage
          text={(s as any).milesContactsIntro}
          onDone={() => setTimeout(() => setPhase('contacts'), BEAT_AFTER_MILES)}
        />
      )}

      {/* Contacts + pick-and-respond branch (Daniel -> pushback -> Priya) */}
      <AnimatePresence>
        {reached('contacts') && (
          <motion.section initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: '#231F20', fontFamily: 'Inter, sans-serif', margin: '0 0 10px' }}>
              Recommended for you
            </h2>
            <BranchPicker
              branch={s.branch as any}
              onAdvance={onAdvance}
              showTooltip={showTooltip}
              renderOption={(opt, isSelected, isRec) => (
                <ContactCard opt={opt} isSelected={isSelected} isRec={isRec} />
              )}
            />
          </motion.section>
        )}
      </AnimatePresence>

      {/* Persistent input bar — drives Ian's pricing send; the branch owns the bar once contacts show */}
      {phase !== 'contacts' && (
        <IanInputBar
          driver="chat"
          placeholder="Ask Miles, or pick an option above"
          suggestion={phase === 'ian-input' ? ianInput.text : undefined}
          onSubmit={phase === 'ian-input'
            ? () => { setPhase('ian-sent'); setTimeout(() => setPhase('miles-contacts'), BEAT_AFTER_MILES) }
            : () => {}}
        />
      )}
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
        {person.id === 'daniel'
          ? <img src={danielAvatar} alt={person.name} className="w-9 h-9 rounded-full flex-shrink-0 object-cover" />
          : person.id === 'karen'
            ? <img src={karenAvatar} alt={person.name} className="w-9 h-9 rounded-full flex-shrink-0 object-cover" />
            : person.id === 'priya'
              ? <img src={priyaAvatar} alt={person.name} className="w-9 h-9 rounded-full flex-shrink-0 object-cover" />
              : <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: person.color }}>{person.initial}</div>
        }
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
