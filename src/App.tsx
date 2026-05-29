import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import Road from './components/Road'
import MilesLogo from './components/MilesLogo'
import BottomNav from './components/BottomNav'
import PresenterGuide from './components/PresenterGuide'
import RestartDialog from './components/RestartDialog'

import Landing            from './screens/Landing'
import SparkWelcome       from './screens/SparkWelcome'
import SparkChat          from './screens/SparkChat'
import FrameProblem       from './screens/FrameProblem'
import BiasCheck          from './screens/BiasCheck'
import EvidencePlaybook   from './screens/EvidencePlaybook'
import LauraIntro         from './screens/LauraIntro'
import SupplierBridge     from './screens/SupplierBridge'
import SparkWrap          from './screens/SparkWrap'
import GarageWelcome      from './screens/GarageWelcome'
import GarageEmail        from './screens/GarageEmail'
import GarageMeeting      from './screens/GarageMeeting'
import GarageWrap         from './screens/GarageWrap'
import TestTrackWelcome   from './screens/TestTrackWelcome'
import TestTrackFinance   from './screens/TestTrackFinance'
import TestTrackRedTeam   from './screens/TestTrackRedTeam'
import TestTrackReadiness from './screens/TestTrackReadiness'
import JourneyComplete    from './screens/JourneyComplete'
import Tools              from './screens/Tools'

type StageId = 'spark' | 'garage' | 'testTrack'

const SCREEN_TO_STAGE: Record<string, StageId | null> = {
  '0.1': null,
  '1.1': 'spark', '1.2': 'spark', '1.3': 'spark', '1.3b': 'spark', '1.3c': 'spark', '1.3d': 'spark', '1.4': 'spark', '1.5': 'spark',
  '2.1': 'garage','2.2': 'garage','2.3': 'garage','2.4': 'garage',
  '3.1': 'testTrack','3.2': 'testTrack','3.3': 'testTrack','3.4': 'testTrack','3.5': 'testTrack',
  'T.1': null,
}

const STAGE_COMPLETES_AT: Record<string, StageId> = {
  '1.4': 'spark',
  '2.4': 'garage',
  '3.5': 'testTrack',
}

const TIME_LABELS: Record<string, string> = {
  '1.1': 'Week 2 · Tuesday', '1.2': 'Week 2 · Tuesday', '1.3': 'Week 2 · Tuesday', '1.3b': 'Week 2 · Tuesday', '1.3c': 'Week 2 · Tuesday', '1.3d': 'Week 2 · Tuesday', '1.4': 'Week 2 · Friday', '1.5': 'Month 1 · Wednesday',
  '2.1': 'Month 1 · Wednesday', '2.2': 'Month 1 · Wednesday', '2.3': 'Month 1 · Friday', '2.4': 'Month 1 · Friday',
  '3.1': 'Month 3 · Monday', '3.2': 'Month 3 · Monday', '3.3': 'Month 3 · Monday',
  '3.4': 'Month 3 · Monday', '3.5': 'Month 3 · Monday',
}

export default function App() {
  const [screen, setScreen]     = useState('0.1')
  const [completed, setCompleted] = useState<Record<StageId, boolean>>({ spark: false, garage: false, testTrack: false })
  const [showGuide, setShowGuide]   = useState(false)
  const [showRestart, setShowRestart] = useState(false)
  const [toast, setToast]         = useState<string | null>(null)

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2400)
    return () => clearTimeout(t)
  }, [toast])

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '?') { setShowGuide((v) => !v); return }
      if (e.key === 'Escape') {
        setShowGuide(false)
        if (screen !== '0.1') setShowRestart(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [screen])

  const advance = useCallback((next: string) => {
    // Mark current screen's stage as complete if applicable
    const completing = STAGE_COMPLETES_AT[screen]
    if (completing) {
      setCompleted((prev) => ({ ...prev, [completing]: true }))
    }
    setScreen(next)
    // Scroll to top on screen change
    window.scrollTo(0, 0)
  }, [screen])

  const showTooltip = useCallback((msg: string) => setToast(msg), [])

  function handleRestart() {
    setCompleted({ spark: false, garage: false, testTrack: false })
    setScreen('0.1')
    setShowRestart(false)
  }

  const activeStage = (SCREEN_TO_STAGE[screen] ?? null) as StageId | null
  const timeLabel   = TIME_LABELS[screen]
  const showChrome  = screen !== '0.1'

  const commonProps = { onAdvance: advance, showTooltip }

  function renderScreen() {
    switch (screen) {
      case '0.1': return <Landing onAdvance={advance} />
      case '1.1': return <SparkWelcome {...commonProps} />
      case '1.2': return <SparkChat {...commonProps} />
      case '1.3':  return <FrameProblem onAdvance={advance} />
      case '1.3b': return <BiasCheck onAdvance={advance} />
      case '1.3c': return <EvidencePlaybook onAdvance={advance} />
      case '1.3d': return <LauraIntro onAdvance={advance} />
      case '1.4': return <SparkWrap onAdvance={advance} />
      case '1.5': return <SupplierBridge onAdvance={advance} />
      case '2.1': return <GarageWelcome onAdvance={advance} />
      case '2.2': return <GarageEmail onAdvance={advance} />
      case '2.3': return <GarageMeeting {...commonProps} />
      case '2.4': return <GarageWrap onAdvance={advance} />
      case '3.1': return <TestTrackWelcome {...commonProps} />
      case '3.2': return <TestTrackFinance onAdvance={advance} />
      case '3.3': return <TestTrackRedTeam onAdvance={advance} />
      case '3.4': return <TestTrackReadiness onAdvance={advance} />
      case '3.5': return <JourneyComplete onAdvance={advance} />
      case 'T.1': return <Tools showTooltip={showTooltip} />
      default:    return <Landing onAdvance={advance} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: '#FAFAFA' }}>

      {/* Sticky header: logo + time + road */}
      {showChrome && (
        <header style={{ background: '#fff', borderBottom: '2px solid #CC0000', position: 'sticky', top: 0, zIndex: 30 }}>
          <div className="max-w-[1400px] mx-auto">
            {/* Top bar: logo + time indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 20px 0' }}>
              <MilesLogo size="sm" />
              {timeLabel && (
                <span style={{ fontSize: 13, color: '#999', letterSpacing: '0.15em', fontFamily: 'monospace', textTransform: 'uppercase' }}>
                  {timeLabel}
                </span>
              )}
            </div>
            <Road completedStages={completed} activeStage={activeStage} />
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom nav */}
      {showChrome && (
        <BottomNav
          currentStage={activeStage}
          completedStages={completed}
          onNavigate={(id) => setScreen(id)}
          showTooltip={showTooltip}
        />
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 8, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 8, x: '-50%' }}
            className="fixed bottom-20 left-1/2 z-50 bg-[#1A1A1A] text-white text-sm rounded-xl px-4 py-2.5 shadow-lg max-w-xs text-center pointer-events-none"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlays */}
      <PresenterGuide visible={showGuide} onClose={() => setShowGuide(false)} />
      <RestartDialog
        visible={showRestart}
        onConfirm={handleRestart}
        onCancel={() => setShowRestart(false)}
      />
    </div>
  )
}
