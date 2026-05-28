import { useState, useEffect, useRef, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MilesAvatar from './MilesAvatar'

interface MilesMessageProps {
  text: string
  /** Children (cards, buttons) appear after the text finishes streaming */
  children?: ReactNode
  /** If true, skip animation and show immediately (for persisted messages) */
  instant?: boolean
  onDone?: () => void
}

const CHARS_PER_SEC = 30
const MS_PER_CHAR = 1000 / CHARS_PER_SEC

function randomThinkMs() {
  return 1200 + Math.random() * 800 // 1200–2000ms
}

type Phase = 'thinking' | 'streaming' | 'done'

export default function MilesMessage({ text, children, instant = false, onDone }: MilesMessageProps) {
  const [phase, setPhase] = useState<Phase>(instant ? 'done' : 'thinking')
  const [displayed, setDisplayed] = useState(instant ? text : '')
  const [showChildren, setShowChildren] = useState(instant)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const indexRef = useRef(0)

  useEffect(() => {
    if (instant) return

    // Phase 1: thinking dots
    const thinkTimer = setTimeout(() => {
      setPhase('streaming')
      indexRef.current = 0

      // Phase 2: stream characters
      intervalRef.current = setInterval(() => {
        indexRef.current += 1
        setDisplayed(text.slice(0, indexRef.current))

        if (indexRef.current >= text.length) {
          clearInterval(intervalRef.current!)
          setPhase('done')

          // Phase 3: reveal children 200ms after text finishes
          setTimeout(() => {
            setShowChildren(true)
            onDone?.()
          }, 200)
        }
      }, MS_PER_CHAR)
    }, randomThinkMs())

    return () => {
      clearTimeout(thinkTimer)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return (
    <div className="flex gap-3 items-start">
      <MilesAvatar />
      <div className="flex-1 min-w-0">
        {/* Thinking indicator */}
        <AnimatePresence>
          {phase === 'thinking' && (
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex gap-1 items-center h-6 mt-1"
            >
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full bg-[#A09A94] inline-block"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message text */}
        {(phase === 'streaming' || phase === 'done') && (
          <p className="text-[15px] leading-relaxed text-[#1A1A1A] mt-0.5">
            {displayed}
            {phase === 'streaming' && (
              <span className="inline-block w-0.5 h-4 bg-[#1A1A1A] ml-0.5 align-middle animate-pulse" />
            )}
          </p>
        )}

        {/* Children (cards, buttons) */}
        <AnimatePresence>
          {showChildren && children && (
            <motion.div
              key="children"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-3"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
