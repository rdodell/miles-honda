import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import MilesAvatar from '../components/MilesAvatar'
import MilesMessage from '../components/MilesMessage'
import IanInputBar from '../components/IanInputBar'
import scenario from '../scenario.json'

interface SparkWrapProps {
  onAdvance: (screen: string) => void
  onOpenChecklist?: () => void
}

const s = scenario.screens['1.4']
const ianInput = (s as any).ianInput as { driver: string; text: string }
const checklistIntro = scenario.checklists.stages.spark.milesIntro

const fadeUp = (i: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.12, duration: 0.3 },
})

export default function SparkWrap({ onAdvance, onOpenChecklist }: SparkWrapProps) {
  // Checkpoint: after the wrap, Miles introduces the checklist and the panel auto-opens
  const [checkpointDone, setCheckpointDone] = useState(false)

  return (
    <div className="flex flex-col gap-5 px-5 py-5 pb-20">
      <motion.div {...fadeUp(0)} className="bg-white border border-[#E8E4DE] rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <MilesAvatar />
          <h2 className="font-semibold text-base text-[#1A1A1A]">{s.header}</h2>
        </div>

        <ul className="space-y-2.5">
          {s.bullets.map((bullet, i) => (
            <motion.li key={i} {...fadeUp(i + 1)} className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-[#7CB342] mt-0.5 flex-shrink-0" />
              <span className="text-sm text-[#1A1A1A] leading-snug">{bullet}</span>
            </motion.li>
          ))}
        </ul>

        <motion.p {...fadeUp(4)} className="text-sm text-[#A09A94] mt-4 pt-3 border-t border-[#E8E4DE]">
          {s.milesFooter}
        </motion.p>
      </motion.div>

      {/* Checklist checkpoint — Miles surfaces the checklist, then the panel auto-opens */}
      <MilesMessage
        text={checklistIntro}
        onDone={() => {
          onOpenChecklist?.()
          setCheckpointDone(true)
        }}
      />

      {checkpointDone && (
        <motion.div {...fadeUp(0)}>
          <IanInputBar
            driver="chat"
            suggestion={ianInput.text}
            onSubmit={() => onAdvance(s.cta.advance)}
          />
        </motion.div>
      )}
    </div>
  )
}
