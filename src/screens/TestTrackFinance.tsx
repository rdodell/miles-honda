import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import MilesMessage from '../components/MilesMessage'
import IanInputBar from '../components/IanInputBar'
import scenario from '../scenario.json'
import { BEAT_AFTER_MILES, BEAT_BEFORE_ADVANCE } from '../timing'

interface Props { onAdvance: (screen: string) => void }

const s = scenario.screens['3.2']
const ianInput = (s as any).ianInput as { text: string }
const ianClose = (s as any).ianClose as { text: string }
const CONTENT_BEAT = 1400

// Full readiness check (no branch): Miles proposes -> Ian sends -> scorecard -> Miles line ->
// board questions -> Miles close (resolves) -> Ian sends close -> advance to recap
const PHASES = ['propose', 'ian-input', 'scorecard', 'scoreline', 'questions', 'close', 'ian-close', 'done'] as const
type Phase = (typeof PHASES)[number]

function IanBubble({ text }: { text: string }) {
  return (
    <motion.div className="flex justify-end" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ background: 'var(--ink)', color: '#fff', borderRadius: '14px 14px 4px 14px', padding: '10px 14px', fontSize: 14, fontFamily: 'var(--font-cp-sans)', maxWidth: '80%', lineHeight: 1.5, boxShadow: 'var(--shadow-1)' }}>
        {text}
      </div>
    </motion.div>
  )
}

function BoardCard({ q, index, delay }: { q: (typeof s.boardQuestions)[number]; index: number; delay: number }) {
  const [expanded, setExpanded] = useState(true)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="bg-white border border-[#E8E4DE] rounded-2xl p-4 shadow-sm"
    >
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-start justify-between gap-2 text-left">
        <div className="flex items-start gap-2.5">
          <span className="w-6 h-6 rounded-full bg-[#9575CD]/10 text-[#9575CD] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{index + 1}</span>
          <span className="font-semibold text-sm text-[#1A1A1A] leading-snug">{q.header}</span>
        </div>
        {expanded ? <ChevronUp size={16} className="text-[#A09A94] flex-shrink-0 mt-0.5" /> : <ChevronDown size={16} className="text-[#A09A94] flex-shrink-0 mt-0.5" />}
      </button>
      {expanded && (
        <div className="mt-3 space-y-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-[#7A1420] mb-1">The challenge</div>
            <p className="text-xs text-[#6B6570] leading-relaxed">{q.challenge}</p>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wide text-[#7CB342] mb-1">How Ian answers</div>
            <p className="text-xs text-[#1A1A1A] leading-relaxed">{q.response}</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default function TestTrackFinance({ onAdvance }: Props) {
  const [phase, setPhase] = useState<Phase>('propose')
  const reached = (p: Phase) => PHASES.indexOf(phase) >= PHASES.indexOf(p)

  // Content-view beats: pause on the scorecard and the board questions
  useEffect(() => {
    if (phase === 'scorecard') { const t = setTimeout(() => setPhase('scoreline'), CONTENT_BEAT); return () => clearTimeout(t) }
    if (phase === 'questions') { const t = setTimeout(() => setPhase('close'), CONTENT_BEAT + s.boardQuestions.length * 200); return () => clearTimeout(t) }
  }, [phase])

  const activeIan =
    phase === 'ian-input' ? ianInput.text : phase === 'ian-close' ? ianClose.text : undefined

  function sendIan() {
    if (phase === 'ian-input') setPhase('scorecard')
    else if (phase === 'ian-close') { setPhase('done'); setTimeout(() => onAdvance(s.advance), BEAT_BEFORE_ADVANCE) }
  }

  return (
    <div className="flex flex-col gap-4 px-5 py-5 pb-20">
      {/* Miles proposes the readiness check */}
      <MilesMessage text={s.milesMessage} onDone={() => setTimeout(() => setPhase('ian-input'), BEAT_AFTER_MILES)} />

      {/* Ian agrees to run it (sent) */}
      {reached('scorecard') && <IanBubble text={ianInput.text} />}

      {/* Scorecard */}
      {reached('scorecard') && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-[#E8E4DE] rounded-2xl p-4 shadow-sm">
          <div className="space-y-3">
            {s.scorecard.map((row, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-start gap-3">
                {row.status === 'pass'
                  ? <CheckCircle2 size={18} className="text-[#7CB342] flex-shrink-0 mt-0.5" />
                  : <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />}
                <div>
                  <div className="text-sm font-medium text-[#1A1A1A]">{row.label}</div>
                  <div className="text-xs text-[#A09A94]">{row.detail}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Miles reads the scorecard, sets up the board questions */}
      {reached('scoreline') && (
        <MilesMessage text={s.milesScorecardLine} onDone={() => setTimeout(() => setPhase('questions'), BEAT_AFTER_MILES)} />
      )}

      {/* What the board will push on */}
      {reached('questions') && (
        <>
          {s.boardQuestions.map((q, i) => (
            <BoardCard key={q.id} q={q} index={i} delay={i * 0.15} />
          ))}
        </>
      )}

      {/* Miles resolves every flag — "you're ready for the venture board review" */}
      {reached('close') && (
        <MilesMessage text={s.milesClose} onDone={() => setTimeout(() => setPhase('ian-close'), BEAT_AFTER_MILES)} />
      )}

      {/* Ian's closing line (sent) before advancing to the recap */}
      {reached('done') && <IanBubble text={ianClose.text} />}

      {/* Input bar — Ian sends his lines (run them at me; then let's go to the board) */}
      {reached('ian-input') && (
        <IanInputBar
          driver="chat"
          placeholder="Ask Miles something…"
          suggestion={activeIan}
          onSubmit={activeIan ? sendIan : () => {}}
        />
      )}
    </div>
  )
}
