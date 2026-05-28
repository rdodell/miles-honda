import { Zap, Wrench, TestTube2, Hammer } from 'lucide-react'

type StageId = 'spark' | 'garage' | 'testTrack'

interface BottomNavProps {
  currentStage: StageId | null
  completedStages: Record<StageId, boolean>
  onNavigate: (screenId: string) => void
  showTooltip: (msg: string) => void
}

const NAV_ITEMS = [
  { id: 'spark',     label: 'Spark',        icon: Zap,      entryScreen: '1.1' },
  { id: 'garage',    label: 'The Garage',   icon: Hammer,   entryScreen: '2.1' },
  { id: 'testTrack', label: 'Test Track',   icon: TestTube2,entryScreen: '3.1' },
  { id: 'tools',     label: 'Tools',        icon: Wrench,   entryScreen: 'T.1' },
]

// Stage semantic colors from the design system
const ACTIVE_COLORS: Record<string, string> = {
  spark:     'text-[#F4B942]',   // warm amber
  garage:    'text-[#5B5FD9]',   // dream indigo
  testTrack: 'text-[#CC0000]',   // honda red
  tools:     'text-[#CC0000]',
}

export default function BottomNav({ currentStage, completedStages, onNavigate, showTooltip }: BottomNavProps) {
  function handleClick(item: typeof NAV_ITEMS[0]) {
    if (item.id === 'tools') {
      onNavigate('T.1')
      return
    }
    const id = item.id as StageId
    if (id === currentStage) return // already here
    if (completedStages[id]) {
      showTooltip('Ian has already completed this stage.')
      return
    }
    showTooltip("Ian hasn't reached this stage yet.")
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex justify-around items-center h-14 z-40 max-w-4xl mx-auto"
      style={{ background: '#fff', borderTop: '2px solid #CC0000' }}
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive = item.id === currentStage || (item.id === 'tools' && currentStage === null)
        const color = isActive ? ACTIVE_COLORS[item.id] : 'text-[#6B6B6B]'

        return (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            className={`flex flex-col items-center gap-0.5 transition-colors hover:opacity-80 px-3 py-1 ${color}`}
          >
            <Icon size={18} />
            {/* Stage names use Fraunces for display label fidelity */}
            <span style={{
              fontSize: 11,
              fontWeight: isActive ? 600 : 500,
              fontFamily: item.id !== 'tools' ? 'Fraunces, Georgia, serif' : 'Inter, sans-serif',
            }}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
