import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, ChevronDown } from 'lucide-react'
import scenario from '../scenario.json'

type StageId = 'spark' | 'garage' | 'testTrack'

interface ChecklistPanelProps {
  open: boolean
  onClose: () => void
  activeStage: StageId | null
  completedStages: Record<StageId, boolean>
}

interface ChecklistItem {
  text: string
  done: boolean
  note?: string
  progress?: { done: number; total: number; showBar?: boolean }
}

const checklists = scenario.checklists as {
  stageOrder: StageId[]
  stages: Record<StageId, {
    title: string
    stageLabel: string
    locked?: boolean
    milesIntro: string
    items: ChecklistItem[]
  }>
}

/** Thin progress bar driven by done/total */
function ProgressBar({ done, total, accent }: { done: number; total: number; accent: string }) {
  const pct = total > 0 ? Math.max(0, Math.min(1, done / total)) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
      <div style={{ flex: 1, height: 5, borderRadius: 99, background: 'var(--bg-2)', overflow: 'hidden' }}>
        <div style={{ width: `${pct * 100}%`, height: '100%', background: accent, borderRadius: 99, transition: 'width 0.3s ease' }} />
      </div>
      <span style={{ fontFamily: 'var(--font-cp-mono)', fontSize: 11, fontWeight: 600, color: accent, flexShrink: 0 }}>
        {done}/{total}
      </span>
    </div>
  )
}

const STAGE_ACCENT: Record<StageId, string> = {
  spark:     '#F4B942',
  garage:    '#5B5FD9',
  testTrack: '#7A1420',
}

const STAGE_SOFT: Record<StageId, string> = {
  spark:     'rgba(244,185,66,0.12)',
  garage:    'rgba(91,95,217,0.10)',
  testTrack: 'rgba(122,20,32,0.08)',
}

