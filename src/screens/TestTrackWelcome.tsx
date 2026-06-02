import { useState } from 'react'
import { motion } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import IanInputBar from '../components/IanInputBar'
import BMCGrid from '../components/BMCGrid'
import scenario from '../scenario.json'

interface TestTrackWelcomeProps {
  onAdvance: (screen: string) => void
  showTooltip?: (msg: string) => void
}

const s = scenario.screens['3.1']
const ianInput = (s as any).ianInput as { driver: string; text: string }

export default function TestTrackWelcome({ onAdvance }: TestTrackWelcomeProps) {
  const [showBMC, setShowBMC] = useState(false)

  return (
    <div className="flex flex-col gap-4 px-5 py-5 pb-20">
      <MilesMessage text={s.milesMessage} onDone={() => setShowBMC(true)} />

      {showBMC && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <BMCGrid
            flaggedSection={s.flaggedSection}
            flaggedLabel={s.flaggedTooltip}
            onSectionClick={() => onAdvance(s.bmcAdvance)}
            sectionTooltip={s.bmcSectionTooltip}
          />
        </motion.div>
      )}

      {showBMC && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <IanInputBar
            driver="chat"
            suggestion={ianInput.text}
            onSubmit={() => onAdvance(s.bmcAdvance)}
          />
        </motion.div>
      )}
    </div>
  )
}
