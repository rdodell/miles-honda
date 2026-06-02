import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import CPTopbar      from './components/CPTopbar'
import CPRoadStrip   from './components/CPRoadStrip'
import CPSubRail     from './components/CPSubRail'
import PresenterGuide from './components/PresenterGuide'
import RestartDialog  from './components/RestartDialog'
import ChecklistPanel from './components/ChecklistPanel'
import scenario from './scenario.json'

import Landing            from './screens/Landing'
import Dashboard          from './screens/Dashboard'
import SparkWelcome       from './screens/SparkWelcome'
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
  '0.1': null, 'D.1': null,
  '1.1': 'spark', '1.3': 'spark', '1.3b': 'spark', '1.3c': 'spark',
  '1.3d': 'spark', '1.4': 'spark', '1.5': 'spark',
  '2.1': 'garage', '2.2': 'garage', '2.3': 'garage', '2.4': 'garage',
  '3.1': 'testTrack', '3.2': 'testTrack', '3.3': 'testTrack',
  '3.4': 'testTrack', '3.5': 'testTrack',
  'T.1': null,
}

const STAGE_COMPLETES_AT: Record<string, StageId> = {
  '1.4': 'spark',
  '2.4': 'garage',
  '3.5': 'testTrack',
}

/* Maps StageId → CSS data-stage attribute value */
const CSS_STAGE: Record<StageId, string> = {
  spark:     'spark',
  garage:    'garage',
  testTrack: 'track',
}

/* Full-app gradient background — uses --stage-soft so it shifts with the active stage */
const BG_GRADIENT = `
  radial-gradient(900px 520px at 5% -10%,  var(--stage-soft) 0%, transparent 60%),
  radial-gradient(600px 500px at 100% 110%, var(--stage-soft) 0%, transparent 60%),
  linear-gradient(165deg, #FFFFFF 0%, var(--bg) 100%)
`.trim()

const GLASS: React.CSSProperties = {
  background: 'rgba(255,255,255,0.58)',
  backdropFilter: 'blur(18px) saturate(1.4)',
  WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
}

