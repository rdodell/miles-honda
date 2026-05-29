import scenario from '../scenario.json'

type StageId = 'spark' | 'garage' | 'testTrack'

interface RoadProps {
  completedStages: Record<StageId, boolean>
  activeStage: StageId | null
  hero?: boolean
}

const STAGE_COLORS: Record<StageId, string> = {
  spark:     '#F4B942',   // warm amber — a literal spark
  garage:    '#5B5FD9',   // dream indigo — the people stage
  testTrack: '#CC0000',   // honda red — earns the brand color
}

// Winding highway path — viewBox 400×160.
// x-coords are half the original 800-wide path; y-coords shifted +48 to centre
// the road content (originally y≈12–52) within the taller 160px box.
const W = 400
const H = 160
const ROAD_PATH =
  'M 0,88 C 35,88 65,60 100,64 C 140,69 162,104 220,100 C 277,96 300,60 340,64 C 370,68 390,88 400,88'

// Stage dot positions (x÷2, y+48 from original)
const STAGE_POSITIONS: Record<StageId, [number, number]> = {
  spark:     [100, 64],
  garage:    [220, 100],
  testTrack: [340, 64],
}

// Car position for active stage
const CAR_POSITIONS: Record<string, [number, number]> = {
  spark:     [100, 64],
  garage:    [220, 100],
  testTrack: [340, 64],
  none:      [0,   88],
}

export default function Road({ completedStages, activeStage }: RoadProps) {
  const allDone = completedStages.spark && completedStages.garage && completedStages.testTrack

  const progressStages = ['spark', 'garage', 'testTrack'] as StageId[]
  const lastCompleted = [...progressStages].reverse().find(s => completedStages[s])
  const carPos: [number, number] = activeStage
    ? CAR_POSITIONS[activeStage]
    : lastCompleted
      ? CAR_POSITIONS[lastCompleted]
      : CAR_POSITIONS.none

  // Dot radius — larger now that elements render at ~1× scale
  const dotR = 12

  return (
    <div style={{ width: '100%', height: '25vh', minHeight: '120px' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible"
        style={{ width: '100%', height: '100%' }}
      >
        {/* ── Road layers ── */}
        {/* Drop shadow */}
        <path d={ROAD_PATH} fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth={18} strokeLinecap="round" />
        {/* Asphalt surface */}
        <path d={ROAD_PATH} fill="none" stroke="#231F20" strokeWidth={14} strokeLinecap="round" />
        {/* Road edge highlight */}
        <path d={ROAD_PATH} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={15} strokeLinecap="round" />
        {/* Centre dashes */}
        <path d={ROAD_PATH} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} strokeLinecap="round" strokeDasharray="8 6" />

        {/* Progress highlight (completed road in Honda red) */}
        {(lastCompleted || activeStage) && (
          <>
            <path d={ROAD_PATH} fill="none" stroke="rgba(204,0,0,0.3)" strokeWidth={13} strokeLinecap="round"
              strokeDasharray={
                activeStage === 'spark'     ? '105 1000'
                : activeStage === 'garage' || lastCompleted === 'spark' ? '230 1000'
                : '360 1000'
              }
            />
            <path d={ROAD_PATH} fill="none" stroke="#CC0000" strokeWidth={1.5} strokeLinecap="round"
              strokeDasharray={
                activeStage === 'spark'     ? '105 1000'
                : activeStage === 'garage' || lastCompleted === 'spark' ? '230 1000'
                : '360 1000'
              }
            />
          </>
        )}

        {/* ── Stage dots ── */}
        {scenario.roadStages.map((stage) => {
          const id = stage.id as StageId
          const [cx, cy] = STAGE_POSITIONS[id]
          const isActive    = activeStage === id
          const isCompleted = completedStages[id]
          const color = STAGE_COLORS[id]
          // Labels above dots near top of road, below for garage (near bottom)
          const labelY = cy < 88
            ? cy - dotR - 16
            : cy + dotR + 16

          return (
            <g key={id}>
              {/* Glow ring for active */}
              {isActive && (
                <circle cx={cx} cy={cy} r={dotR + 7}
                  fill={color} opacity={0.18} className="pulse-dot" />
              )}
              {/* Outer ring */}
              <circle cx={cx} cy={cy} r={dotR + 2}
                fill={isActive || isCompleted ? color : '#555'}
                opacity={isActive || isCompleted ? 1 : 0.4}
                className={isActive ? 'pulse-dot' : ''}
              />
              {/* Inner dot */}
              <circle cx={cx} cy={cy} r={dotR}
                fill={isCompleted || isActive ? color : '#888'}
                stroke={isCompleted || isActive ? '#fff' : 'none'}
                strokeWidth={1.5}
              />
              {/* Check or number */}
              {isCompleted ? (
                <text x={cx} y={cy + 4} textAnchor="middle"
                  fontSize={9} fill="white" fontWeight="900">✓</text>
              ) : (
                <text x={cx} y={cy + 4} textAnchor="middle"
                  fontSize={9} fill="white" fontWeight="800"
                  fontFamily="monospace">
                  {id === 'spark' ? '01' : id === 'garage' ? '02' : '03'}
                </text>
              )}
              {/* Stage label — Caveat accent font */}
              <text
                x={cx} y={labelY}
                textAnchor="middle"
                fontSize={15}
                fill={isActive || isCompleted ? color : '#999'}
                fontFamily="'Caveat', cursive"
                fontWeight="600"
              >
                {stage.label}
              </text>
            </g>
          )
        })}

        {/* ── Finish flag ── */}
        {allDone && (
          <text x={W * 0.88} y={52} fontSize={22}>🏁</text>
        )}

        {/* ── Race car ── */}
        {(activeStage || lastCompleted) && (
          <g
            transform={`translate(${carPos[0] - 11}, ${carPos[1] - 11})`}
            style={{ filter: 'drop-shadow(0 0 5px #CC0000)' }}
          >
            <text fontSize={22} style={{ userSelect: 'none' }}>🏎️</text>
          </g>
        )}

        {/* ── START badge ── */}
        <g transform="translate(2, 72)">
          <rect x={0} y={0} width={44} height={18} rx={4} fill="#CC0000" />
          <text x={22} y={13} textAnchor="middle" fill="white"
            fontSize={8} fontWeight="800" fontFamily="monospace" letterSpacing="0.5">
            START
          </text>
        </g>
      </svg>
    </div>
  )
}
