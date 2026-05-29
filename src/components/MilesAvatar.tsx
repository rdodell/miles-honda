// Miles avatar — Honda red circle with a white line-art fox face
export default function MilesAvatar({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 text-white select-none"
      style={{ width: size, height: size, background: '#CC0000', flexShrink: 0 }}
      aria-label="Miles"
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 32 32" fill="none"
        stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 12 L10 3.5 L15 9" />
        <path d="M25 12 L22 3.5 L17 9" />
        <circle cx="16" cy="18" r="9" />
        <circle cx="12.5" cy="16.8" r="1.5" fill="currentColor" stroke="none" />
        <circle cx="19.5" cy="16.8" r="1.5" fill="currentColor" stroke="none" />
        <path d="M14 21.4 L18 21.4 L16 24.4 Z" fill="currentColor" stroke="none" />
      </svg>
    </div>
  )
}
