import { motion } from 'framer-motion'
import scenario from '../scenario.json'
import iconSparkStage from '../assets/icon-spark-stage.png'
import iconHandshake  from '../assets/icon-handshake.png'
import iconGauge      from '../assets/icon-gauge.png'

interface LandingProps {
  onAdvance: (screen: string) => void
}

const s = scenario.screens['0.1']

const BG = `
  radial-gradient(840px 460px at 6% -8%,  var(--c-spark-soft)  0%, transparent 55%),
  radial-gradient(780px 520px at 104% -2%, var(--c-garage-soft) 0%, transparent 58%),
  radial-gradient(700px 600px at 58% 126%, var(--accent-soft)   0%, transparent 56%),
  linear-gradient(165deg, #FFFFFF 0%, var(--bg) 100%)
`.trim()

const STAGES = [
  { id: 'spark',  label: 'Spark',      imgSrc: iconSparkStage, color: 'var(--c-spark)',  soft: 'var(--c-spark-soft)' },
  { id: 'garage', label: 'Garage',     imgSrc: iconHandshake,  color: 'var(--c-garage)', soft: 'var(--c-garage-soft)' },
  { id: 'track',  label: 'Test Track', imgSrc: iconGauge,      color: 'var(--c-track)',  soft: 'var(--c-track-soft)' },
]

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45, ease: [0.2, 0.9, 0.3, 1] as const },
})

export default function Landing({ onAdvance }: LandingProps) {
  return (
    <div style={{
      background: BG,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      textAlign: 'center',
    }}>

      {/* Brand mark */}
      <motion.div
        {...fadeUp(0)}
        style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 52 }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 11,
          background: 'var(--grad-brand)',
          display: 'grid', placeItems: 'center',
          color: '#fff', fontFamily: 'Zilla Slab, Georgia, serif',
          fontWeight: 700, fontSize: 22,
          boxShadow: 'var(--shadow-2)',
        }}>H</div>
        <span style={{
          fontFamily: 'Zilla Slab, Georgia, serif', fontWeight: 600,
          fontSize: 20, color: 'var(--ink)', letterSpacing: '-0.01em',
        }}>
          Ignition at Honda
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        {...fadeUp(0.08)}
        style={{
          fontFamily: 'Zilla Slab, Georgia, serif', fontWeight: 700,
          fontSize: 'clamp(52px, 6vw, 80px)',
          color: 'var(--ink)', letterSpacing: '-0.02em',
          lineHeight: 1.05, margin: '0 0 14px',
        }}
      >
        {s.headline}
      </motion.h1>

      {/* Tagline */}
      {/* 3-stage road visual */}
      <motion.div
        {...fadeUp(0.24)}
        style={{
          display: 'flex', alignItems: 'center',
          gap: 0, marginBottom: 48,
          maxWidth: 520, width: '100%',
        }}
      >
        {STAGES.map((stage, i) => {
          return (
            <div key={stage.id} style={{ display: 'contents' }}>
              {i > 0 && (
                <div style={{
                  flex: 1, height: 2,
                  background: `repeating-linear-gradient(90deg, var(--border-strong) 0 5px, transparent 5px 10px)`,
                }} />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, flex: '0 0 auto' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: stage.soft,
                  border: `2px solid ${stage.color}`,
                  display: 'grid', placeItems: 'center',
                  color: stage.color,
                  boxShadow: `0 0 0 5px ${stage.soft}, var(--shadow-1)`,
                }}>
                  <img src={stage.imgSrc} alt="" style={{ width: 22, height: 22, objectFit: 'contain', filter: 'brightness(0) saturate(100%) opacity(0.85)' }} />
                </div>
                <span style={{
                  fontFamily: 'Zilla Slab, Georgia, serif', fontWeight: 600,
                  fontSize: 13, color: 'var(--ink-2)',
                }}>
                  {stage.label}
                </span>
              </div>
            </div>
          )
        })}
      </motion.div>

      {/* Subhead */}
      <motion.p
        {...fadeUp(0.32)}
        style={{
          fontFamily: 'Space Grotesk, ui-sans-serif, sans-serif',
          fontSize: 17, color: 'var(--ink-2)',
          lineHeight: 1.6, maxWidth: 360, margin: '0 0 40px',
        }}
      >
        {s.subhead}
      </motion.p>

      {/* CTA */}
      <motion.button
        {...fadeUp(0.4)}
        onClick={() => onAdvance(s.cta.advance)}
        whileHover={{ scale: 1.03, boxShadow: '0 8px 32px rgba(168,54,44,0.28)' }}
        whileTap={{ scale: 0.97 }}
        style={{
          background: 'var(--grad-primary)', color: '#fff',
          border: 'none', borderRadius: 12,
          padding: '15px 48px',
          fontFamily: 'Space Grotesk, ui-sans-serif, sans-serif',
          fontWeight: 700, fontSize: 14,
          letterSpacing: '0.07em', textTransform: 'uppercase',
          cursor: 'pointer', boxShadow: '0 4px 18px rgba(168,54,44,0.22)',
        }}
      >
        {s.cta.label} →
      </motion.button>

      {/* Footer */}
      <motion.p
        {...fadeUp(0.55)}
        style={{
          marginTop: 48, fontSize: 10,
          color: 'var(--faint)', letterSpacing: '0.2em',
          fontFamily: 'Space Grotesk, ui-sans-serif, sans-serif',
          fontWeight: 500, textTransform: 'uppercase',
        }}
      >
        Honda Motor Co. · Internal Use Only
      </motion.p>
    </div>
  )
}
