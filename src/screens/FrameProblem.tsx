import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flag } from 'lucide-react'
import MilesMessage from '../components/MilesMessage'
import scenario from '../scenario.json'

interface Props { onAdvance: (screen: string) => void }
const s = scenario.screens['1.3']

const ANSWER_SPEED_MS = 22 // ms per character — feels like Ian typing

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
})

export default function FrameProblem({ onAdvance }: Props) {
  // Phase: 'waiting' → Miles talks, 'questions' → rows appear, 'typing' → answers fill in, 'done'
  const [phase, setPhase] = useState<'waiting' | 'questions' | 'typing' | 'done'>('waiting')
  const [visibleCount, setVisibleCount] = useState(0)
  const [typedAnswers, setTypedAnswers] = useState<string[]>(s.questions.map(() => ''))
  const [activeTypingIdx, setActiveTypingIdx] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const charRef = useRef(0)

  // After Miles finishes, show questions one by one
  function onMilesDone() {
    setPhase('questions')
  }

  useEffect(() => {
    if (phase !== 'questions') return
    if (visibleCount >= s.questions.length) {
      // All rows visible — start typing
      setTimeout(() => setPhase('typing'), 400)
      return
    }
    const t = setTimeout(() => setVisibleCount((v) => v + 1), 160)
    return () => clearTimeout(t)
  }, [phase, visibleCount])

  // Animate Ian typing answers sequentially
  useEffect(() => {
    if (phase !== 'typing') return

    const filledQuestions = s.questions.filter((q) => q.filled && q.a)
    if (activeTypingIdx >= filledQuestions.length) {
      setPhase('done')
      return
    }

    // Find real index of this filled question
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

  const showCta = phase === 'done'

  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-20">
      {/* Stage chip */}
      <motion.div {...fadeUp(0)}>
        <span style={{
          background: 'rgba(244,185,66,0.15)',
          border: '1px solid #F4B942',
          color: '#B8851E',
          fontFamily: 'Caveat, cursive',
          fontSize: 13,
          padding: '2px 10px',
          borderRadius: 99,
          display: 'inline-block',
        }}>{s.step}</span>
      </motion.div>

      {/* Miles intro — speaks first */}
      <MilesMessage text={s.milesIntro} onDone={onMilesDone} />

      {/* Question rows appear after Miles finishes */}
      <AnimatePresence>
        {(phase === 'questions' || phase === 'typing' || phase === 'done') && (
          <motion.div className="flex flex-col gap-3">
            {s.questions.map((q, i) => {
              if (i >= visibleCount) return null
              const answer = typedAnswers[i]
              const isCurrent = phase === 'typing' && answer.length < (q.a?.length ?? 0) && answer.length > 0
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
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-[#A09A94] mb-0.5">{q.q}</div>
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

      {/* Footer + CTA */}
      {showCta && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mt-1"
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
          <button
            onClick={() => onAdvance(s.cta.advance)}
            className="bg-[#7A1420] text-white font-semibold py-2.5 px-5 rounded-xl hover:bg-[#5C0F18] transition-colors shadow-sm text-sm"
          >
            {s.cta.label}
          </button>
        </motion.div>
      )}
    </div>
  )
}
