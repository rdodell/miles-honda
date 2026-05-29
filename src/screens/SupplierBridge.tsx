import { useState } from 'react'
import { motion } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import scenario from '../scenario.json'

interface Props { onAdvance: (screen: string) => void }
const s = scenario.screens['1.5']
const bc = s.bridgeCard

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
})

export default function SupplierBridge({ onAdvance }: Props) {
  const [showCard, setShowCard] = useState(false)

  return (
    <div className="flex flex-col gap-4 px-5 py-5 pb-20">
      <MilesMessage text={s.milesIntro} onDone={() => setShowCard(true)} />

      {showCard && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#E8E4DE] rounded-2xl p-4 shadow-sm flex items-center gap-4"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
              style={{ background: bc.color }}
            >
              {bc.initial}
            </div>
            <div>
              <div className="font-semibold text-[#1A1A1A]">{bc.name}</div>
              <div className="text-xs text-[#A09A94]">{bc.title}</div>
              <div className="text-xs text-[#5B5FD9] mt-1">{bc.note}</div>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="flex justify-end">
            <button
              onClick={() => onAdvance(s.cta.advance)}
              className="bg-[#CC0000] text-white font-semibold py-3 px-6 rounded-xl hover:bg-[#AA0000] transition-colors shadow-sm"
            >
              {s.cta.label}
            </button>
          </motion.div>
        </>
      )}
    </div>
  )
}
