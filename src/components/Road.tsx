import scenario from '../scenario.json'
import iconSpark     from '../assets/icon-spark.png'
import iconHandshake from '../assets/icon-handshake.png'
import iconGauge     from '../assets/icon-gauge.png'

type StageId = 'spark' | 'garage' | 'testTrack'

interface RoadProps {
  completedStages: Record<StageId, boolean>
  activeStage: StageId | null
  hero?: boolean
}

const STAGE_ICONS: Record<StageId, string> = {
  spark:     iconSpark,
  garage:    iconHandshake,
  testTrack: iconGauge,
}

const STAGE_COLORS: Record<StageId, string> = {
  spark:     '#F4B942',
  garage:    '#5B5FD9',
  testTrack: '#7A1420', // burgundy
}

const W = 1600
const H = 260

const ROAD_PATH =
  'M 120,88 C 180,88 250,60 320,64 C 420,69 620,104 800,100 C 960,96 1100,60 1280,64 C 1360,68 1440,88 1480,88'

const STAGE_POSITIONS: Record<StageId, [number, number]> = {
  spark:     [320,  64],
  garage:    [800,  100],
  testTrack: [1280, 64],
}

const CAR_POSITIONS: Record<string, [number, number]> = {
  spark:     [320,  64],
  garage:    [800,  100],
  testTrack: [1280, 64],
  none:      [120,  88],
}

// Dash lengths that roughly cover each stage's portion of the path
const STAGE_DASH: Record<string, string> = {
  spark:     '220 2000',
  garage:    '720 2000',
  testTrack: '1400 2000',
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

  // Pick highlight color: active stage color, or last completed stage color
  const highlightStage = activeStage ?? lastCompleted
  const highlightColor = highlightStage ? STAGE_COLORS[highlightStage] : '#7A1420'

  // Dash length for highlight
  const dashKey = activeStage ?? (lastCompleted === 'spark' ? 'spark' : lastCompleted === 'garage' ? 'garage' : lastCompleted === 'testTrack' ? 'testTrack' : null)
  const dash = dashKey ? STAGE_DASH[dashKey] : null

  const dotR      = hero ? 26 : 24
  const labelFs   = hero ? 28 : 26
  const subtitleFs = hero ? 20 : 18

  return (
    <div style={{ width: '100%', height: '25vh', minHeight: '120px' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Road layers */}
        <path d={ROAD_PATH} fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth={52} strokeLinecap="round" />
        <path d={ROAD_PATH} fill="none" stroke="#231F20"           strokeWidth={44} strokeLinecap="round" />
        <path d={ROAD_PATH} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={46} strokeLinecap="round" />
        <path d={ROAD_PATH} fill="none" stroke="rgba(255,255,255,0.5)"  strokeWidth={4}  strokeLinecap="round" strokeDasharray="22 16" />

        {/* Progress highlight — tracks active stage color */}
        {dash && (
          <>
            <path d={ROAD_PATH} fill="none"
              stroke={highlightColor} strokeOpacity={0.28} strokeWidth={40}
              strokeLinecap="round" strokeDasharray={dash}
            />
            <path d={ROAD_PATH} fill="none"
              stroke={highlightColor} strokeWidth={4}
              strokeLinecap="round" strokeDasharray={dash}
            />
          </>
        )}

        {/* Stage dots + labels */}
        {scenario.roadStages.map((stage) => {
          const id = stage.id as StageId
          const [cx, cy] = STAGE_POSITIONS[id]
          const isActive    = activeStage === id
          const isCompleted = completedStages[id]
          const color = STAGE_COLORS[id]
          const icon  = STAGE_ICONS[id]
          const labelY = cy + dotR + 44
          const iconSize = dotR * 1.3

          return (
            <g key={id}>
              <defs>
                <clipPath id={`clip-${id}`}>
                  <circle cx={cx} cy={cy} r={dotR} />
                </clipPath>
              </defs>
              {isActive && (
                <circle cx={cx} cy={cy} r={dotR + 14}
                  fill={color} opacity={0.18} className="pulse-dot" />
              )}
              <circle cx={cx} cy={cy} r={dotR + 4}
                fill={isActive || isCompleted ? color : '#555'}
                opacity={isActive || isCompleted ? 1 : 0.4}
                className={isActive ? 'pulse-dot' : ''}
              />
              <circle cx={cx} cy={cy} r={dotR}
                fill={isCompleted || isActive ? color : '#888'}
                stroke={isCompleted || isActive ? '#fff' : 'none'}
                strokeWidth={3}
              />
              {isCompleted ? (
                <text x={cx} y={cy + 4} textAnchor="middle"
                  fontSize={20} fill="white" fontWeight="900">&#10003;</text>
              ) : (
                <image
                  href={icon}
                  x={cx - iconSize / 2}
                  y={cy - iconSize / 2}
                  width={iconSize}
                  height={iconSize}
                  clipPath={`url(#clip-${id})`}
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              )}
              <text
                x={cx} y={labelY}
                textAnchor="middle"
                fontSize={labelFs}
                fill={isActive || isCompleted ? color : '#999'}
                fontFamily="Zilla Slab, Georgia, serif"
                fontWeight="400"
                letterSpacing="1"
              >
                {stage.label}
              </text>
              {stage.subtitle && (
                <text
                  x={cx} y={labelY + labelFs + 6}
                  textAnchor="middle"
                  fontSize={subtitleFs}
                  fill={isActive || isCompleted ? color : '#777'}
                  fontFamily="Zilla Slab, Georgia, serif"
                  fontWeight="400"
                  opacity={0.75}
                >
                  {stage.subtitle}
                </text>
              )}
            </g>
          )
        })}

        {/* Finish flag */}
        {allDone && (
          <text x={W * 0.88} y={52} fontSize={36}>&#127937;</text>
        )}

        {/* Race car */}
        {(activeStage || lastCompleted) && (
          <g
            transform={`translate(${carPos[0] - 28}, ${carPos[1] - 28})`}
            style={{ filter: `drop-shadow(0 0 5px ${highlightColor})` }}
          >
            <text fontSize={56} style={{ userSelect: 'none' }}>&#127950;</text>
          </g>
        )}

        {/* START badge */}
        <g transform="translate(20, 66)">
          <rect x={0} y={0} width={130} height={42} rx={7} fill="#7A1420" />
          <text x={65} y={28} textAnchor="middle" fill="white"
            fontSize={20} fontWeight="800" fontFamily="monospace" letterSpacing="0.5">
            START
          </text>
        </g>
      </svg>
    </div>
  )
}
