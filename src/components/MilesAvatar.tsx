// Miles avatar — Honda red circle with white M (matches miles-honda design)
export default function MilesAvatar({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 text-white select-none"
      style={{
        width: size,
        height: size,
        background: '#CC0000',
        fontSize: size * 0.4,
        fontWeight: 900,
        fontFamily: 'monospace',
        letterSpacing: '-0.5px',
        flexShrink: 0,
      }}
    >
      M
    </div>
  )
}
