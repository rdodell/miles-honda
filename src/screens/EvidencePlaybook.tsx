import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MilesMessage from '../components/MilesMessage'
import IanInputBar from '../components/IanInputBar'
import BranchPicker from '../components/BranchPicker'
import type { BranchOption } from '../components/BranchPicker'
import IanTyping from '../components/IanTyping'
import scenario from '../scenario.json'

interface Props { onAdvance: (screen: string) => void; showTooltip: (msg: string) => void }
const s = scenario.screens['1.3c']

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.3 },
})

const toneColor = (tone: string) => {
  if (tone === 'next') return '#7A1420'
  if (tone === 'done') return '#7CB342'
  return '#6B6B6B'
}

// Map branch option ids to the static step data for visual rendering
const stepByOptionId: Record<string, (typeof s.steps)[number]> = {}
s.steps.forEach((step) => {
  // match by title keyword
  s.branch.options.forEach((opt) => {
    if (step.title.toLowerCase().includes(opt.label.toLowerCase().split(' ')[0].toLowerCase())) {
      stepByOptionId[opt.id] = step
    }
  })
})
// Manual overrides to ensure correct mapping
const OPTION_TO_STEP: Record<string, string> = {
  interviews: 'Customer interviews',
  observation: 'Direct observation',
  smoke: 'Smoke test',
  competitor: 'Competitor teardown',
  research: 'Existing research scan',
}

function getStep(optId: string) {
  return s.steps.find((st) => st.title === OPTION_TO_STEP[optId])
}