export default function ChecklistPanel({ open, onClose, activeStage, completedStages }: ChecklistPanelProps) {
  const order = checklists.stageOrder

  // A stage's scripted "done" items only count once Ian has reached that stage.
  // Future stages (relative to the active one) are shown as still to-do, not complete.
  const activeIdx = activeStage ? order.indexOf(activeStage) : -1
  const isReached = (i: number) => i <= activeIdx || completedStages[order[i]] === true

  // The whole journey is unlocked, but only the ACTIVE stage is expanded by default;
  // the others are collapsed and individually expandable so Ian can peek at upcoming tasks.
  const defaultExpanded = () => new Set<StageId>([activeStage ?? order[0]])
  const [expanded, setExpanded] = useState<Set<StageId>>(defaultExpanded)

  const toggle = (id: StageId) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  // Reset to the active-stage-expanded default whenever the panel is (re)opened
  useEffect(() => {
    if (open) setExpanded(new Set<StageId>([activeStage ?? order[0]]))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeStage])

  // Esc closes the panel
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { e.stopPropagation(); onClose() }
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Dim overlay */}
          <motion.div
            key="checklist-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 70,
              background: 'rgba(34,31,28,0.32)',
              backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)',
            }}
          />

          {/* Slide-over panel */}
          <motion.aside
            key="checklist-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            role="dialog"
            aria-label="Journey checklist"
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 71,
              width: 408, maxWidth: '92vw',
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(20px) saturate(1.4)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
              borderLeft: '1px solid var(--border-strong)',
              boxShadow: '-12px 0 40px rgba(34,31,28,0.16)',
              display: 'flex', flexDirection: 'column',
              fontFamily: 'var(--font-cp-sans)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 22px 16px',
              borderBottom: '1px solid var(--border)',
            }}>
              <div>
                <div style={{
                  fontFamily: 'var(--font-cp-mono)', fontSize: 10,
                  textTransform: 'uppercase', letterSpacing: '0.16em',
                  color: 'var(--muted)', marginBottom: 3,
                }}>
                  Journey
                </div>
                <div style={{
                  fontFamily: 'var(--font-cp-display)', fontWeight: 600,
                  fontSize: 19, color: 'var(--ink)', lineHeight: 1,
                }}>
                  Checklist
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Close checklist"
                style={{
                  display: 'grid', placeItems: 'center',
                  width: 34, height: 34, borderRadius: 9,
                  background: 'var(--bg-2)', border: '1px solid var(--border)',
                  color: 'var(--muted)', cursor: 'pointer',
                }}
              >
                <X size={17} />
              </button>
            </div>

            {/* Stage list — minHeight:0 lets this flex child actually scroll instead of
                growing past the viewport and clipping the bottom rows/stages */}
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '14px 16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {order.map((stageId, i) => {
                const stage = checklists.stages[stageId]
                const isOpen = expanded.has(stageId)
                const isCurrent = activeStage === stageId
                const reached = isReached(i)
                const accent = STAGE_ACCENT[stageId]
                const total = stage.items.length
                // Only count items done once Ian has reached this stage
                const done = reached ? stage.items.filter((it) => it.done).length : 0

                return (
                  <div
                    key={stageId}
                    style={{
                      borderRadius: 16,
                      border: `1px solid ${isCurrent ? accent : 'var(--border)'}`,
                      background: isCurrent ? STAGE_SOFT[stageId] : '#fff',
                      overflow: 'hidden',
                      transition: 'border-color 0.2s, background 0.2s',
                    }}
                  >
                    {/* Stage header row — click to collapse/expand */}
                    <button
                      onClick={() => toggle(stageId)}
                      aria-expanded={isOpen}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                        padding: '14px 16px', background: 'transparent', border: 'none',
                        textAlign: 'left', cursor: 'pointer',
                      }}
                    >
                      {/* Stage marker */}
                      <span style={{
                        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                        display: 'grid', placeItems: 'center',
                        background: accent, color: '#fff',
                      }}>
                        <span style={{ fontFamily: 'var(--font-cp-mono)', fontSize: 11, fontWeight: 700 }}>{String(i + 1).padStart(2, '0')}</span>
                      </span>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)', lineHeight: 1.2 }}>
                          {stage.title}
                        </div>
                        <div style={{ fontFamily: 'var(--font-cp-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginTop: 3 }}>
                          {stage.stageLabel}
                        </div>
                      </div>

                      {/* "Now" tag for the current stage + progress count + collapse chevron */}
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        {isCurrent && (
                          <span style={{
                            fontFamily: 'var(--font-cp-mono)', fontSize: 9, fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                            color: '#fff', background: accent, borderRadius: 99, padding: '2px 7px',
                          }}>
                            Now
                          </span>
                        )}
                        <span style={{ fontFamily: 'var(--font-cp-mono)', fontSize: 11, fontWeight: 600, color: accent }}>
                          {done}/{total}
                        </span>
                        <ChevronDown size={15} style={{ color: 'var(--muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                      </span>
                    </button>

                    {/* Items (expanded, unlocked stages only) */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="items"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <ul style={{ listStyle: 'none', margin: 0, padding: '2px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {stage.items.map((it, j) => {
                              // Future stages: items render as still to-do (not complete) and no progress
                              const itemDone = reached && it.done
                              const showProgress = reached && !!it.progress
                              return (
                              <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                                {/* Checkbox (or partial-progress dot for in-progress items) */}
                                <span style={{
                                  width: 19, height: 19, borderRadius: 6, flexShrink: 0, marginTop: 1,
                                  display: 'grid', placeItems: 'center',
                                  background: itemDone ? accent : 'transparent',
                                  border: itemDone ? `1px solid ${accent}` : '1.5px solid var(--border-strong)',
                                }}>
                                  {itemDone && <Check size={13} color="#fff" strokeWidth={3} />}
                                  {!itemDone && showProgress && (
                                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: accent, opacity: 0.55 }} />
                                  )}
                                </span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{
                                    fontSize: 14, lineHeight: 1.4,
                                    color: itemDone ? 'var(--muted)' : 'var(--ink)',
                                    textDecoration: itemDone ? 'line-through' : 'none',
                                  }}>
                                    {it.text}
                                  </div>
                                  {showProgress && it.progress!.showBar && (
                                    <ProgressBar done={it.progress!.done} total={it.progress!.total} accent={accent} />
                                  )}
                                  {it.note && (
                                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, fontStyle: 'italic' }}>
                                      {it.note}
                                    </div>
                                  )}
                                </div>
                              </li>
                            )})}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
