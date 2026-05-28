import { motion } from 'framer-motion'
import Road from '../components/Road'
import MilesLogo from '../components/MilesLogo'
import scenario from '../scenario.json'

interface LandingProps {
  onAdvance: (screen: string) => void
}

const s = scenario.screens['0.1']

export default function Landing({ onAdvance }: LandingProps) {
  const completed = { spark: false, garage: false, testTrack: false }

  return (
    <div
      className="gradient-ignition flex flex-col min-h-full items-center justify-center px-6 py-10 text-center"
    >
      {/* Logo — light mode (on gradient) */}
      <motion.div
        className="mb-8 flex justify-center"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <MilesLogo size="lg" light />
      </motion.div>

      {/* Road — hero size */}
      <motion.div
        className="w-full max-w-2xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Road completedStages={completed} activeStage={null} hero />
      </motion.div>

      {/* Tagline — Caveat handwritten accent */}
      <motion.p
        style={{
          fontSize: 13,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.75)',
          fontFamily: 'Caveat, cursive',
          fontWeight: 600,
          marginBottom: 14,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
      >
        {s.tagline}
      </motion.p>

      {/* Subhead — Inter body */}
      <motion.p
        style={{
          fontSize: 18,
          color: 'rgba(255,255,255,0.92)',
          marginBottom: 40,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          lineHeight: 1.5,
          maxWidth: 380,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        {s.subhead}
      </motion.p>

      {/* CTA — honda-black on white so it pops against the indigo gradient */}
      <motion.button
        onClick={() => onAdvance(s.cta.advance)}
        style={{
          background: '#fff',
          color: '#231F20',
          border: 'none',
          borderRadius: 12,
          padding: '14px 40px',
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.03, background: '#f5f5f5' }}
        whileTap={{ scale: 0.97 }}
      >
        {s.cta.label} →
      </motion.button>

      {/* Honda footer */}
      <motion.p
        style={{
          marginTop: 44,
          fontSize: 10,
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: '0.2em',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          textTransform: 'uppercase',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Honda Motor Co. · Internal Use Only
      </motion.p>
    </div>
  )
}
