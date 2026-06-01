import { Zap, Hammer, Flag, Calendar, MessageSquare, Users, FileText, BookOpen, CheckSquare } from 'lucide-react'
import ianAvatar from '../assets/ian-avatar.svg'

type StageId = 'spark' | 'garage' | 'testTrack'

interface CPSubRailProps {
  activeStage: StageId | null
  currentScreen: string
}

const STAGE_TOOLS: Record<string, {
  label: string
  Icon: React.FC<{ size?: number; style?: React.CSSProperties }>
  tools: { id: string; name: string; Icon: React.FC<{ size?: number }>; screens: string[] }[]
}> = {
  spark: {
    label: 'Spark',
    Icon: Zap,
    tools: [
      { id: 'idea',       name: 'Idea & evidence',     Icon: BookOpen,    screens: ['1.1', '1.3', '1.3b', '1.3c'] },
      { id: 'interviews', name: 'Customer interviews',  Icon: Calendar,    screens: ['1.3d', '1.3e']              },
      { id: 'verdict',    name: 'PMF verdict',          Icon: MessageSquare, screens: ['1.4', '1.5']              },
    ],
  },
  garage: {
    label: 'Garage',
    Icon: Hammer,
    tools: [
      { id: 'network',   name: 'Your network',   Icon: Users,    screens: ['2.1', '2.2', '2.3', '2.4'] },
      { id: 'directory', name: 'The directory',  Icon: FileText, screens: []                           },
      { id: 'saved',     name: 'Saved people',   Icon: Zap,      screens: []                           },
    ],
  },
  track: {
    label: 'The Test Track',
    Icon: Flag,
    tools: [
      { id: 'readiness', name: 'Readiness check',  Icon: CheckSquare, screens: ['3.1', '3.2', '3.3'] },
      { id: 'prep',      name: 'Seed-review prep', Icon: Flag,        screens: ['3.4']                },
      { id: 'deck',      name: 'Deck & evidence',  Icon: FileText,    screens: ['3.5']                },
    ],
  },
}

function cpStageKey(s: StageId | null): string | null {
  if (!s) return null
  return s === 'testTrack' ? 'track' : s
}

export default function CPSubRail({ activeStage, currentScreen }: CPSubRailProps) {
  const cpKey = cpStageKey(activeStage)
  const stageDef = cpKey ? STAGE_TOOLS[cpKey] : null
  const StageIcon = stageDef?.Icon

  function getActiveTool(): string | null {
    if (!stageDef) return null
    const match = stageDef.tools.find((t) => t.screens.includes(currentScreen))
    return match ? match.id : stageDef.tools[0]?.id ?? null
  }
  const activeTool = getActiveTool()
  const activeToolDef = stageDef?.tools.find((t) => t.id === activeTool)

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 0,
      padding: '20px 14px', height: '100%', overflow: 'hidden auto',
    }}>
      {stageDef ? (
        <>
          {/* Stage eyebrow */}
          <div style={{
            fontFamily: 'var(--font-cp-mono)', fontSize: 9.5,
            textTransform: 'uppercase', letterSpacing: '0.16em',
            color: 'var(--muted)', padding: '2px 8px 4px',
          }}>
            {stageDef.label}
          </div>

          {/* Active stage + tool */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9,
            fontFamily: 'var(--font-cp-display)', fontWeight: 600,
            fontSize: 15, color: 'var(--ink)', padding: '2px 8px 12px',
          }}>
            <span style={{
              width: 26, height: 26, borderRadius: 7,
              background: 'var(--stage)',
              display: 'grid', placeItems: 'center',
              color: '#fff', flexShrink: 0,
            }}>
              {StageIcon && <StageIcon size={14} />}
            </span>
            {activeToolDef?.name ?? stageDef.label}
          </div>

          {/* "This stage" label */}
          <div style={{
            fontFamily: 'var(--font-cp-mono)', fontSize: 10,
            textTransform: 'uppercase', letterSpacing: '0.14em',
            color: 'var(--muted)', padding: '6px 10px 4px',
          }}>
            This stage
          </div>

          {/* Tool list */}
          <div>
            {stageDef.tools.map((tool) => {
              const isActive = tool.id === activeTool
              const ToolIcon = tool.Icon
              return (
                <div
                  key={tool.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '9px 12px', marginBottom: 2,
                    borderRadius: 'var(--radius-sm)',
                    color: isActive ? 'var(--ink)' : 'var(--ink-2)',
                    fontSize: 13,
                    fontFamily: 'var(--font-cp-sans)',
                    background: isActive ? 'rgba(255,255,255,0.88)' : 'transparent',
                    border: `1px solid ${isActive ? 'var(--border)' : 'transparent'}`,
                    boxShadow: isActive ? 'var(--shadow-1)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <ToolIcon
                    size={15}
                    style={{ color: isActive ? 'var(--stage-strong)' : 'var(--muted)', flexShrink: 0 }}
                  />
                  <span style={{ flex: 1 }}>{tool.name}</span>
                  {isActive && (
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: 'var(--stage)',
                      flexShrink: 0,
                    }} />
                  )}
                </div>
              )
            })}
          </div>
        </>
      ) : (
        /* No active stage — neutral state */
        <div style={{ padding: '4px 8px 16px' }}>
          <div style={{
            fontFamily: 'var(--font-cp-display)', fontWeight: 600,
            fontSize: 15, color: 'var(--ink)', marginBottom: 4,
          }}>Miles</div>
          <div style={{
            fontFamily: 'var(--font-cp-sans)', fontSize: 13,
            color: 'var(--muted)', lineHeight: 1.5,
          }}>
            Your AI companion for the Ignition journey.
          </div>
        </div>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Active venture card */}
      <div style={{
        background: 'rgba(255,255,255,0.7)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
        marginBottom: 12,
        boxShadow: 'var(--shadow-1)',
      }}>
        <div style={{
          fontFamily: 'var(--font-cp-mono)', fontSize: 9,
          textTransform: 'uppercase', letterSpacing: '0.14em',
          color: 'var(--muted)', marginBottom: 5,
        }}>
          Active venture
        </div>
        <div style={{
          fontFamily: 'var(--font-cp-display)', fontWeight: 600,
          fontSize: 13, color: 'var(--ink)', lineHeight: 1.3, marginBottom: 8,
        }}>
          Electric lawn mower for landscaping pros
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['Day 84', 'Prototype'].map((pill) => (
            <span key={pill} style={{
              fontFamily: 'var(--font-cp-mono)', fontSize: 10,
              background: 'var(--bg-2)', border: '1px solid var(--border)',
              color: 'var(--muted)', padding: '2px 8px', borderRadius: 100,
            }}>{pill}</span>
          ))}
        </div>
      </div>

      {/* User profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px' }}>
        <img
          src={ianAvatar}
          alt="Ian"
          style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: 'var(--bg-2)', border: '1px solid var(--border)' }}
        />
        <div>
          <div style={{
            fontFamily: 'var(--font-cp-display)', fontWeight: 600,
            fontSize: 13, color: 'var(--ink)',
          }}>Ian</div>
          <div style={{
            fontFamily: 'var(--font-cp-mono)', fontSize: 10,
            color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em',
          }}>Intrapreneur</div>
        </div>
      </div>
    </div>
  )
}
