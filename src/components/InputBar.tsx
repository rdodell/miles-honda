import { useState, useEffect, useRef } from 'react'
import { Mic, MessageCircle, Box, Upload, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { BEAT_BEFORE_ADVANCE } from '../timing'

interface InputBarProps {
  onChat: () => void
  suggestion?: string
  chatTooltip?: string
  typeSuggestion?: boolean
  /** Auto-send the typed suggestion (commit on its own, no manual tap) */
  autoSend?: boolean
}

const MODES = [
  { id: 'voice',   label: 'Voice',   Icon: Mic },
  { id: 'chat',    label: 'Chat',    Icon: MessageCircle },
  { id: 'sandbox', label: 'Sandbox', Icon: Box },
] as const

type Mode = typeof MODES[number]['id']

const TYPE_SPEED_MS = 28

export default function InputBar({ onChat, suggestion, chatTooltip, typeSuggestion, autoSend }: InputBarProps) {
  const [activeMode, setActiveMode] = useState<Mode>('chat')
  const [typed, setTyped]           = useState(typeSuggestion ? '' : (suggestion ?? ''))
  const [sandboxImage, setSandboxImage] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const isTyping = typeSuggestion && !!suggestion && typed.length < suggestion.length
  const onChatRef = useRef(onChat)
  onChatRef.current = onChat

  useEffect(() => {
    if (!typeSuggestion || !suggestion) return
    let i = 0
    let sendTimer: ReturnType<typeof setTimeout> | undefined
    // Wait for the user to read Miles' message before Ian starts typing
    const start = setTimeout(() => {
      const iv = setInterval(() => {
        i += 1
        setTyped(suggestion.slice(0, i))
        if (i >= suggestion.length) {
          clearInterval(iv)
          if (autoSend) sendTimer = setTimeout(() => onChatRef.current?.(), BEAT_BEFORE_ADVANCE)
        }
      }, TYPE_SPEED_MS)
    }, 2200)
    return () => { clearTimeout(start); if (sendTimer) clearTimeout(sendTimer) }
  }, [typeSuggestion, suggestion, autoSend])

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setSandboxImage(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      {/* Mode tab strip */}
      <div style={{
        display: 'flex', gap: 2, padding: 4,
        background: '#EDEAE5', borderRadius: 14, position: 'relative',
      }}>
        {MODES.map((mode) => {
          const { Icon } = mode
          const isActive = activeMode === mode.id
          return (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
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
                  layoutId="input-mode-pill"
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
              {mode.label}
            </button>
          )
        })}
      </div>

      {/* Content panel */}
      <AnimatePresence mode="wait" initial={false}>
        {activeMode === 'chat' && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            <button
              onClick={chatTooltip ? undefined : onChat}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                background: '#fff',
                border: '1.5px solid var(--border)',
                borderRadius: 12, padding: '11px 14px', textAlign: 'left',
                cursor: chatTooltip ? 'default' : 'pointer',
                opacity: chatTooltip ? 0.6 : 1,
                boxShadow: 'var(--shadow-1)',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => { if (!chatTooltip) { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-2)' } }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow-1)' }}
            >
              <MessageCircle size={15} style={{ color: chatTooltip ? 'var(--muted)' : 'var(--accent)', flexShrink: 0 }} />
              <span style={{
                flex: 1, fontFamily: 'var(--font-cp-sans)', fontSize: 14,
                color: typed ? 'var(--ink)' : 'var(--muted)',
                fontStyle: typed ? 'normal' : 'italic',
              }}>
                {typed || 'Ask Miles something…'}
                {isTyping && (
                  <span style={{
                    display: 'inline-block', width: 2, height: 14,
                    background: 'var(--ink)', marginLeft: 2, verticalAlign: 'middle',
                  }}
                    className="animate-pulse"
                  />
                )}
              </span>
              {!chatTooltip && (
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', flexShrink: 0, fontFamily: 'var(--font-cp-sans)' }}>
                  Send →
                </span>
              )}
            </button>
          </motion.div>
        )}

        {activeMode === 'voice' && (
          <motion.div
            key="voice"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              padding: '16px', background: '#fff',
              border: '1.5px solid var(--border)', borderRadius: 12,
              boxShadow: 'var(--shadow-1)',
            }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'var(--bg-2)', border: '1.5px dashed var(--border-strong)',
              display: 'grid', placeItems: 'center', color: 'var(--muted)',
            }}>
              <Mic size={18} />
            </div>
            <span style={{ fontFamily: 'var(--font-cp-sans)', fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>
              Voice mode isn't in this preview.
            </span>
          </motion.div>
        )}

        {activeMode === 'sandbox' && (
          <motion.div
            key="sandbox"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            {sandboxImage ? (
              /* Uploaded image — reveal animation */
              <div style={{ position: 'relative' }}>
                <motion.div
                  initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0.4 }}
                  animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
                  transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                  style={{ borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-2)' }}
                >
                  <img
                    src={sandboxImage}
                    alt="Uploaded sketch"
                    style={{ width: '100%', display: 'block', borderRadius: 12 }}
                  />
                </motion.div>
                {/* Label + clear button */}
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.2 }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginTop: 6, padding: '0 2px',
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-cp-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>
                    Ian · Sandbox
                  </span>
                  <button
                    onClick={() => { setSandboxImage(null); if (fileRef.current) fileRef.current.value = '' }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', padding: 2 }}
                  >
                    <X size={13} />
                  </button>
                </motion.div>
              </div>
            ) : (
              /* Upload area */
              <label
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                  padding: '20px 16px', cursor: 'pointer',
                  background: '#fff', border: '1.5px dashed var(--border-strong)',
                  borderRadius: 12, boxShadow: 'var(--shadow-1)',
                  transition: 'border-color 0.15s, background 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-soft)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.background = '#fff' }}
              >
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} hidden />
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'var(--bg-2)', border: '1.5px solid var(--border)',
                  display: 'grid', placeItems: 'center', color: 'var(--muted)',
                }}>
                  <Upload size={18} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-cp-sans)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
                    Upload a sketch
                  </div>
                  <div style={{ fontFamily: 'var(--font-cp-sans)', fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                    PNG, JPG or PDF — tap or drag to upload
                  </div>
                </div>
              </label>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
