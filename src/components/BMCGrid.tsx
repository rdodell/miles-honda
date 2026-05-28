import { motion } from 'framer-motion'

interface BMCGridProps {
  updatedSections?: string[]
  updateLabels?: Record<string, string>
  flaggedSection?: string
  flaggedLabel?: string
  onSectionClick?: (section: string) => void
  sectionTooltip?: string
  compact?: boolean
}

// Classic BMC layout: 9 sections
// Row 1: Key Partners | Key Activities | Value Proposition | Customer Relationships | Customer Segments
//                      Key Resources  |                   | Channels              |
// Row 2: Cost Structure                                    | Revenue Streams
const BMC_CONTENT: Record<string, { bullets: string[] }> = {
  'Key Partners': {
    bullets: ['Honda procurement', "Priya's battery supplier contacts", 'Regional service networks'],
  },
  'Key Activities': {
    bullets: ['Product dev', 'Customer validation', 'Distribution partnerships'],
  },
  'Value Proposition': {
    bullets: ['Quiet electric mower', 'Gas-equivalent runtime', 'Trusted service network'],
  },
  'Customer Relationships': {
    bullets: ['Direct sales', 'Facebook communities', 'Trade show demos'],
  },
  'Customer Segments': {
    bullets: ['Laura (sole-entrepreneur landscapers)', 'Matt (commercial property)', 'Diana (DIY homeowner)'],
  },
  'Key Resources': {
    bullets: ['Honda engineering', 'Battery IP', 'Brand trust'],
  },
  'Channels': {
    bullets: ['Direct B2B outreach', 'Equipment dealers', 'Online'],
  },
  'Cost Structure': {
    bullets: ['Battery cells $103/unit', 'Motor controller $46/unit', 'Frame & deck $23/unit'],
  },
  'Revenue Streams': {
    bullets: ['Unit sales ($X ASP)', 'Service contracts', 'Fleet leasing (future)'],
  },
}


interface CellProps {
  section: string
  colSpan?: number
  rowSpan?: number
  isUpdated: boolean
  isFlagged: boolean
  updateLabel?: string
  flaggedLabel?: string
  onClick?: () => void
  tooltip?: string
  compact: boolean
}

function Cell({ section, colSpan = 1, rowSpan = 1, isUpdated, isFlagged, updateLabel, flaggedLabel, onClick, tooltip, compact }: CellProps) {
  const [showTip, setShowTip] = useState(false)
  const content = BMC_CONTENT[section]

  function handleClick() {
    if (onClick) { onClick(); return }
    if (tooltip) {
      setShowTip(true)
      setTimeout(() => setShowTip(false), 2000)
    }
  }

  return (
    <div
      className={`
        relative border border-[#E8E4DE] rounded-xl p-2 overflow-hidden
        ${colSpan > 1 ? `col-span-${colSpan}` : ''}
        ${rowSpan > 1 ? `row-span-${rowSpan}` : ''}
        ${isFlagged ? 'ring-2 ring-yellow-400 cursor-pointer hover:bg-yellow-50 transition-colors' : ''}
        ${isUpdated ? 'bg-blue-50' : 'bg-white'}
        ${onClick ? 'cursor-pointer' : tooltip ? 'cursor-pointer' : ''}
      `}
      style={{ gridColumn: colSpan > 1 ? `span ${colSpan}` : undefined, gridRow: rowSpan > 1 ? `span ${rowSpan}` : undefined }}
      onClick={handleClick}
    >
      <div className="text-[10px] font-semibold text-[#A09A94] uppercase tracking-wide mb-1">{section}</div>
      {!compact && content.bullets.map((b, i) => (
        <div key={i} className="text-[10px] text-[#1A1A1A] leading-tight mb-0.5">· {b}</div>
      ))}

      {/* Updated badge */}
      {isUpdated && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-1 right-1 bg-[#42A5F5] text-white text-[8px] font-semibold rounded-full px-1.5 py-0.5"
        >
          updated
        </motion.div>
      )}

      {/* Flagged badge */}
      {isFlagged && (
        <div className="mt-1 flex items-center gap-1">
          <span className="text-yellow-500 text-xs">⚠</span>
          <span className="text-[9px] text-yellow-700 font-medium">{flaggedLabel || 'Miles flagged this'}</span>
        </div>
      )}

      {/* Update label */}
      {isUpdated && updateLabel && (
        <div className="text-[9px] text-[#42A5F5] mt-1 italic">{updateLabel}</div>
      )}

      {/* Tooltip */}
      {showTip && tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-50 whitespace-nowrap bg-[#1A1A1A] text-white text-xs rounded-lg px-2 py-1 shadow-lg pointer-events-none">
          {tooltip}
        </div>
      )}
    </div>
  )
}

