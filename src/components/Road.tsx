import scenario from '../scenario.json'

type StageId = 'spark' | 'garage' | 'testTrack'

interface RoadProps {
  completedStages: Record<StageId, boolean>
  activeStage: StageId | null
  hero?: boolean
}

const STAGE_COLORS: Record<StageId, string> = {
  spark:     '#F4B942',
  garage:    '#5B5FD9',
  testTrack: '#CC0000',
}

// Winding road: centered across W=1600, dots at x=320/800/1280, path runs x=120..1480
const W = 1600
const H = 220   // taller viewBox to give labels room below the road

const ROAD_PATH =
  'M 120,88 C 180,88 250,60 320,64 C 420,69 620,104 800,100 C 960,96 1100,60 1280,64 C 1360,68 1440,88 1480,88'

// Stage dot positions � evenly spaced, centered in the 1600-wide canvas
const STAGE_POSITIONS: Record<StageId, [number, number]> = {
  spark:     [320,  64],
  garage:    [800,  100],
  testTrack: [1280, 64],
}

// Car position for active stage
const CAR_POSITIONS: Record<string, [number, number]> = {
  spark:     [320,  64],
  garage:    [800,  100],
  testTrack: [1280, 64],
  none:      [120,  88],
}

export default function Road({ completedStages, activeStage, hero = false }: RoadProps) {
  const allDone = completedStages.spark && completedStages.garage && completedStages.testTrack

  const progressStages = ['spark', 'garage', 'testTrack'] as StageId[]
  const lastCompleted = [...progressStages].reverse().find(s => completedStages[s])
  const carPos: [number, number] = activeStage
    ? CAR_POSITIONS[activeStage]
    : lastCompleted
      ? CAR_POSITIONS[lastCompleted]
      : CAR_POSITIONS.none

  const dotR    = hero ? 26 : 24
  const labelFs = hero ? 38 : 35

  return (
    <div style={{ width: '100%', height: '25vh', minHeight: '120px' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible"
        style={{ width: '100%', height: '100%' }}
      >
        {/* ── Road layers ── */}
        <path d={ROAD_PATH} fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth={52} strokeLinecap="round" />
        <path d={ROAD_PATH} fill="none" stroke="#231F20"           strokeWidth={44} strokeLinecap="round" />
        <path d={ROAD_PATH} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={46} strokeLinecap="round" />
        <path d={ROAD_PATH} fill="none" stroke="rgba(255,255,255,0.5)"  strokeWidth={4} strokeLinecap="round" strokeDasharray="22 16" />

        {/* ── Progress highlight (Honda red) ── */}
        {(lastCompleted || activeStage) && (
          <>
            <path d={ROAD_PATH} fill="none" stroke="rgba(204,0,0,0.3)" strokeWidth={40} strokeLinecap="round"
              strokeDasharray={
                activeStage === 'spark'     ? '220 2000'
                : activeStage === 'garage' || lastCompleted === 'spark' ? '720 2000'
                : '1400 2000'
              }
            />
            <path d={ROAD_PATH} fill="none" stroke="#CC0000" strokeWidth={4} strokeLinecap="round"
              strokeDasharray={
                activeStage === 'spark'     ? '220 2000'
                : activeStage === 'garage' || lastCompleted === 'spark' ? '720 2000'
                : '1400 2000'
              }
            />
          </>
        )}

        {/* ── Stage dots + labels ── */}
        {scenario.roadStages.map((stage) => {
          const id = stage.id as StageId
          const [cx, cy] = STAGE_POSITIONS[id]
          const isActive    = activeStage === id
          const isCompleted = completedStages[id]
          const color = STAGE_COLORS[id]
          // Labels always below the dot � clear of the road surface
          const labelY = cy + dotR + 44

          return (
            <g key={id}>
              {/* Glow ring */}
              {isActive && (
                <circle cx={cx} cy={cy} r={dotR + 14}
                  fill={color} opacity={0.18} className="pulse-dot" />
              )}
              {/* Outer ring */}
              <circle cx={cx} cy={cy} r={dotR + 4}
                fill={isActive || isCompleted ? color : '#555'}
                opacity={isActive || isCompleted ? 1 : 0.4}
                className={isActive ? 'pulse-dot' : ''}
              />
              {/* Inner dot */}
              <circle cx={cx} cy={cy} r={dotR}
                fill={isCompleted || isActive ? color : '#888'}
                stroke={isCompleted || isActive ? '#fff' : 'none'}
                strokeWidth={3}
              />
              {/* Check or number */}
              {isCompleted ? (
                <text x={cx} y={cy + 4} textAnchor="middle"
                  fontSize={20} fill="white" fontWeight="900">&#10003;</text>
              ) : (
                <text x={cx} y={cy + 4} textAnchor="middle"
                  fontSize={20} fill="white" fontWeight="800" fontFamily="monospace">
                  {id === 'spark' ? '01' : id === 'garage' ? '02' : '03'}
                </text>
              )}
              {/* Stage label � Inter 700, size 35 */}
              <text
                x={cx} y={labelY}
                textAnchor="middle"
                fontSize={labelFs}
                fill={isActive || isCompleted ? color : '#999'}
                fontFamily="'Oswald', 'Arial Narrow', sans-serif"
                fontWeight="400"
                letterSpacing="1"
              >
                {stage.label}
              </text>
            </g>
          )
        })}

        {/* ── Finish flag ── */}
        {allDone && (
          <text x={W * 0.88} y={52} fontSize={36}>&#127937;</text>
        )}

        {/* ── Race car ── */}
        {(activeStage || lastCompleted) && (
          <g
            transform={`translate(${carPos[0] - 28}, ${carPos[1] - 28})`}
            style={{ filter: 'drop-shadow(0 0 5px #CC0000)' }}
          >
            <text fontSize={56} style={{ userSelect: "none" }}>&#127950;</text>
          </g>
        )}

        {/* ── START badge � just left of road start at x≈120 ── */}
        <g transform="translate(20, 66)">
          <rect x={0} y={0} width={130} height={42} rx={7} fill="#CC0000" />
          <text x={65} y={28} textAnchor="middle" fill="white"
            fontSize={20} fontWeight="800" fontFamily="monospace" letterSpacing="0.5">
            START
          </text>
        </g>
      </svg>
    </div>
  )
}
