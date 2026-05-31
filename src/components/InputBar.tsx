import { useState, useEffect } from 'react'
import { Mic, MessageCircle, Wrench } from 'lucide-react'
import { motion } from 'framer-motion'
import Tooltip from './Tooltip'

interface InputBarProps {
  onChat: () => void
  /** Pre-populated suggestion text shown in the chat field */
  suggestion?: string
  /** Tooltip shown for disabled chat (e.g. if chat not yet active) */
  chatTooltip?: string
  /** When true, the bar appears empty first, then types the suggestion in */
  typeSuggestion?: boolean
}

// REVIEW: Voice/Sandbox remain tooltip-stubbed; activate when those modes are built.
const VOICE_TIP = "Voice mode isn't in this preview."
const SANDBOX_TIP = "Sandbox mode isn't in this preview."
const TYPE_SPEED_MS = 28

export default function InputBar({ onChat, suggestion, chatTooltip, typeSuggestion }: InputBarProps) {
  const [typed, setTyped] = useState(typeSuggestion ? '' : (suggestion ?? ''))
  const isTyping = typeSuggestion && !!suggestion && typed.length < suggestion.length

  useEffect(() => {
    if (!typeSuggestion || !suggestion) return
    let i = 0
    // brief pause so the empty bar registers before text starts
    const start = setTimeout(() => {
      const iv = setInterval(() => {
        i += 1
        setTyped(suggestion.slice(0, i))
        if (i >= suggestion.length) clearInterval(iv)
      }, TYPE_SPEED_MS)
    }, 350)
    return () => clearTimeout(start)
  }, [typeSuggestion, suggestion])

  const display = typed

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-2"
    >
      {/* Chat input row */}
      <button
        onClick={chatTooltip ? undefined : onChat}
        className={`
          w-full flex items-center gap-3 bg-white border border-[#E8E4DE] rounded-xl px-4 py-3 text-left
          ${chatTooltip ? 'opacity-60 cursor-default' : 'hover:border-[#7A1420] hover:shadow-sm transition-all cursor-pointer'}
        `}
      >
        <MessageCircle size={16} className={chatTooltip ? 'text-[#A09A94]' : 'text-[#7A1420]'} />
        <span className={`flex-1 text-sm ${display ? 'text-[#1A1A1A]' : 'text-[#A09A94]'}`}>
          {display || 'Ask Miles something…'}
          {isTyping && (
            <span className="inline-block w-0.5 h-3.5 bg-[#1A1A1A] ml-0.5 align-middle animate-pulse" />
          )}
        </span>
        {!chatTooltip && (
          <span className="text-xs text-[#7A1420] font-medium">Send</span>
        )}
      </button>

      {/* Mode strip: Voice + Sandbox */}
      <div className="flex gap-2">
        <Tooltip text={VOICE_TIP} className="flex-1 relative">
          <button className="w-full flex items-center justify-center gap-1.5 border border-[#E8E4DE] rounded-xl py-2 text-xs text-[#6B6B6B] bg-[#FAFAFA]">
            <Mic size={13} />
            Voice
          </button>
        </Tooltip>
        <Tooltip text={SANDBOX_TIP} className="flex-1 relative">
          <button className="w-full flex items-center justify-center gap-1.5 border border-[#E8E4DE] rounded-xl py-2 text-xs text-[#6B6B6B] bg-[#FAFAFA]">
            <Wrench size={13} />
            Sandbox
          </button>
        </Tooltip>
      </div>
    </motion.div>
  )
}
