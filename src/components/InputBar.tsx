import { Mic, MessageCircle, Wrench } from 'lucide-react'
import { motion } from 'framer-motion'
import Tooltip from './Tooltip'

interface InputBarProps {
  onChat: () => void
  /** Pre-populated suggestion text shown in the chat field */
  suggestion?: string
  /** Tooltip shown for disabled chat (e.g. if chat not yet active) */
  chatTooltip?: string
}

// REVIEW: Voice/Sandbox remain tooltip-stubbed; activate when those modes are built.
const VOICE_TIP = "Voice mode isn't in this preview."
const SANDBOX_TIP = "Sandbox mode isn't in this preview."

export default function InputBar({ onChat, suggestion, chatTooltip }: InputBarProps) {
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
        <span className={`flex-1 text-sm ${suggestion ? 'text-[#1A1A1A]' : 'text-[#A09A94]'}`}>
          {suggestion ?? 'Ask Miles something…'}
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
