import { Calendar, MessageSquare, Users, FileText, BookOpen, CheckSquare } from 'lucide-react'
import ianAvatar      from '../assets/ian-avatar.png'
import iconSparkStage from '../assets/icon-spark-stage.png'
import iconSpark      from '../assets/icon-spark.png'
import iconHandshake  from '../assets/icon-handshake.png'
import iconGauge      from '../assets/icon-gauge.png'
import iconNetwork    from '../assets/icon-network.png'
import iconChat       from '../assets/icon-chat.png'
import iconPuzzle     from '../assets/icon-puzzle.png'
import iconDirectory   from '../assets/icon-directory.png'
import iconSavedPeople from '../assets/icon-saved-people.png'
import iconScorecard   from '../assets/icon-scorecard.png'
import iconDeck        from '../assets/icon-deck.png'
import iconReadiness   from '../assets/icon-readiness.png'

type StageId = 'spark' | 'garage' | 'testTrack'

interface CPSubRailProps {
  activeStage: StageId | null
  currentScreen: string
}

const STAGE_ICONS: Record<string, string> = {
  spark: iconSparkStage,
  garage: iconHandshake,
  track: iconGauge,
}

const STAGE_ICON_FILTER: Record<string, string> = {
  spark:  'brightness(0) saturate(100%) invert(37%) sepia(85%) saturate(600%) hue-rotate(20deg) brightness(92%)',
  garage: 'brightness(0) saturate(100%) invert(31%) sepia(40%) saturate(800%) hue-rotate(185deg) brightness(88%)',
  track:  'brightness(0) saturate(100%) invert(20%) sepia(90%) saturate(1000%) hue-rotate(340deg) brightness(78%)',
}

const STAGE_TOOLS: Record<string, {
  label: string
  tools: { id: string; name: string; Icon: React.FC<{ size?: number }>; imgSrc?: string; screens: string[] }[]
}> = {
  spark: {
    label: 'Spark',
    tools: [
      { id: 'idea',       name: 'Idea & evidence',     Icon: BookOpen,      imgSrc: iconSpark, screens: ['1.1', '1.3', '1.3b', '1.3c'] },
      { id: 'interviews', name: 'Customer interviews',  Icon: Calendar,      imgSrc: iconChat,   screens: ['1.3d', '1.3e']              },
      { id: 'verdict',    name: 'PMF verdict',          Icon: MessageSquare, imgSrc: iconPuzzle, screens: ['1.4', '1.5']              },
    ],
  },
  garage: {
    label: 'Garage',
    tools: [
      { id: 'network',   name: 'Your network',   Icon: Users,    imgSrc: iconNetwork, screens: ['2.1', '2.2', '2.3', '2.4'] },
      { id: 'directory', name: 'The directory',  Icon: FileText, imgSrc: iconDirectory, screens: []                           },
      { id: 'saved',     name: 'Saved people',   Icon: Users, imgSrc: iconSavedPeople, screens: []                           },
    ],
  },
  track: {
    label: 'Test Track',
    tools: [
      { id: 'readiness', name: 'Readiness check',  Icon: CheckSquare, imgSrc: iconReadiness, screens: ['3.1', '3.2', '3.3'] },
      { id: 'scorecard', name: 'Readiness scorecard', Icon: CheckSquare, imgSrc: iconScorecard, screens: ['3.4'] },
      { id: 'deck',      name: 'Deck & evidence',  Icon: FileText, imgSrc: iconDeck, screens: ['3.5'] },
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
  const stageIcon = cpKey ? STAGE_ICONS[cpKey] : null

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
      padding: '28px 14px 20px', height: '100%', overflow: 'hidden auto',
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
            fontSize: 15, color: 'var(--ink)', padding: '2px 8px 18px',
          }}>
            <span style={{
              width: 26, height: 26, borderRadius: 7,
              background: 'var(--stage)',
              display: 'grid', placeItems: 'center',
              color: '#fff', flexShrink: 0,
            }}>
              {stageIcon && <img src={stageIcon} alt="" style={{ width: 14, height: 14, objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />}
            </span>
            {activeToolDef?.name ?? stageDef.label}
          </div>

          {/* "This stage" label */}
          <div style={{
            fontFamily: 'var(--font-cp-mono)', fontSize: 10,
            textTransform: 'uppercase', letterSpacing: '0.14em',
            color: 'var(--muted)', padding: '2px 10px 10px',
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
                    padding: '10px 12px', marginBottom: 16,
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
                  <span style={{ color: isActive ? 'var(--stage-strong)' : 'var(--muted)', display: 'flex', flexShrink: 0 }}>
                    {tool.imgSrc
                      ? <img src={tool.imgSrc} alt="" style={{ width: 15, height: 15, objectFit: 'contain', filter: isActive ? (cpKey ? STAGE_ICON_FILTER[cpKey] : 'none') : 'brightness(0) opacity(0.35)' }} />
                      : <ToolIcon size={15} />}
                  </span>
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