// Need useState for Cell — import it
import { useState } from 'react'

export default function BMCGrid({ updatedSections = [], updateLabels = {}, flaggedSection, flaggedLabel, onSectionClick, sectionTooltip, compact = false }: BMCGridProps) {

  return (
    <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(5, 1fr)', gridTemplateRows: compact ? 'repeat(3, auto)' : 'repeat(3, minmax(60px, auto))' }}>
      {/* Row 1 + 2 sections */}
      <Cell
        section="Key Partners"
        rowSpan={2}
        isUpdated={updatedSections.includes('Key Partners')}
        isFlagged={flaggedSection === 'Key Partners'}
        updateLabel={updateLabels['Key Partners']}
        flaggedLabel={flaggedLabel}
        onClick={flaggedSection === 'Key Partners' ? () => onSectionClick?.('Key Partners') : undefined}
        tooltip={sectionTooltip}
        compact={compact}
      />
      <Cell section="Key Activities"    isUpdated={updatedSections.includes('Key Activities')}    isFlagged={false} tooltip={sectionTooltip} compact={compact} />
      <Cell section="Value Proposition" rowSpan={2} isUpdated={updatedSections.includes('Value Proposition')} isFlagged={false} tooltip={sectionTooltip} compact={compact} />
      <Cell section="Customer Relationships" isUpdated={updatedSections.includes('Customer Relationships')} isFlagged={false} tooltip={sectionTooltip} compact={compact} />
      <Cell section="Customer Segments" rowSpan={2} isUpdated={updatedSections.includes('Customer Segments')} isFlagged={false} tooltip={sectionTooltip} compact={compact} />
      {/* Row 2 continuation */}
      <Cell section="Key Resources" isUpdated={updatedSections.includes('Key Resources')} isFlagged={false} tooltip={sectionTooltip} compact={compact} />
      <Cell section="Channels" isUpdated={updatedSections.includes('Channels')} isFlagged={false} tooltip={sectionTooltip} compact={compact} />
      {/* Row 3 */}
      <Cell
        section="Cost Structure"
        colSpan={2}
        isUpdated={updatedSections.includes('Cost Structure')}
        isFlagged={flaggedSection === 'Cost Structure'}
        updateLabel={updateLabels['Cost Structure']}
        flaggedLabel={flaggedLabel}
        onClick={flaggedSection === 'Cost Structure' ? () => onSectionClick?.('Cost Structure') : undefined}
        tooltip={sectionTooltip}
        compact={compact}
      />
      <Cell
        section="Revenue Streams"
        colSpan={3}
        isUpdated={updatedSections.includes('Revenue Streams')}
        isFlagged={flaggedSection === 'Revenue Streams'}
        updateLabel={updateLabels['Revenue Streams']}
        flaggedLabel={flaggedLabel}
        onClick={flaggedSection === 'Revenue Streams' ? () => onSectionClick?.('Revenue Streams') : undefined}
        tooltip={sectionTooltip}
        compact={compact}
      />
    </div>
  )
}
