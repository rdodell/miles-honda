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

// Winding highway path — adapted from miles-honda for horizontal header strip
// ViewBox 800×80. Road winds: center → up at Spark → down at Garage → up at Test Track → center
const W = 800
const ROAD_PATH = "M 0,40 C 70,40 130,12 200,16 C 280,21 325,56 440,52 C 555,48 600,12 680,16 C 740,20 780,40 800,40"

// Stage dot positions on the path (hand-tuned to match path at 25/55/85%)
const STAGE_POSITIONS: Record<StageId, [number, number]> = {
  spark:     [200, 16],
  garage:    [440, 52],
  testTrack: [680, 16],
}

// Car position for active stage
const CAR_POSITIONS: Record<string, [number, number]> = {
  spark:     [200, 16],
  garage:    [440, 52],
  testTrack: [680, 16],
  none:      [0,   40],
}

// Build a partial road path up to a given x position (for progress highlight)
function progressPath(toX: number): string {
  if (toX <= 0) return ""
  if (toX >= 800) return ROAD_PATH
  // Rough linear clamp — good enough for the highlight
  return ROAD_PATH
}

export default function Road({ completedStages, activeStage, hero = false }: RoadProps) {
  const h = hero ? 110 : 82
  const allDone = completedStages.spark && completedStages.garage && completedStages.testTrack

  // Determine how far along the road progress has gone
  const progressStages = ['spark', 'garage', 'testTrack'] as StageId[]
  const lastCompleted = [...progressStages].reverse().find(s => completedStages[s])
  const carPos: [number, number] = activeStage
    ? CAR_POSITIONS[activeStage]
    : lastCompleted
      ? CAR_POSITIONS[lastCompleted]
      : CAR_POSITIONS.none

  const dotR = hero ? 11 : 8

  return (
    <div className={`w-full ${hero ? 'px-8 py-3' : 'px-4 py-1'}`}>
      <svg
        viewBox={`0 0 ${W} ${h}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full overflow-visible"
        style={{ height: hero ? 110 : 82 }}
      >
        {/* ── Road layers (miles-honda style) ── */}
        {/* Drop shadow */}
        <path d={ROAD_PATH} fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth={hero ? 20 : 14} strokeLinecap="round" />
        {/* Asphalt surface — honda-black */}
        <path d={ROAD_PATH} fill="none" stroke="#231F20" strokeWidth={hero ? 16 : 11} strokeLinecap="round" />
        {/* Road edge highlight */}
        <path d={ROAD_PATH} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={hero ? 17 : 12} strokeLinecap="round" />
        {/* Center dashes */}
        <path d={ROAD_PATH} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} strokeLinecap="round" strokeDasharray="16 12" />

        {/* Progress highlight (completed road in Honda red) */}
        {(lastCompleted || activeStage) && (
          <>
            <path d={ROAD_PATH} fill="none" stroke="rgba(204,0,0,0.3)" strokeWidth={hero ? 18 : 13} strokeLinecap="round"
              strokeDasharray={
                activeStage === 'spark'     ? "210 1000"
                : activeStage === 'garage' || lastCompleted === 'spark' ? "460 1000"
                : "720 1000"
              }
            />
            <path d={ROAD_PATH} fill="none" stroke="#CC0000" strokeWidth={1.5} strokeLinecap="round"
              strokeDasharray={
                activeStage === 'spark'     ? "210 1000"
                : activeStage === 'garage' || lastCompleted === 'spark' ? "460 1000"
                : "720 1000"
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
          const labelY = cy < 40
            ? cy - dotR - (hero ? 14 : 10)   // label above dot (dot is near top)
            : cy + dotR + (hero ? 14 : 10)    // label below dot (dot is near bottom)

          return (
            <g key={id}>
              {/* Glow ring for active */}
              {isActive && (
                <circle cx={cx} cy={cy} r={dotR + (hero ? 7 : 5)}
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
                <text x={cx} y={cy + (hero ? 4 : 3)} textAnchor="middle"
                  fontSize={hero ? 10 : 7} fill="white" fontWeight="900">✓</text>
              ) : (
                <text x={cx} y={cy + (hero ? 4 : 3)} textAnchor="middle"
                  fontSize={hero ? 9 : 6.5} fill="white" fontWeight="800"
                  fontFamily="monospace">
                  {id === 'spark' ? '01' : id === 'garage' ? '02' : '03'}
                </text>
              )}
              {/* Label — Caveat accent font for road milestone labels */}
              <text
                x={cx} y={labelY}
                textAnchor="middle"
                fontSize={hero ? 13 : 10}
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
          <text x={W * 0.88} y={16 - (hero ? 4 : 2)} fontSize={hero ? 20 : 14}>🏁</text>
        )}

        {/* ── Race car (miles-honda signature) ── */}
        {(activeStage || lastCompleted) && (
          <g
            transform={`translate(${carPos[0] - (hero ? 16 : 11)}, ${carPos[1] - (hero ? 16 : 11)})`}
            style={{ filter: 'drop-shadow(0 0 5px #CC0000)' }}
          >
            <text fontSize={hero ? 22 : 16} style={{ userSelect: 'none' }}>🏎️</text>
          </g>
        )}

        {/* ── START label ── */}
        <g transform="translate(4, 28)">
          <rect x={0} y={0} width={hero ? 38 : 28} height={hero ? 16 : 12} rx={3} fill="#CC0000" />
          <text x={hero ? 19 : 14} y={hero ? 11 : 8.5} textAnchor="middle" fill="white"
            fontSize={hero ? 7 : 5.5} fontWeight="800" fontFamily="monospace" letterSpacing="0.5">
            START
          </text>
        </g>
      </svg>
    </div>
  )
}
