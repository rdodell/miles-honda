import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, Check } from 'lucide-react'
import scenario from '../scenario.json'

type StageId = 'spark' | 'garage' | 'testTrack'

interface ChecklistPanelProps {
  open: boolean
  onClose: () => void
  activeStage: StageId | null
  completedStages: Record<StageId, boolean>
}

const checklists = scenario.checklists as {
  stageOrder: StageId[]
  stages: Record<StageId, {
    title: string
    stageLabel: string
    locked?: boolean
    milesIntro: string
    items: { text: string; done: boolean; note?: string }[]
  }>
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

  // How far Ian has progressed: max of active-stage index and highest completed index
  const activeIdx = activeStage ? order.indexOf(activeStage) : -1
  const completedIdx = order.reduce((acc, s, i) => (completedStages[s] ? i : acc), -1)
  const reachedIdx = Math.max(activeIdx, completedIdx)

  const isLocked = (i: number) => i > reachedIdx

  // Which stage is expanded — default to the active stage (or the furthest reached, else first)
  const defaultExpanded: StageId =
    activeStage ?? (reachedIdx >= 0 ? order[reachedIdx] : order[0])
  const [expanded, setExpanded] = useState<StageId>(defaultExpanded)

  // Re-sync the expanded stage whenever the panel is (re)opened or the active stage changes
  useEffect(() => {
    if (open) setExpanded(defaultExpanded)
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

            {/* Stage list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {order.map((stageId, i) => {
                const stage = checklists.stages[stageId]
                const locked = isLocked(i)
                const isOpen = expanded === stageId && !locked
                const accent = STAGE_ACCENT[stageId]
                const done = stage.items.filter((it) => it.done).length
                const total = stage.items.length

                return (
                  <div
                    key={stageId}
                    style={{
                      borderRadius: 16,
                      border: `1px solid ${isOpen ? accent : 'var(--border)'}`,
                      background: isOpen ? STAGE_SOFT[stageId] : '#fff',
                      overflow: 'hidden',
                      opacity: locked ? 0.6 : 1,
                      transition: 'border-color 0.2s, background 0.2s',
                    }}
                  >
                    {/* Stage header row */}
                    <button
                      onClick={() => { if (!locked) setExpanded(stageId) }}
                      disabled={locked}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                        padding: '14px 16px', background: 'transparent', border: 'none',
                        textAlign: 'left', cursor: locked ? 'default' : 'pointer',
                      }}
                    >
                      {/* Stage marker */}
                      <span style={{
                        width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                        display: 'grid', placeItems: 'center',
                        background: locked ? 'var(--bg-2)' : accent,
                        color: locked ? 'var(--muted)' : '#fff',
                      }}>
                        {locked
                          ? <Lock size={13} />
                          : <span style={{ fontFamily: 'var(--font-cp-mono)', fontSize: 11, fontWeight: 700 }}>{String(i + 1).padStart(2, '0')}</span>}
                      </span>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink)', lineHeight: 1.2 }}>
                          {stage.title}
                        </div>
                        <div style={{ fontFamily: 'var(--font-cp-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', marginTop: 3 }}>
                          {stage.stageLabel}
                        </div>
                      </div>

                      {/* Progress / lock badge */}
                      {locked ? (
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', flexShrink: 0 }}>Locked</span>
                      ) : (
                        <span style={{
                          fontFamily: 'var(--font-cp-mono)', fontSize: 11, fontWeight: 600,
                          color: accent, flexShrink: 0,
                        }}>
                          {done}/{total}
                        </span>
                      )}
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
                            {stage.items.map((it, j) => (
                              <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                                {/* Checkbox */}
                                <span style={{
                                  width: 19, height: 19, borderRadius: 6, flexShrink: 0, marginTop: 1,
                                  display: 'grid', placeItems: 'center',
                                  background: it.done ? accent : 'transparent',
                                  border: it.done ? `1px solid ${accent}` : '1.5px solid var(--border-strong)',
                                }}>
                                  {it.done && <Check size={13} color="#fff" strokeWidth={3} />}
                                </span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{
                                    fontSize: 14, lineHeight: 1.4,
                                    color: it.done ? 'var(--muted)' : 'var(--ink)',
                                    textDecoration: it.done ? 'line-through' : 'none',
                                  }}>
                                    {it.text}
                                  </div>
                                  {it.note && (
                                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, fontStyle: 'italic' }}>
                                      {it.note}
                                    </div>
                                  )}
                                </div>
                              </li>
                            ))}
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
