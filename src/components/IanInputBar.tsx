import { useState } from 'react'
import { MessageCircle, Mic, PencilLine } from 'lucide-react'
import { motion } from 'framer-motion'

export interface IanInputBarProps {
  driver: 'chat' | 'voice' | 'scratchpad'
  suggestion?: string
  placeholder?: string
  onSubmit: () => void
  disabled?: boolean
}

const TABS = [
  { id: 'chat' as const, label: 'Chat', Icon: MessageCircle },
  { id: 'voice' as const, label: 'Voice', Icon: Mic },
  { id: 'scratchpad' as const, label: 'Scratch Pad', Icon: PencilLine },
]

const UNAVAILABLE_TOOLTIP = 'Not available in this preview'

export default function IanInputBar({ driver, suggestion, placeholder, onSubmit, disabled = false }: IanInputBarProps) {
  const [activeTab, setActiveTab] = useState<IanInputBarProps['driver']>(driver)
  const [tooltip, setTooltip] = useState<string | null>(null)

  function handleTabClick(id: IanInputBarProps['driver']) {
    if (id === 'voice' || id === 'scratchpad') {
      setTooltip(UNAVAILABLE_TOOLTIP)
      setTimeout(() => setTooltip(null), 2000)
      return
    }
    setActiveTab(id)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: disabled ? 0.45 : 1 }}
      transition={{ duration: 0.2 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: disabled ? 'none' : 'auto' }}
    >
      {/* Tooltip */}
      {tooltip && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{
            alignSelf: 'center',
            background: 'rgba(34,31,28,0.88)',
            color: '#fff',
            fontSize: 12,
            fontFamily: 'var(--font-cp-sans)',
            borderRadius: 8,
            padding: '5px 10px',
            pointerEvents: 'none',
          }}
        >
          {tooltip}
        </motion.div>
      )}

      {/* Mode tab strip */}
      <div style={{
        display: 'flex', gap: 2, padding: 4,
        background: '#EDEAE5', borderRadius: 14,
      }}>
        {TABS.map(({ id, label, Icon }) => {
          const isActive = activeTab === id || (driver === id && (id === 'voice' || id === 'scratchpad'))
          return (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              style={{
                flex: 1, position: 'relative', padding: '8px 4px',
                border: 'none', background: 'transparent', cursor: 'pointer',
                borderRadius: 10, zIndex: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontFamily: 'var(--font-cp-sans)', fontSize: 13,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--ink)' : 'var(--muted)',
                transition: 'color 0.2s ease',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="ian-input-mode-pill"
                  style={{
                    position: 'absolute', inset: 0,
                    background: '#fff', borderRadius: 10,
                    boxShadow: '0 1px 3px rgba(34,31,28,0.12), 0 1px 0 rgba(34,31,28,0.04)',
                    zIndex: -1,
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                />
              )}
              <Icon size={14} style={{ flexShrink: 0, color: isActive ? 'var(--accent)' : 'var(--muted)' }} />
              {label}
            </button>
          )
        })}
      </div>

      {/* Chat field */}
      <button
        onClick={onSubmit}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          background: '#fff',
          border: '1.5px solid var(--border)',
          borderRadius: 12, padding: '11px 14px', textAlign: 'left',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-1)',
          transition: 'border-color 0.15s, box-shadow 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-2)' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow-1)' }}
      >
        {driver === 'voice' ? (
          <Mic size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        ) : driver === 'scratchpad' ? (
          <PencilLine size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        ) : (
          <MessageCircle size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        )}
        <span style={{
          flex: 1, fontFamily: 'var(--font-cp-sans)', fontSize: 14,
          color: suggestion ? 'var(--muted)' : 'var(--muted)',
          fontStyle: 'italic',
        }}>
          {suggestion ?? placeholder ?? (driver === 'voice' ? 'Tap to speak…' : driver === 'scratchpad' ? 'Add to scratch pad…' : 'Ask Miles something…')}
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', flexShrink: 0, fontFamily: 'var(--font-cp-sans)' }}>
          {driver === 'voice' ? '●' : 'Send →'}
        </span>
      </button>
    </motion.div>
  )
}
