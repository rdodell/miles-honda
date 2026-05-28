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
    // Small delay before typing starts so user can see the input
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
    }, 300)

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2 bg-white border border-[#E8E4DE] rounded-xl px-4 py-3 shadow-sm"
          >
            <span className="flex-1 text-[15px] text-[#1A1A1A]">
              {inputText}
              <span className="inline-block w-0.5 h-4 bg-[#1A1A1A] ml-0.5 align-middle animate-pulse" />
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
            <div className="bg-[#1A1A1A] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-[15px] max-w-[80%]">
              {message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
