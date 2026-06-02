import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flag, PencilLine } from 'lucide-react'
import MilesMessage from '../components/MilesMessage'
import IanInputBar from '../components/IanInputBar'
import scenario from '../scenario.json'
import ianSketch from '../assets/ian-sketch-lawnmower.png'

interface Props { onAdvance: (screen: string) => void }
const s = scenario.screens['1.3']
const sketch = (s as any).sketchToForm as {
  milesStructuringLine: string
  fieldSources: { q: string; from: string; note: string }[]
  milesClosingLine: string
}
const ianInput = (s as any).ianInput as { driver: string; text: string; asset: string }
const milesOpeningPrompt = (s as any).milesOpeningPrompt as string

const ANSWER_SPEED_MS = 22 // ms per character — feels like Ian typing

// Phase ordering — Miles asks, Ian answers with his sketch, Miles structures from it
const ORDER = ['prompt', 'sketch', 'structuring', 'questions', 'typing', 'closing', 'done'] as const
type Phase = (typeof ORDER)[number]

// Short source label per field, keyed by question text
const SOURCE_LABEL: Record<string, string | null> = { sketch: 'from your sketch', priorChat: 'from earlier chat', blank: null }
const fieldSourceFor = (q: string) => sketch?.fieldSources.find((f) => f.q === q)?.from ?? null

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
})

