import { Zap, Wrench, TestTube2, Hammer, Home } from 'lucide-react'

type StageId = 'spark' | 'garage' | 'testTrack'

interface BottomNavProps {
  currentStage: StageId | null
  completedStages: Record<StageId, boolean>
  currentScreen: string
  onNavigate: (screenId: string) => void
  showTooltip: (msg: string) => void
}

const NAV_ITEMS = [
  { id: 'home',      label: 'Home',          icon: Home,      entryScreen: 'D.1',  stageId: null },
  { id: 'spark',     label: 'The Spark',     icon: Zap,       entryScreen: '1.1',  stageId: 'spark' as StageId },
  { id: 'garage',    label: 'The Garage',    icon: Hammer,    entryScreen: '2.1',  stageId: 'garage' as StageId },
  { id: 'testTrack', label: 'Test Track',    icon: TestTube2, entryScreen: '3.1',  stageId: 'testTrack' as StageId },
  { id: 'tools',     label: 'Tools',         icon: Wrench,    entryScreen: 'T.1',  stageId: null },
]

const ACTIVE_COLORS: Record<string, string> = {
  home:      'text-[#1A1A1A]',
  spark:     'text-[#F4B942]',
  garage:    'text-[#5B5FD9]',
  testTrack: 'text-[#7A1420]',
  tools:     'text-[#7A1420]',
}

export default function BottomNav({ currentStage, completedStages, currentScreen, onNavigate, showTooltip }: BottomNavProps) {
  function handleClick(item: typeof NAV_ITEMS[0]) {
    if (item.id === 'home' || item.id === 'tools') {
      onNavigate(item.entryScreen)
      return
    }
    const id = item.stageId!
    // Already active: go to stage entry rather than doing nothing
    if (id === currentStage) {
      onNavigate(item.entryScreen)
      return
    }
    if (completedStages[id]) {
      showTooltip('Ian has already completed this stage.')
      return
    }
    showTooltip("Ian hasn't reached this stage yet.")
  }

  const activeItem =
    currentScreen === 'D.1'  ? 'home'
    : currentScreen === 'T.1' ? 'tools'
    : currentStage ?? 'home'

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 flex justify-around items-center h-14 z-40 max-w-4xl mx-auto"
      style={{ background: '#fff', borderTop: `2px solid #7A1420` }}
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive = item.id === activeItem
        const color = isActive ? ACTIVE_COLORS[item.id] : 'text-[#6B6B6B]'

        return (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            className={`flex flex-col items-center gap-0.5 transition-colors hover:opacity-80 px-2 py-1 ${color}`}
          >
            <Icon size={17} />
            <span style={{
              fontSize: 10,
              fontWeight: isActive ? 600 : 500,
              fontFamily: item.stageId ? 'Zilla Slab, Georgia, serif' : 'Inter, sans-serif',
            }}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
