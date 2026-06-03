// Screen 2.4 — Garage wrap: network summary before jumping to Test Track
// Uses dream-indigo gradient (punctuation screen, not a daily-work screen)

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import MilesAvatar from '../components/MilesAvatar'
import IanInputBar from '../components/IanInputBar'
import scenario from '../scenario.json'
import { BEAT_AFTER_MILES } from '../timing'

interface GarageWrapProps {
  onAdvance: (screen: string) => void
}

const s = scenario.screens['2.4']

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.12, duration: 0.3 },
})

export default function GarageWrap({ onAdvance }: GarageWrapProps) {
  const [showInput, setShowInput] = useState(false)

  // Let the summary card settle, then a clear beat before Ian's reply types in
  useEffect(() => {
    const t = setTimeout(() => setShowInput(true), BEAT_AFTER_MILES + 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-20">

      {/* Summary card */}
      <motion.div
        {...fadeUp(0)}
        className="rounded-2xl p-5 shadow-sm"
        style={{ background: '#fff', border: '1.5px solid #E5E5E5' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <MilesAvatar />
          <h2 style={{ fontSize: 22, fontWeight: 600, color: '#231F20', fontFamily: 'Zilla Slab, Georgia, serif', margin: 0, lineHeight: 1.2 }}>
            {s.header}
          </h2>
        </div>

        <ul className="flex flex-col gap-2.5">
          {s.bullets.map((bullet, i) => (
            <motion.li key={i} {...fadeUp(i + 1)} className="flex items-start gap-2.5" style={{ listStyle: 'none' }}>
              <CheckCircle2 size={16} color="#5B5FD9" style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: 15, color: '#231F20', lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}>
                {bullet}
              </span>
            </motion.li>
          ))}
        </ul>

        <motion.p
          {...fadeUp(4)}
          style={{ fontSize: 14, color: '#6B6B6B', marginTop: 16, paddingTop: 14, borderTop: '1px solid #E5E5E5', fontFamily: 'Inter, sans-serif' }}
        >
          {s.milesFooter}
        </motion.p>
      </motion.div>

      {/* Ian sends his input line to advance to 3.1 — held a beat after the card */}
      {showInput && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <IanInputBar
            driver="chat"
            suggestion={(s as any).ianInput?.text}
            onSubmit={() => onAdvance((s as any).advance ?? '3.1')}
          />
        </motion.div>
      )}

    </div>
  )
}
