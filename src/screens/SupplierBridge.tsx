import { useState } from 'react'
import { Mic } from 'lucide-react'
import { motion } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import IanInputBar from '../components/IanInputBar'
import scenario from '../scenario.json'
import priyaAvatar from '../assets/priya-avatar.png'

interface Props { onAdvance: (screen: string) => void }

const s = scenario.screens['1.5']
const ianInput = (s as any).ianInput as { driver: string; text: string; voiceNote?: string }

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
})

// Small waveform bars — purely decorative
function WaveformBars() {
  const heights = [4, 8, 12, 8, 14, 10, 6, 12, 8, 4]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {heights.map((h, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: h,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.7)',
          }}
        />
      ))}
    </div>
  )
}

export default function SupplierBridge({ onAdvance }: Props) {
  const [showCard, setShowCard] = useState(false)
  const [showVoiceClip, setShowVoiceClip] = useState(false)
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')

  function handleOption(opt: { advance: string; primary?: boolean; milesReply?: string }) {
    if (showVoiceClip) return // already picked

    // Show voice clip bubble first
    setShowVoiceClip(true)

    if (opt.milesReply) {
      setReplyText(opt.milesReply)
      setTimeout(() => {
        setShowReply(true)
        setTimeout(() => onAdvance(opt.advance), 3500)
      }, 1200)
    } else {
      setTimeout(() => onAdvance(opt.advance), 1200)
    }
  }

  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-20">
      {/* Greeting + question */}
      <MilesMessage text={s.milesIntro} onDone={() => setShowCard(true)} />

      {/* Priya bridge card */}
      {showCard && (
        <motion.div {...fadeUp(0.1)} className="bg-white border border-[#E8E4DE] rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden">
              <img src={priyaAvatar} alt="Priya" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-semibold text-sm text-[#1A1A1A]">{(s as any).bridgeCard?.name ?? 'Priya Okafor'}</div>
              <div className="text-xs text-[#6B6B6B]">{(s as any).bridgeCard?.title ?? 'Project Manager, Honda R&D'}</div>
            </div>
          </div>
          <p className="text-sm text-[#3A3537] leading-snug">{(s as any).bridgeCard?.note ?? 'She built the e-bike battery supply chain from scratch.'}</p>
        </motion.div>
      )}

      {/* IanInputBar — voice mode, visible after card appears */}
      {showCard && !showVoiceClip && (
        <motion.div {...fadeUp(0.15)}>
          <IanInputBar
            driver="voice"
            suggestion={ianInput.text}
            onSubmit={() => handleOption((s as any).choice?.options?.[0] ?? { advance: '2.1', primary: true })}
          />
        </motion.div>
      )}

      {/* Choice buttons (shown until voice clip fires) */}
      {showCard && !showVoiceClip && (
        <motion.div {...fadeUp(0.2)} className="flex flex-col gap-3">
          {(s as any).choice?.options?.map((opt: { label: string; advance: string; primary?: boolean; soft?: boolean; milesReply?: string }) => (
            opt.primary ? (
              <button
                key={opt.label}
                onClick={() => handleOption(opt)}
                className="bg-[#7A1420] text-white font-semibold py-3 rounded-xl hover:bg-[#5C0F18] transition-colors shadow-sm"
              >
                {opt.label}
              </button>
            ) : (
              <button
                key={opt.label}
                onClick={() => handleOption(opt)}
                className="border border-[#E8E4DE] text-[#1A1A1A] font-medium py-3 rounded-xl bg-white hover:bg-[#F2EEE8] transition-colors"
              >
                {opt.label}
              </button>
            )
          ))}
        </motion.div>
      )}

      {/* Voice clip bubble — Ian's one voice moment */}
      {showVoiceClip && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end"
        >
          <div
            aria-label={ianInput.voiceNote ?? ianInput.text}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'var(--ink)', color: '#fff',
              borderRadius: '20px 20px 4px 20px',
              padding: '10px 16px',
              boxShadow: 'var(--shadow-1)',
            }}
          >
            <Mic size={15} style={{ color: '#fff', flexShrink: 0 }} />
            <WaveformBars />
            <span style={{ fontSize: 13, fontFamily: 'var(--font-cp-sans)', fontWeight: 600, color: '#fff', marginLeft: 2 }}>
              0:08
            </span>
          </div>
        </motion.div>
      )}

      {/* Soft-choice reply before advancing */}
      {showReply && replyText && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <MilesMessage text={replyText} />
        </motion.div>
      )}
    </div>
  )
}
