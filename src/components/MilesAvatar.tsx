import foxImg from '../assets/miles-avatar.png'

// Miles avatar — circle with the Miles fox image
export default function MilesAvatar({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-full flex-shrink-0 select-none overflow-hidden flex items-center justify-center"
      style={{ width: size, height: size, background: '#fff', flexShrink: 0 }}
      aria-label="Miles"
    >
      <img
        src={foxImg}
        alt="Miles"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          mixBlendMode: 'multiply',
          filter: 'saturate(0.85) brightness(1.18)',
        }}
      />
    </div>
  )
}
