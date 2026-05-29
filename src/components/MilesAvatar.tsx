import foxImg from '../assets/miles-fox.png'

// Miles avatar — Honda red circle with the Miles fox image
export default function MilesAvatar({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-full flex-shrink-0 select-none overflow-hidden"
      style={{ width: size, height: size, background: '#F2F2F2', flexShrink: 0, border: '1px solid #E5E5E5' }}
      aria-label="Miles"
    >
      <img
        src={foxImg}
        alt="Miles"
        style={{ width: '88%', height: '88%', objectFit: 'contain', display: 'block', margin: 'auto' }}
      />
    </div>
  )
}
