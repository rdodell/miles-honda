import { useState } from 'react'
import { motion } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import scenario from '../scenario.json'

interface Props { onAdvance: (screen: string) => void }

const s = scenario.screens['1.5']

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
})

export default function SupplierBridge({ onAdvance }: Props) {
  const [showCard, setShowCard] = useState(false)
  const [showReply, setShowReply] = useState(false)
  const [replyText, setReplyText] = useState('')

  function handleSoft(option: { advance: string; milesReply?: string }) {
    if (option.milesReply) {
      setReplyText(option.milesReply)
      setShowReply(true)
      setTimeout(() => onAdvance(option.advance), 3500)
    } else {
      onAdvance(option.advance)
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
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: (s as any).bridgeCard?.color ?? '#5B5FD9' }}
            >
              {(s as any).bridgeCard?.initial ?? 'P'}
            </div>
            <div>
              <div className="font-semibold text-sm text-[#1A1A1A]">{(s as any).bridgeCard?.name ?? 'Priya Okafor'}</div>
              <div className="text-xs text-[#6B6B6B]">{(s as any).bridgeCard?.title ?? 'Project Manager, Honda R&D'}</div>
            </div>
          </div>
          <p className="text-sm text-[#3A3537] leading-snug">{(s as any).bridgeCard?.note ?? 'She built the e-bike battery supply chain from scratch.'}</p>
        </motion.div>
      )}

      {/* Choice buttons */}
      {showCard && !showReply && (
        <motion.div {...fadeUp(0.2)} className="flex flex-col gap-3">
          {(s as any).choice?.options?.map((opt: any) => (
            opt.primary ? (
              <button
                key={opt.label}
                onClick={() => onAdvance(opt.advance)}
                className="bg-[#CC0000] text-white font-semibold py-3 rounded-xl hover:bg-[#AA0000] transition-colors shadow-sm"
              >
                {opt.label}
              </button>
            ) : (
              <button
                key={opt.label}
                onClick={() => handleSoft(opt)}
                className="border border-[#E8E4DE] text-[#1A1A1A] font-medium py-3 rounded-xl bg-white hover:bg-[#F2EEE8] transition-colors"
              >
                {opt.label}
              </button>
            )
          ))}
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