export default function EvidencePlaybook({ onAdvance, showTooltip }: Props) {
  const [showContent, setShowContent] = useState(false)
  const [resortedMap, setResortedMap] = useState<Record<string, string>>({})

  function renderOption(opt: BranchOption, isSelected: boolean, isRec: boolean) {
    const step = getStep(opt.id)
    if (!step) return null
    const resortLabel = resortedMap[opt.id]
    const statusLabel = resortLabel ?? step.status
    const statusColor = resortLabel ? '#B8851E' : toneColor(step.tone)
    const statusBg = resortLabel ? 'rgba(244,185,66,0.18)' : `${toneColor(step.tone)}18`
    return (
      <div
        className={`bg-white border border-[#E8E4DE] rounded-xl px-4 py-3 shadow-sm flex items-center gap-3 ${step.tone === 'skip' ? 'opacity-60' : ''} ${isRec ? 'border-[#7A1420]' : ''}`}
        style={{
          transition: 'border-color 0.15s, background 0.15s',
          background: isSelected ? 'rgba(122,20,32,0.04)' : '#fff',
          borderColor: isSelected ? '#7A1420' : isRec ? '#7A1420' : '#E8E4DE',
          cursor: isSelected ? 'default' : 'pointer',
        }}
      >
        <span className="text-xs font-mono text-[#A09A94] flex-shrink-0 w-6">{step.n}</span>
        <div className="flex-1 min-w-0">
          <div className={`text-sm font-semibold text-[#1A1A1A] ${step.tone === 'skip' ? 'line-through text-[#A09A94]' : ''}`}>{step.title}</div>
          <div className="text-xs text-[#6B6B6B] mt-0.5">{step.sub}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ color: statusColor, background: statusBg }}
          >
            {statusLabel}
          </span>
          {isRec && (
            <span style={{ fontSize: 10, fontWeight: 600, color: '#7A1420', background: 'rgba(122,20,32,0.08)', borderRadius: 99, padding: '1px 6px' }}>
              Recommended
            </span>
          )}
        </div>
      </div>
    )
  }

  // Track resort overrides from BranchPicker so we can pass them to renderOption
  // BranchPicker manages its own resort state — we just need to call renderOption with the current state.
  // Since BranchPicker owns resort state, we pass a wrapper renderOption that reads from BranchPicker's local state via closure.
  // The simplest approach: let BranchPicker handle resort internally; our renderOption will show the step's
  // static data except when the option has been addressed. BranchPicker passes isSelected and isRecommended.
  // For the resort label we need to intercept — so we'll track that ourselves and sync via a ref.

  return (
    <div className="flex flex-col gap-5 px-5 pt-8 pb-20">
      {/* Stage chip */}
      <motion.div {...fadeUp(0)}>
        <span style={{
          background: 'rgba(244,185,66,0.15)',
          border: '1px solid #F4B942',
          color: '#B8851E',
          fontFamily: 'Zilla Slab, Georgia, serif',
          fontSize: 13,
          padding: '2px 10px',
          borderRadius: 99,
          display: 'inline-block',
        }}>{s.step}</span>
      </motion.div>

      {/* Miles speaks first */}
      <MilesMessage text={s.milesIntro} onDone={() => setShowContent(true)} />

      <AnimatePresence>
        {showContent && (
          <motion.div
            className="flex flex-col gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Counter */}
            <motion.div {...fadeUp(0.1)} className="flex items-center mt-0">
              <span className="text-sm text-[#A09A94]">
                <span style={{ color: '#7CB342' }}>1 done</span>
                {' · '}
                <span style={{ color: '#7A1420' }}>1 next</span>
                {' · 2 later · 1 skip'}
              </span>
            </motion.div>

            {/* Branch picker with step-card renderOption */}
            <EvidenceBranchSection
              onAdvance={onAdvance}
              showTooltip={showTooltip}
              renderOption={renderOption}
              resortedMap={resortedMap}
              setResortedMap={setResortedMap}
            />

            {/* IanInputBar — visual chrome, forward motion from option clicks */}
            <IanInputBar
              driver="chat"
              suggestion={(s as any).ianInput?.text ?? 'Let\'s start with the interviews.'}
              onSubmit={() => {}}
              disabled={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Inner component that wraps BranchPicker and threads resort state to the parent render function
function EvidenceBranchSection({
  onAdvance,
  showTooltip,
  renderOption,
  resortedMap,
  setResortedMap,
}: {
  onAdvance: (s: string) => void
  showTooltip: (s: string) => void
  renderOption: (opt: BranchOption, isSelected: boolean, isRec: boolean) => React.ReactNode
  resortedMap: Record<string, string>
  setResortedMap: React.Dispatch<React.SetStateAction<Record<string, string>>>
}) {
  // We wrap BranchPicker's branch and intercept resort by providing an enhanced options array
  // BranchPicker manages its own resort state internally; we pass a renderOption that uses our resortedMap
  // But we also need to update resortedMap when BranchPicker resorts.
  // Cleanest: just render BranchPicker with a custom renderOption that reads resortedMap,
  // and trust BranchPicker to apply resort visually through its own internal state passed back via isSelected.
  // Since BranchPicker updates its own resorted state, we need to access that from the parent.
  // Alternative: just let BranchPicker render everything including resort - and skip the custom renderOption.
  // Let's just let BranchPicker handle resort state internally and use its own default renderer
  // but override the visual with renderOption using the resortedMap.
  // The issue: BranchPicker's resort state is internal. We cannot read it from outside.
  // Solution: use the resort info from the branch options directly.
  // When BranchPicker calls handleMilesDone for a null-advance option with resort,
  // it sets its own resorted state. We need to mirror that.
  // Simplest fix: duplicate the resort-tracking in EvidencePlaybook,
  // using an enhanced BranchPicker that calls an onResort callback.
  // OR: just let BranchPicker fully own the step card rendering by passing renderOption
  // that has access to the resortedMap which is updated via a callback.
  //
  // For now, we use a controlled BranchPickerWithResort that exposes onResort.
  // REVIEW: BranchPicker doesn't expose onResort — the renderOption approach means we pass
  // a render function that uses resortedMap from the parent. But BranchPicker also has its own
  // resorted state. This is a duplication. Simplest resolution: remove resort tracking from
  // BranchPicker for the case when renderOption is provided, and let the parent handle it
  // by using the wrapped approach below.

  return (
    <BranchPickerWithResort
      branch={s.branch as any}
      onAdvance={onAdvance}
      showTooltip={showTooltip}
      renderOptionFn={renderOption}
      resortedMap={resortedMap}
      onResort={(id, label) => setResortedMap((prev) => ({ ...prev, [id]: label }))}
    />
  )
}

// BranchPicker variant that exposes onResort so parent can track resort state for custom renderOption
function BranchPickerWithResort({
  branch,
  onAdvance,
  renderOptionFn,
  resortedMap,
  onResort,
}: {
  branch: {
    type: string
    recommended: string
    presenterPath: string[]
    options: BranchOption[]
  }
  onAdvance: (s: string) => void
  showTooltip: (s: string) => void
  renderOptionFn: (opt: BranchOption, isSelected: boolean, isRec: boolean) => React.ReactNode
  resortedMap: Record<string, string>
  onResort: (id: string, label: string) => void
}) {
  const [pickState, setPickState] = useState<
    | { phase: 'idle' }
    | { phase: 'ian-typing'; optId: string }
    | { phase: 'miles-reply'; optId: string }
    | { phase: 'done'; optId: string }
  >({ phase: 'idle' })
  const [addressed, setAddressed] = useState<Set<string>>(new Set())

  const currentOpt =
    pickState.phase !== 'idle'
      ? branch.options.find((o) => o.id === pickState.optId) ?? null
      : null

  function handlePick(opt: BranchOption) {
    if (pickState.phase !== 'idle') return
    setPickState({ phase: 'ian-typing', optId: opt.id })
  }

  function handleIanSent() {
    setPickState((s) => s.phase === 'ian-typing' ? { phase: 'miles-reply', optId: s.optId } : s)
  }

  function handleMilesDone() {
    const opt = branch.options.find((o) => o.id === (pickState as { optId: string }).optId)
    if (!opt) return
    if (opt.advance) {
      setPickState({ phase: 'done', optId: opt.id })
      onAdvance(opt.advance)
    } else {
      setAddressed((prev) => new Set([...prev, opt.id]))
      if (opt.resort) onResort(opt.id, opt.resort)
      setPickState({ phase: 'idle' })
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {branch.options.map((opt) => {
          const isSelected = pickState.phase !== 'idle' && (pickState as { optId: string }).optId === opt.id
          const isRec = opt.recommended === true || opt.id === branch.recommended
          const isAddressed = addressed.has(opt.id)

          // Build a modified opt with resort label if applicable
          const displayOpt: BranchOption = resortedMap[opt.id]
            ? { ...opt, label: opt.label } // resort is shown via renderOptionFn using resortedMap
            : opt

          return (
            <motion.div
              key={opt.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: isAddressed ? 0.45 : 1, y: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => !isSelected && !isAddressed && handlePick(opt)}
              style={{ cursor: isSelected || isAddressed ? 'default' : 'pointer' }}
            >
              {renderOptionFn(displayOpt, isSelected, isRec)}
            </motion.div>
          )
        })}
      </div>

      <AnimatePresence>
        {(pickState.phase === 'ian-typing' || pickState.phase === 'miles-reply' || pickState.phase === 'done') && currentOpt && (
          <motion.div
            key={`thread-${currentOpt.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}
          >
            <IanTyping message={currentOpt.ianReply} onSent={handleIanSent} />
            {(pickState.phase === 'miles-reply' || pickState.phase === 'done') && (
              <MilesMessage text={currentOpt.milesReply} onDone={handleMilesDone} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