export default function FrameProblem({ onAdvance }: Props) {
  const [phase, setPhase] = useState<Phase>('prompt')
  const [visibleCount, setVisibleCount] = useState(0)
  const [typedAnswers, setTypedAnswers] = useState<string[]>(s.questions.map(() => ''))
  const [activeTypingIdx, setActiveTypingIdx] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const charRef = useRef(0)
  const inputBarRef = useRef<HTMLDivElement>(null)

  const reached = (p: Phase) => ORDER.indexOf(phase) >= ORDER.indexOf(p)

  // The screen is tall, so the input bar lands below the fold. Bring it into view
  // when it appears so Ian's reply is seen typing in, not already filled.
  useEffect(() => {
    if (phase !== 'done') return
    const t = setTimeout(() => inputBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 60)
    return () => clearTimeout(t)
  }, [phase])

  // Beat after the sketch lands, then Miles starts structuring it
  useEffect(() => {
    if (phase !== 'sketch') return
    const t = setTimeout(() => setPhase('structuring'), 750)
    return () => clearTimeout(t)
  }, [phase])

  // Question rows appear one by one
  useEffect(() => {
    if (phase !== 'questions') return
    if (visibleCount >= s.questions.length) {
      const t = setTimeout(() => setPhase('typing'), 400)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setVisibleCount((v) => v + 1), 160)
    return () => clearTimeout(t)
  }, [phase, visibleCount])

  // Animate Ian's answers typing in sequentially
  useEffect(() => {
    if (phase !== 'typing') return

    const filledQuestions = s.questions.filter((q) => q.filled && q.a)
    if (activeTypingIdx >= filledQuestions.length) {
      setPhase('closing')
      return
    }

    const realIdx = s.questions.findIndex(
      (q, i) => q.filled && q.a && s.questions.slice(0, i + 1).filter((x) => x.filled && x.a).length === activeTypingIdx + 1
    )
    const target = s.questions[realIdx]?.a ?? ''
    charRef.current = 0

    intervalRef.current = setInterval(() => {
      charRef.current += 1
      setTypedAnswers((prev) => {
        const next = [...prev]
        next[realIdx] = target.slice(0, charRef.current)
        return next
      })
      if (charRef.current >= target.length) {
        clearInterval(intervalRef.current!)
        setTimeout(() => setActiveTypingIdx((i) => i + 1), 300)
      }
    }, ANSWER_SPEED_MS)

    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [phase, activeTypingIdx])

  return (
    <div className="flex flex-col gap-5 px-5 pt-8 pb-20 px-5">
      {/* Stage chip */}
      <motion.div {...fadeUp(0)}>
        <span style={{
          background: 'rgba(244,185,66,0.15)',
          border: '1px solid #F4B942',
          color: '#B8851E',
          fontFamily: 'Zilla Slab, Georgia, serif',
          fontSize: 13,
          padding: '2px 10px',
          borderRadius: 99,
          display: 'inline-block',
        }}>{s.step}</span>
      </motion.div>

      {/* Miles opens by asking Ian what he's envisioning */}
      {reached('prompt') && milesOpeningPrompt && (
        <MilesMessage
          text={milesOpeningPrompt}
          onDone={() => setPhase((p) => (p === 'prompt' ? 'sketch' : p))}
        />
      )}

      {/* Ian's scratch-pad reply: the hand-drawn sketch */}
      <AnimatePresence>
        {reached('sketch') && (
          <motion.div
            className="flex flex-col items-end gap-1.5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-[#A09A94]">
              <PencilLine size={12} />
              Ian · Sandbox
            </div>
            <motion.div
              className="bg-white rounded-2xl shadow-sm border border-[#E8E4DE] overflow-hidden"
              style={{ maxWidth: '72%' }}
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              animate={{ clipPath: 'inset(0 0 0% 0)' }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
            >
              <img
                src={ianSketch}
                alt="Ian's hand-drawn sketch: solo landscaper with a loud, fume-spewing gas mower; 40 lawns/week; 2026 regs coming; crossed-out price and battery guesses."
                style={{ width: '100%', maxHeight: 260, objectFit: 'cover', objectPosition: 'top', display: 'block' }}
              />
            </motion.div>
            <motion.p
              className="text-sm text-[#1A1A1A] text-right"
              style={{ maxWidth: '72%' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.25 }}
            >
              {ianInput.text}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Miles reacts to the sketch — single turn before the form */}
      {reached('structuring') && (
        <MilesMessage
          text={s.milesIntro}
          onDone={() => setPhase((p) => (p === 'structuring' ? 'questions' : p))}
        />
      )}

      {/* Question rows appear after Miles structures them */}
      <AnimatePresence>
        {reached('questions') && (
          <motion.div className="flex flex-col gap-3">
            {s.questions.map((q, i) => {
              if (i >= visibleCount) return null
              const answer = typedAnswers[i]
              const isCurrent = phase === 'typing' && answer.length < (q.a?.length ?? 0) && answer.length > 0
              const src = fieldSourceFor(q.q)
              const srcLabel = src ? SOURCE_LABEL[src] : null
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`bg-white rounded-xl px-4 py-3 shadow-sm ${
                    q.filled && answer ? 'border border-[#E8E4DE]' : 'border border-dashed border-[#E8E4DE]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-[#A09A94]">{q.q}</div>
                    {srcLabel && (
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap"
                        style={
                          src === 'sketch'
                            ? { background: 'rgba(244,185,66,0.18)', color: '#B8851E' }
                            : { background: '#F2EEE8', color: '#A09A94' }
                        }
                      >
                        {srcLabel}
                      </span>
                    )}
                  </div>
                  {answer ? (
                    <div className="text-sm text-[#1A1A1A]">
                      {answer}
                      {isCurrent && (
                        <span className="inline-block w-0.5 h-3.5 bg-[#1A1A1A] ml-0.5 align-middle animate-pulse" />
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-[#A09A94] italic">{(q as any).hint ?? ''}</div>
                  )}
                  {'flag' in q && q.flag && answer && (
                    <div className="flex items-center gap-1 mt-1.5 text-[#CC0000]">
                      <Flag size={12} />
                      <span className="text-xs">← {q.flag}</span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Miles' closing read on the gaps */}
      {reached('closing') && (
        <MilesMessage
          text={sketch.milesClosingLine}
          onDone={() => setPhase((p) => (p === 'closing' ? 'done' : p))}
        />
      )}

      {/* Footer + IanInputBar */}
      {reached('done') && (
        <motion.div
          ref={inputBarRef}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 mt-1"
        >
          <span className="text-sm">
            {s.counter.includes('flag') ? (
              <>
                <span className="text-[#A09A94]">{s.counter.split(' · ')[0]} · </span>
                <span className="text-[#CC0000] font-medium">{s.counter.split(' · ')[1]}</span>
              </>
            ) : (
              <span className="text-[#A09A94]">{s.counter}</span>
            )}
          </span>
          <IanInputBar
            driver="chat"
            suggestion={(s as any).ianTestReply}
            onSubmit={() => onAdvance(s.cta.advance)}
          />
        </motion.div>
      )}
    </div>
  )
}
