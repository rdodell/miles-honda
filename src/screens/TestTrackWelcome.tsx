import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown } from 'lucide-react'
import MilesMessage from '../components/MilesMessage'
import IanInputBar from '../components/IanInputBar'
import BMCGrid from '../components/BMCGrid'
import scenario from '../scenario.json'
import { BEAT_AFTER_MILES, BEAT_BEFORE_ADVANCE } from '../timing'

interface Props { onAdvance: (screen: string) => void; showTooltip?: (msg: string) => void }

const s = scenario.screens['3.1']
const ianInput = (s as any).ianInput as { text: string }
const ianConfirm = (s as any).ianConfirm as { text: string }
const cmp = s.comparison
const tbl = s.updatedTable
const CONTENT_BEAT = 1400 // time to take in the canvas / proposal before moving on

// Flag -> Ian asks -> BMC grid -> Miles proposes update (PROPOSED comparison) ->
// Ian confirms -> ONLY THEN the model commits (margin lands at 24%) -> Miles close -> advance
const PHASES = ['flag', 'ian-input', 'bmc', 'propose', 'ian-confirm', 'commit', 'close'] as const
type Phase = (typeof PHASES)[number]

function IanBubble({ text }: { text: string }) {
  return (
    <motion.div className="flex justify-end" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ background: 'var(--ink)', color: '#fff', borderRadius: '14px 14px 4px 14px', padding: '10px 14px', fontSize: 14, fontFamily: 'var(--font-cp-sans)', maxWidth: '80%', lineHeight: 1.5, boxShadow: 'var(--shadow-1)' }}>
        {text}
      </div>
    </motion.div>
  )
}

// Margin counts from "before" to "after" — runs once the model commits
function AnimatedMargin({ before, after }: { before: string; after: string }) {
  const from = parseInt(before, 10)
  const to = parseInt(after, 10)
  const [val, setVal] = useState(from)
  useEffect(() => {
    let cur = from
    const id = setInterval(() => {
      cur += to > from ? 1 : -1
      setVal(cur)
      if (cur === to) clearInterval(id)
    }, 110)
    return () => clearInterval(id)
  }, [from, to])
  return <span className="text-xs text-[#CC0000] font-medium">Gross margin: {before} → {val}%</span>
}

export default function TestTrackWelcome({ onAdvance }: Props) {
  const [phase, setPhase] = useState<Phase>('flag')
  const reached = (p: Phase) => PHASES.indexOf(phase) >= PHASES.indexOf(p)
  const committed = reached('commit')

  // Content-view beats: pause on the canvas and on the committed model before continuing
  useEffect(() => {
    if (phase === 'bmc') { const t = setTimeout(() => setPhase('propose'), CONTENT_BEAT); return () => clearTimeout(t) }
    if (phase === 'commit') { const t = setTimeout(() => setPhase('close'), CONTENT_BEAT); return () => clearTimeout(t) }
  }, [phase])

  const activeIan =
    phase === 'ian-input' ? ianInput.text : phase === 'ian-confirm' ? ianConfirm.text : undefined

  function sendIan() {
    if (phase === 'ian-input') setPhase('bmc')
    else if (phase === 'ian-confirm') setPhase('commit')
  }

  return (
    <div className="flex flex-col gap-4 px-5 py-5 pb-20">
      {/* Miles flags the Cost Structure block */}
      <MilesMessage text={s.milesMessage} onDone={() => setTimeout(() => setPhase('ian-input'), BEAT_AFTER_MILES)} />

      {/* Ian's "show me what's off" (sent) */}
      {reached('bmc') && <IanBubble text={ianInput.text} />}

      {/* Business Model Canvas with the Cost Structure block flagged */}
      {reached('bmc') && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <BMCGrid flaggedSection={s.flaggedSection} flaggedLabel={s.flaggedTooltip} onSectionClick={() => {}} sectionTooltip={s.bmcSectionTooltip} />
        </motion.div>
      )}

      {/* Miles proposes plugging in the real numbers */}
      {reached('propose') && (
        <MilesMessage text={s.milesUpdateIntro} onDone={() => setTimeout(() => setPhase('ian-confirm'), BEAT_AFTER_MILES)} />
      )}

      {/* Comparison + cost table — PROPOSED until Ian confirms, then committed */}
      {reached('propose') && (
        <>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-[#E8E4DE] rounded-2xl p-4 shadow-sm">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-[#F2EEE8] rounded-xl p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-[#A09A94] mb-1">{cmp.original.label}</div>
                <div className="text-lg font-bold text-[#1A1A1A]">{cmp.original.value}</div>
                <div className="text-xs text-[#A09A94]">{cmp.original.note}</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 mb-1">
                  {committed ? cmp.updated.label : 'Proposed benchmark'}
                </div>
                <div className="text-lg font-bold text-amber-700">{cmp.updated.value}</div>
                <div className="text-xs text-amber-500">{cmp.updated.note}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-red-50 rounded-xl px-3 py-2">
              <TrendingDown size={14} className="text-[#CC0000]" />
              {committed ? (
                <AnimatedMargin before={cmp.marginBefore} after={cmp.marginAfter} />
              ) : (
                <span className="text-xs text-[#A09A94] font-medium">
                  Projected gross margin: {cmp.marginBefore} → {cmp.marginAfter}
                </span>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-[#E8E4DE] rounded-2xl p-4 shadow-sm">
            <p className="text-sm text-[#6B6570] mb-3">{tbl.intro}</p>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-semibold uppercase tracking-wide text-[#A09A94]">
                  <th className="text-left pb-2">Item</th>
                  <th className="text-right pb-2">Before</th>
                  <th className="text-right pb-2">{committed ? 'After' : 'Proposed'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E4DE]">
                {tbl.rows.map((row, i) => (
                  <tr key={i}>
                    <td className="py-2 text-[#1A1A1A]">{row.item}</td>
                    <td className="py-2 text-right text-[#A09A94]">{row.before}</td>
                    <td className="py-2 text-right font-semibold text-amber-700">{row.after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </>
      )}

      {/* Ian confirms the update (sent) */}
      {committed && <IanBubble text={ianConfirm.text} />}

      {/* Miles names 24% as the board's pressure point, teases the readiness check, then advances */}
      {reached('close') && (
        <MilesMessage text={s.milesClose} onDone={() => setTimeout(() => onAdvance(s.advance), BEAT_BEFORE_ADVANCE)} />
      )}

      {/* Input bar — Ian auto-sends "show me what's off", then "yes, update it"; passive otherwise */}
      {reached('ian-input') && (
        <IanInputBar
          driver="chat"
          placeholder="Ask Miles something…"
          suggestion={activeIan}
          onSubmit={activeIan ? sendIan : () => {}}
        />
      )}
    </div>
  )
}