export default function App() {
  const [screen, setScreen]       = useState('0.1')
  const [completed, setCompleted] = useState<Record<StageId, boolean>>({
    spark: false, garage: false, testTrack: false,
  })
  const [showGuide, setShowGuide]     = useState(false)
  const [showRestart, setShowRestart] = useState(false)
  const [toast, setToast]             = useState<string | null>(null)
  const [checklistOpen, setChecklistOpen] = useState(false)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2400)
    return () => clearTimeout(t)
  }, [toast])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '?') { setShowGuide((v) => !v); return }
      if (e.key === 'Escape') {
        setShowGuide(false)
        if (checklistOpen) { setChecklistOpen(false); return }
        if (screen !== '0.1') setShowRestart(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [screen, checklistOpen])

  const advance = useCallback((next: string) => {
    const completing = STAGE_COMPLETES_AT[screen]
    if (completing) setCompleted((prev) => ({ ...prev, [completing]: true }))
    setScreen(next)
    window.scrollTo(0, 0)
  }, [screen])

  const showTooltip = useCallback((msg: string) => setToast(msg), [])

  function handleRestart() {
    setCompleted({ spark: false, garage: false, testTrack: false })
    setScreen('0.1')
    setShowRestart(false)
  }

  const activeStage = (SCREEN_TO_STAGE[screen] ?? null) as StageId | null
  const cssStage    = activeStage ? CSS_STAGE[activeStage] : undefined
  const showChrome  = screen !== '0.1'

  const commonProps = { onAdvance: advance, showTooltip }

  function renderScreen() {
    switch (screen) {
      case '0.1':  return <Landing onAdvance={advance} />
      case 'D.1':  return <Dashboard onAdvance={advance} />
      case '1.1':  return <SparkWelcome {...commonProps} />
      case '1.3':  return <FrameProblem onAdvance={advance} />
      case '1.3b': return <BiasCheck onAdvance={advance} />
      case '1.3c': return <EvidencePlaybook onAdvance={advance} showTooltip={showTooltip} />
      case '1.3d': return <LauraIntro onAdvance={advance} />
      case '1.4':  return <SparkWrap onAdvance={advance} onOpenChecklist={() => setChecklistOpen(true)} />
      case '1.5':  return <SupplierBridge onAdvance={advance} />
      case '2.1':  return <GarageWelcome onAdvance={advance} />
      case '2.2':  return <GarageEmail onAdvance={advance} />
      case '2.3':  return <GarageMeeting {...commonProps} />
      case '2.4':  return <GarageWrap onAdvance={advance} />
      case '3.1':  return <TestTrackWelcome {...commonProps} />
      case '3.2':  return <TestTrackFinance onAdvance={advance} />
      case '3.3':  return <TestTrackRedTeam onAdvance={advance} />
      case '3.4':  return <TestTrackReadiness onAdvance={advance} />
      case '3.5':  return <JourneyComplete onAdvance={advance} />
      case 'T.1':  return <Tools showTooltip={showTooltip} />
      default:     return <Landing onAdvance={advance} />
    }
  }

  return (
    <div
      data-stage={cssStage}
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: BG_GRADIENT,
        minWidth: showChrome ? 1280 : undefined,
      }}
    >
      {showChrome ? (
        /* ── Direction C+ 3-column grid ─────────────────────────── */
        <div style={{
          display: 'grid',
          gridTemplateColumns: '244px 1fr',
          gridTemplateRows: '90px 132px 1fr',
          height: '100vh',
          overflow: 'hidden',
        }}>
          {/* Row 1: Topbar (full width) */}
          <CPTopbar
            activeStage={activeStage}
            completedStages={completed}
            currentScreen={screen}
            onNavigate={advance}
            showTooltip={showTooltip}
            onOpenChecklist={() => setChecklistOpen(true)}
          />

          {/* Row 2: Road strip (full width) */}
          <CPRoadStrip activeStage={activeStage} completedStages={completed} />

          {/* Row 3 col 1: Contextual sidebar */}
          <aside style={{
            ...GLASS,
            gridRow: 3, gridColumn: 1,
            borderRight: '1px solid rgba(255,255,255,0.65)',
            overflow: 'hidden',
          }}>
            <CPSubRail activeStage={activeStage} currentScreen={screen} />
          </aside>

          {/* Row 3 col 2: Main work area */}
          <main style={{
            gridRow: 3, gridColumn: 2,
            overflow: 'hidden auto',
            background: 'transparent',
            paddingTop: 16,
          }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={screen}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                style={{ minHeight: '100%' }}
              >
                {(scenario.screens as Record<string, { timeIndicator?: string | null }>)[screen]?.timeIndicator && (
                  <div style={{ padding: '0 20px', marginBottom: 2 }}>
                    <span style={{
                      fontFamily: 'var(--font-cp-mono)', fontSize: 11,
                      textTransform: 'uppercase', letterSpacing: '0.14em',
                      color: 'var(--muted)',
                    }}>
                      {(scenario.screens as Record<string, { timeIndicator?: string | null }>)[screen].timeIndicator}
                    </span>
                  </div>
                )}
                {renderScreen()}
              </motion.div>
            </AnimatePresence>
          </main>

        </div>
      ) : (
        /* ── Landing: full-bleed ─────────────────────────────────── */
        <div style={{ height: '100vh', overflow: 'hidden auto' }}>
          {renderScreen()}
        </div>
      )}

      {/* ── Toast ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 8, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 8, x: '-50%' }}
            style={{
              position: 'fixed', bottom: 32, left: '50%',
              zIndex: 60, background: 'var(--ink)', color: '#fff',
              fontSize: 13, borderRadius: 12, padding: '10px 18px',
              boxShadow: 'var(--shadow-3)', maxWidth: 320,
              textAlign: 'center', pointerEvents: 'none',
              fontFamily: 'var(--font-cp-sans)',
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <ChecklistPanel
        open={checklistOpen}
        onClose={() => setChecklistOpen(false)}
        activeStage={activeStage}
        completedStages={completed}
      />

      <PresenterGuide visible={showGuide} onClose={() => setShowGuide(false)} />
      <RestartDialog
        visible={showRestart}
        onConfirm={handleRestart}
        onCancel={() => setShowRestart(false)}
      />
    </div>
  )
}
