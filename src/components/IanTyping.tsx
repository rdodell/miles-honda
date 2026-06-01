import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface IanTypingProps {
  message: string
  onSent: () => void
}

const CHARS_PER_SEC = 15
const MS_PER_CHAR = 1000 / CHARS_PER_SEC

export default function IanTyping({ message, onSent }: IanTypingProps) {
  const [inputText, setInputText] = useState('')
  const [phase, setPhase] = useState<'typing' | 'sent'>('typing')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const indexRef = useRef(0)

  useEffect(() => {
    // Pause so user can read Miles' message before Ian responds
    const startDelay = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        indexRef.current += 1
        setInputText(message.slice(0, indexRef.current))

        if (indexRef.current >= message.length) {
          clearInterval(intervalRef.current!)

          // Pause after typing finishes, then "send"
          setTimeout(() => {
            setPhase('sent')
            onSent()
          }, 400)
        }
      }, MS_PER_CHAR)
    }, 2000)

    return () => {
      clearTimeout(startDelay)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mt-4">
      {/* Input bar (visible while typing) */}
      <AnimatePresence>
        {phase === 'typing' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: '#fff', border: '1.5px solid var(--border)',
              borderRadius: 12, padding: '11px 14px',
              boxShadow: 'var(--shadow-1)',
            }}
          >
            <span style={{ flex: 1, fontFamily: 'var(--font-cp-sans)', fontSize: 14, color: 'var(--ink)' }}>
              {inputText}
              <span style={{ display: 'inline-block', width: 2, height: 14, background: 'var(--ink)', marginLeft: 2, verticalAlign: 'middle' }} className="animate-pulse" />
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sent bubble (Ian's message in thread) */}
      <AnimatePresence>
        {phase === 'sent' && (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <div style={{
              background: 'var(--ink)', color: '#fff',
              borderRadius: '14px 14px 4px 14px',
              padding: '10px 14px', fontSize: 14,
              fontFamily: 'var(--font-cp-sans)',
              maxWidth: '80%', lineHeight: 1.5,
              boxShadow: 'var(--shadow-1)',
            }}>
              {message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
