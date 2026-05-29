import foxImg from '../assets/miles-fox.png'

// Miles avatar — Honda red circle with the Miles fox image
export default function MilesAvatar({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-full flex-shrink-0 select-none overflow-hidden"
      style={{ width: size, height: size, background: '#CC0000', flexShrink: 0 }}
      aria-label="Miles"
    >
      <img
        src={foxImg}
        alt=""
        aria-hidden="true"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  )
}
