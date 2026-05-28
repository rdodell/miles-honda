// Honda official wing logo + MILES wordmark + "Honda Ignition Hub" sub
// Uses the Honda SVG lettermark colored in honda-red (#CC0000)

interface MilesLogoProps {
  size?: 'sm' | 'md' | 'lg'
  /** Set to true when rendered on the dark/gradient landing screen */
  light?: boolean
}

export default function MilesLogo({ size = 'md', light = false }: MilesLogoProps) {
  const logoSize = size === 'sm' ? 28 : size === 'lg' ? 56 : 36
  const wordSize = size === 'sm' ? 15 : size === 'lg' ? 28 : 20
  const subSize  = size === 'sm' ? 7  : size === 'lg' ? 11 : 8
  const gap      = size === 'sm' ? 8  : size === 'lg' ? 14 : 10
  const textColor = light ? '#fff' : '#231F20'
  const subColor  = light ? 'rgba(255,255,255,0.7)' : '#6B6B6B'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap }}>
      {/* Honda wing logo — official SVG paths, colored honda-red */}
      <svg
        width={logoSize}
        height={logoSize}
        viewBox="0 0 44.6 44.6"
        fill="none"
        style={{ flexShrink: 0 }}
      >
        {/* H-wings lettermark */}
        <path
          fill="#CC0000"
          d="M32.6,7.2c-1,4.6-1.4,6.7-2.3,10s-1.4,6.1-2.5,7.6c-0.8,1.1-2.1,1.8-3.5,1.9
             c-1.3,0.1-2.7,0.1-4,0c-1.4-0.1-2.7-0.8-3.5-1.9c-1.1-1.4-1.7-4.4-2.5-7.6S13,11.8,12,7.2l-1.5,0.1
             c-0.6,0-1.1,0.1-1.6,0.2c0,0,0.6,9.4,0.9,13.4c0.3,4.2,0.8,11.2,1.2,16.6c0,0,0.9,0.1,2.3,0.2
             s2.2,0.1,2.2,0.1c0.6-2.4,1.4-5.6,2.2-7c0.5-0.8,1.4-1.3,2.4-1.3c0.7-0.1,1.4-0.1,2.2-0.1l0,0
             c0.7,0,1.4,0,2.2,0.1c1,0,1.9,0.5,2.4,1.3c0.9,1.4,1.6,4.6,2.2,7c0,0,0.7,0,2.2-0.1s2.3-0.2,2.3-0.2
             c0.5-5.3,1-12.4,1.2-16.6c0.3-4,0.9-13.4,0.9-13.4c-0.5-0.1-1-0.1-1.6-0.2L32.6,7.2z"
        />
        {/* Outer frame */}
        <path
          fill="#CC0000"
          d="M44.4,12.8c-0.6-6-4.6-7.2-8.1-7.8c-2.3-0.3-4.6-0.5-6.9-0.6c-1.8-0.1-5.9-0.2-7.1-0.2
             s-5.4,0.1-7.1,0.2C12.8,4.4,10.5,4.6,8.2,5c-3.5,0.6-7.5,1.9-8.1,7.8c-0.2,2-0.2,4-0.2,6
             c0,2.7,0.2,5.4,0.6,8.1c0.2,2.3,0.7,4.5,1.3,6.8c0.9,2.6,1.7,3.4,2.6,4.1c1.6,1.1,3.3,1.7,5.2,2
             c8.4,0.9,16.8,0.9,25.2,0c1.9-0.3,3.6-0.9,5.2-2c1-0.8,1.8-1.5,2.6-4.1c0.6-2.2,1.1-4.5,1.3-6.8
             c0.3-2.7,0.5-5.4,0.6-8.1C44.6,16.8,44.5,14.8,44.4,12.8z M42.2,22.8c-0.1,3.3-0.6,6.5-1.4,9.7
             c-0.3,1.5-1.1,2.8-2.2,3.9c-1.5,1.2-3.3,1.9-5.1,2c-7.5,0.8-15,0.8-22.5,0c-1.9-0.1-3.6-0.8-5.1-2
             c-1.1-1.1-1.8-2.4-2.2-3.9c-0.8-3.2-1.2-6.4-1.4-9.7c-0.2-3.3-0.2-6.7,0.1-10C3,9,4.8,7.2,8.8,6.5
             c2.2-0.4,4.5-0.6,6.7-0.7c1.9-0.1,5-0.2,6.8-0.2s4.9,0,6.8,0.2c2.2,0.1,4.5,0.3,6.7,0.7
             c4,0.7,5.8,2.6,6.3,6.3C42.3,16.1,42.4,19.5,42.2,22.8L42.2,22.8z"
        />
      </svg>

      {/* Wordmark */}
      <div>
        <div style={{
          fontSize: wordSize,
          fontWeight: 600,
          letterSpacing: wordSize * 0.18,
          color: textColor,
          lineHeight: 1,
          fontFamily: 'Fraunces, Georgia, serif',
        }}>
          MILES
        </div>
        <div style={{
          fontSize: subSize,
          color: subColor,
          letterSpacing: subSize * 0.25,
          textTransform: 'uppercase' as const,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          marginTop: 2,
        }}>
          Honda Ignition Hub
        </div>
      </div>
    </div>
  )
}
