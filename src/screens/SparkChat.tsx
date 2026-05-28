import { useState } from 'react'
import { motion } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import IanTyping from '../components/IanTyping'
import Tooltip from '../components/Tooltip'
import scenario from '../scenario.json'

interface SparkChatProps {
  onAdvance: (screen: string) => void
  showTooltip: (msg: string) => void
}

const s = scenario.screens['1.2']

interface Persona {
  id: string
  name: string
  role: string
  bio: string
  pain: string
  tam: string
  advance?: string
  primary?: boolean
  tooltip?: string
}

function PersonaCard({ persona, onAdvance, showTooltip }: { persona: Persona; onAdvance: (s: string) => void; showTooltip: (m: string) => void }) {
  const isLaura = persona.id === 'laura'
  return (
    <button
      onClick={() => isLaura ? onAdvance(persona.advance!) : showTooltip(persona.tooltip!)}
      className={`
        flex-1 min-w-[130px] text-left rounded-2xl p-3.5 border transition-all
        ${isLaura
          ? 'border-[#CC0000] bg-white shadow-sm hover:shadow-md ring-1 ring-[#CC0000]/20'
          : 'border-[#E8E4DE] bg-white hover:bg-[#F2EEE8] opacity-75'
        }
      `}
    >
      {/* Avatar placeholder */}
      <div className={`w-8 h-8 rounded-full mb-2 flex items-center justify-center text-white text-sm font-bold ${isLaura ? 'bg-[#CC0000]' : 'bg-[#A09A94]'}`}>
        {persona.name[0]}
      </div>
      <div className="font-semibold text-sm text-[#1A1A1A]">{persona.name}</div>
      <div className="text-xs text-[#A09A94] mt-0.5 leading-tight">{persona.role}</div>
      <div className="text-xs text-[#6B6570] mt-1.5 leading-tight">{persona.pain}</div>
      <div className={`mt-2 text-[10px] font-semibold rounded-full px-2 py-0.5 inline-block ${isLaura ? 'bg-red-50 text-[#CC0000]' : 'bg-[#F2EEE8] text-[#A09A94]'}`}>
        {persona.tam}
      </div>
    </button>
  )
}

export default function SparkChat({ onAdvance, showTooltip }: SparkChatProps) {
  const [ianSent, setIanSent] = useState(false)

  return (
    <div className="flex flex-col gap-4 px-5 py-5 pb-20">
      {/* Prior Miles message (persisted) */}
      <MilesMessage text="Hi Ian. Here's an update on Project X." instant />

      {/* Ian typing */}
      <IanTyping message={s.ianMessage} onSent={() => setIanSent(true)} />

      {/* Miles response — waits for Ian to send */}
      {ianSent && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <MilesMessage text={s.milesResponse}>
            {/* Persona cards */}
            <div className="flex gap-2 mt-2 flex-wrap">
              {(s.personas as Persona[]).map((p) => (
                <PersonaCard key={p.id} persona={p} onAdvance={onAdvance} showTooltip={showTooltip} />
              ))}
            </div>
          </MilesMessage>
        </motion.div>
      )}

      {/* Input bar (disabled) */}
      <Tooltip text={s.inputBarTooltip}>
        <div className="mt-2 flex items-center gap-2 bg-white border border-[#E8E4DE] rounded-xl px-4 py-3">
          <span className="flex-1 text-sm text-[#C4BFB8]">Ask Miles something...</span>
        </div>
      </Tooltip>
    </div>
  )
}
