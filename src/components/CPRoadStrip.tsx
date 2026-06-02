type StageId = 'spark' | 'garage' | 'testTrack'

interface CPRoadStripProps {
  activeStage: StageId | null
  completedStages: Record<StageId, boolean>
}

const NODES = [
  { id: 'spark',  label: 'Customer Interviews Complete', subtitle: 'in 4 weeks',  stageKey: 'spark'     as StageId, x: 140 },
  { id: 'garage', label: 'Business Case Due',            subtitle: 'in 9 weeks',  stageKey: 'garage'    as StageId, x: 500 },
  { id: 'track',  label: 'Venture Board Review',         subtitle: 'in 12 weeks', stageKey: 'testTrack' as StageId, x: 860 },
]

const W = 1000, ROAD_H = 64, MIDY = 32, AMP = 7, CYCLES = 1.6

function yAt(x: number) {
  return MIDY + AMP * Math.sin((x / W) * Math.PI * 2 * CYCLES)
}

function roadPath(): string {
  let d = `M 0 ${yAt(0).toFixed(1)}`
  for (let x = 8; x <= W; x += 8) d += ` L ${x} ${yAt(x).toFixed(1)}`
  return d
}

const PATH_D = roadPath()

function CheckMini() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"
      style={{ width: 13, height: 13 }}
    >
      <path d="M5 12l5 5L20 7" />
    </svg>
  )
}

export default function CPRoadStrip({ activeStage, completedStages }: CPRoadStripProps) {
  const stageOrder: StageId[] = ['spark', 'garage', 'testTrack']
  const activeIdx = activeStage ? stageOrder.indexOf(activeStage) : -1
  const stageNum  = activeStage ? activeIdx + 1 : null

  return (
    <div style={{
      gridColumn: '1 / -1',
      gridRow: 2,
      height: 132,
      padding: '0 40px',
      background: 'rgba(255,255,255,0.52)',
      backdropFilter: 'blur(16px) saturate(1.35)',
      WebkitBackdropFilter: 'blur(16px) saturate(1.35)',
      borderTop: '1px solid var(--border-strong)',
      borderBottom: '1px solid var(--border-strong)',
      position: 'relative',
      zIndex: 18,
      display: 'flex',
      alignItems: 'center',
      gap: 18,
    }}>
      {/* Eyebrow */}
      <span style={{
        fontFamily: 'var(--font-cp-mono)', fontSize: 10,
        textTransform: 'uppercase', letterSpacing: '0.16em',
        color: 'var(--muted)', flex: '0 0 auto',
      }}>Journey</span>

      {/* Road SVG + node overlays */}
      <div style={{ flex: 1, position: 'relative', height: ROAD_H + 24, minWidth: 0 }}>
        {/* Road SVG */}
        <svg
          viewBox={`0 0 ${W} ${ROAD_H}`}
          preserveAspectRatio="none"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: ROAD_H, display: 'block' }}
          aria-hidden="true"
        >
          {/* Asphalt */}
          <path d={PATH_D} fill="none" stroke="#2C2A30" strokeWidth="28"
            strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          {/* Shoulder / edge highlight */}
          <path d={PATH_D} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="32"
            strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          {/* Center dashes */}
          <path d={PATH_D} fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="2"
            strokeLinecap="round" strokeDasharray="10 12"
            vectorEffect="non-scaling-stroke" />
          {/* Stage color progress overlay */}
          {activeStage && (
            <path d={PATH_D} fill="none"
              stroke="var(--stage)" strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={
                activeIdx === 0 ? '180 2000' :
                activeIdx === 1 ? '540 2000' :
                '1000 2000'
              }
              opacity="0.85"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>

        {/* Nodes — positioned as % of container width, y mapped from SVG */}
        {NODES.map((node, i) => {
          const isDone    = completedStages[node.stageKey]
          const isCurrent = activeStage === node.stageKey
          const isFuture  = !isDone && !isCurrent
          const leftPct   = (node.x / W) * 100
          const nodeSize  = isCurrent ? 36 : 22
          const topPx     = (yAt(node.x) / ROAD_H) * ROAD_H - (nodeSize / 2)

          return (
            <div key={node.id} style={{ position: 'absolute', left: `${leftPct}%`, top: 0, transform: 'translateX(-50%)' }}>
              {/* Node dot */}
              <div style={{
                position: 'absolute',
                top: topPx,
                left: '50%',
                transform: 'translateX(-50%)',
                width:  nodeSize,
                height: nodeSize,
                borderRadius: '50%',
                background: isDone
                  ? 'var(--c-garage-dark)'
                  : isCurrent
                    ? 'var(--stage)'
                    : '#48454F',
                border: isFuture
                  ? '2px dashed rgba(255,255,255,0.3)'
                  : isDone
                    ? '2px solid var(--c-garage-dark)'
                    : '2px solid var(--stage)',
                color: isDone || isCurrent ? '#fff' : 'rgba(255,255,255,0.6)',
                display: 'grid', placeItems: 'center',
                boxShadow: isCurrent
                  ? `0 0 0 5px var(--stage-soft), 0 0 20px 2px var(--stage), var(--shadow-2)`
                  : isDone
                    ? `0 0 0 4px var(--c-garage-soft), var(--shadow-1)`
                    : 'var(--shadow-1)',
                transition: 'all 0.35s ease',
                zIndex: 2,
              }}>
                {isDone
                  ? <CheckMini />
                  : <span style={{
                      fontSize: 10, fontWeight: 700,
                      fontFamily: 'var(--font-cp-mono)',
                      color: isFuture ? 'rgba(255,255,255,0.45)' : 'inherit',
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                }
              </div>

              {/* Label + subtitle below */}
              <div style={{
                position: 'absolute',
                top: ROAD_H + 4,
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                width: 140,
              }}>
                <div style={{
                  fontFamily: 'var(--font-cp-display)', fontWeight: 600, fontSize: 12,
                  color: isCurrent ? 'var(--stage-strong)' : isDone ? 'var(--ink-2)' : 'var(--muted)',
                  lineHeight: 1.3,
                  transition: 'color 0.35s ease',
                }}>
                  {node.label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-cp-mono)', fontSize: 11,
                  color: isCurrent ? 'var(--stage)' : 'var(--muted)',
                  opacity: 0.75,
                  marginTop: 2,
                  transition: 'color 0.35s ease',
                }}>
                  {node.subtitle}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Stage counter */}
      <span style={{
        flex: '0 0 auto', fontFamily: 'var(--font-cp-mono)',
        fontSize: 11, textTransform: 'uppercase',
        letterSpacing: '0.12em', color: 'var(--muted)',
      }}>
        {stageNum
          ? <><b style={{ color: 'var(--ink)' }}>Stage {stageNum}</b> / 3</>
          : <>— / 3</>
        }
      </span>
    </div>
  )
}
