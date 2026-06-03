import { LayoutGrid, ListChecks } from 'lucide-react'
import scenario from '../scenario.json'
import ianAvatar      from '../assets/ian-avatar.png'
import iconSparkStage from '../assets/icon-spark-stage.png'
import iconHandshake  from '../assets/icon-handshake.png'
import iconGauge      from '../assets/icon-gauge.png'

type StageId = 'spark' | 'garage' | 'testTrack'

interface CPTopbarProps {
  activeStage: StageId | null
  completedStages: Record<StageId, boolean>
  currentScreen: string
  onNavigate: (screen: string) => void
  showTooltip: (msg: string) => void
  onOpenChecklist: () => void
}

// CSS filters to colorize black PNGs to each stage's --stage-strong color
const STAGE_ICON_FILTER: Record<string, string> = {
  spark:     'brightness(0) saturate(100%) invert(37%) sepia(85%) saturate(600%) hue-rotate(20deg) brightness(92%)',
  garage:    'brightness(0) saturate(100%) invert(31%) sepia(40%) saturate(800%) hue-rotate(185deg) brightness(88%)',
  testTrack: 'brightness(0) saturate(100%) invert(20%) sepia(90%) saturate(1000%) hue-rotate(340deg) brightness(78%)',
}

const TABS = [
  { id: 'spark',  label: 'Spark',      icon: iconSparkStage, entry: '1.1', stageKey: 'spark'     as StageId },
  { id: 'garage', label: 'Garage',     icon: iconHandshake, entry: '2.1', stageKey: 'garage'    as StageId },
  { id: 'track',  label: 'Test Track', icon: iconGauge,     entry: '3.1', stageKey: 'testTrack' as StageId },
] as const

const STAGE_ORDER: StageId[] = ['spark', 'garage', 'testTrack']

function cpStageId(s: StageId | null): string | null {
  if (!s) return null
  return s === 'testTrack' ? 'track' : s
}

export default function CPTopbar({
  activeStage, completedStages, currentScreen, onNavigate, showTooltip, onOpenChecklist,
}: CPTopbarProps) {
  const cpActive = cpStageId(activeStage)
  // Venture sub-line tracks the current screen's timeline day; falls back to just "Prototype"
  const currentDay = (scenario.screens as Record<string, { day?: number }>)[currentScreen]?.day
  const ventureMeta = currentDay != null ? `Day ${currentDay} · Prototype` : 'Prototype'

  function handleTab(tab: typeof TABS[number]) {
    if (activeStage === tab.stageKey) {
      onNavigate(tab.entry)
      return
    }
    if (completedStages[tab.stageKey]) {
      showTooltip('Ian has already completed this stage.')
      return
    }
    const activeIdx = activeStage ? STAGE_ORDER.indexOf(activeStage) : -1
    const tabIdx = STAGE_ORDER.indexOf(tab.stageKey)
    if (tabIdx > activeIdx + 1) {
      showTooltip("Ian hasn't reached this stage yet.")
      return
    }
    onNavigate(tab.entry)
  }

  const glassStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(18px) saturate(1.4)',
    WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
    borderBottom: '1px solid var(--border)',
  }

  return (
    <header
      style={{
        ...glassStyle,
        gridColumn: '1 / -1',
        gridRow: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        padding: '0 26px',
        height: 90,
        zIndex: 20,
        position: 'relative',
      }}
    >
      {/* Brand */}
      <button
        onClick={() => onNavigate('D.1')}
        style={{
          display: 'flex', alignItems: 'center', gap: 11,
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          flexShrink: 0,
        }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: 'var(--grad-brand)',
          display: 'grid', placeItems: 'center',
          color: '#fff', fontFamily: 'var(--font-cp-display)',
          fontWeight: 700, fontSize: 20, lineHeight: 1,
        }}>H</div>
        <span style={{
          fontFamily: 'var(--font-cp-display)', fontWeight: 600,
          fontSize: 18, color: 'var(--ink)', lineHeight: 1,
        }}>
          Ignition at Honda
        </span>
      </button>

      {/* Stage tabs */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {TABS.map((tab) => {
          const isActive = tab.id === cpActive
          return (
            <button
              key={tab.id}
              onClick={() => handleTab(tab)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '9px 15px', borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-cp-sans)', fontSize: 14, fontWeight: 500,
                background: isActive ? 'rgba(255,255,255,0.88)' : 'transparent',
                border: `1px solid ${isActive ? 'var(--border)' : 'transparent'}`,
                color: isActive ? 'var(--ink)' : 'var(--muted)',
                cursor: 'pointer',
                boxShadow: isActive
                  ? 'var(--shadow-1), inset 0 -2px 0 var(--stage)'
                  : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <img
                src={tab.icon}
                alt=""
                style={{
                  width: 16, height: 16, objectFit: 'contain',
                  filter: isActive
                    ? STAGE_ICON_FILTER[tab.stageKey]
                    : 'brightness(0) opacity(0.35)',
                }}
              />
              {tab.label}
            </button>
          )
        })}
      </nav>

      {/* Right cluster */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Checklist control — opens the slide-over journey checklist */}
        <button
          onClick={onOpenChecklist}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 13px', borderRadius: 'var(--radius-sm)',
            background: 'rgba(255,255,255,0.72)',
            border: '1px solid var(--border-strong)',
            color: 'var(--ink)', fontFamily: 'var(--font-cp-sans)',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            boxShadow: 'var(--shadow-1)',
            backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            flexShrink: 0,
          }}
        >
          <ListChecks size={15} style={{ color: 'var(--accent)' }} />
          Checklist
        </button>

        {/* All tools */}
        <button
          onClick={() => onNavigate('T.1')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 9,
            padding: '8px 14px', borderRadius: 'var(--radius-sm)',
            background: 'rgba(255,255,255,0.72)',
            border: '1px solid var(--border-strong)',
            color: 'var(--ink)', fontFamily: 'var(--font-cp-sans)',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            boxShadow: 'var(--shadow-1)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <LayoutGrid size={15} style={{ color: 'var(--accent)' }} />
          All tools
          <span style={{
            fontFamily: 'var(--font-cp-mono)', fontSize: 10,
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            color: 'var(--muted)', padding: '2px 6px', borderRadius: 4,
          }}>⌘K</span>
        </button>

        {/* Venture + avatar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          paddingLeft: 16, borderLeft: '1px solid var(--border)',
        }}>
          <div>
            <div style={{
              fontFamily: 'var(--font-cp-display)', fontWeight: 600,
              fontSize: 14, color: 'var(--ink)', lineHeight: 1.2,
            }}>
              Electric Lawn Mower
            </div>
            <div style={{
              fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em',
              color: 'var(--muted)', marginTop: 2,
              fontFamily: 'var(--font-cp-mono)',
            }}>
              {ventureMeta}
            </div>
          </div>
          <img
            src={ianAvatar}
            alt="Ian"
            style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: 'var(--bg-2)', border: '1px solid var(--border)' }}
          />
        </div>
      </div>
    </header>
  )
}
