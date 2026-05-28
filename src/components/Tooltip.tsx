import { useState, type ReactNode } from 'react'

interface TooltipProps {
  text: string
  children: ReactNode
  disabled?: boolean
}

/** Wraps any element; shows a tooltip on click (tap-friendly) and hover */
export default function Tooltip({ text, children, disabled = true }: TooltipProps) {
  const [visible, setVisible] = useState(false)

  if (!disabled) return <>{children}</>

  function show() {
    setVisible(true)
    setTimeout(() => setVisible(false), 2400)
  }

  return (
    <div className="relative inline-block" onClick={show}>
      <div className="pointer-events-none opacity-60 select-none">{children}</div>
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 whitespace-nowrap bg-[#1A1A1A] text-white text-xs rounded-lg px-3 py-1.5 shadow-lg pointer-events-none">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1A1A1A]" />
        </div>
      )}
    </div>
  )
}
