import MilesAvatar from './MilesAvatar'
import scenario from '../scenario.json'
import { Mic, MessageCircle, Wrench } from 'lucide-react'
import ianAvatar from '../assets/ian-avatar.png'

interface CPMilesAsideProps {
  currentScreen: string
}

function getMilesMessage(screen: string): string {
  const screens = (scenario as any).screens
  const s = screens?.[screen]
  if (!s) return ''
  return (
    s.milesMessage ||
    s.milesMessages?.[0]?.text ||
    s.milesIntro ||
    s.milesResponse ||
    s.header ||
    ''
  )
}

function getIanMessage(screen: string): string {
  const screens = (scenario as any).screens
  const s = screens?.[screen]
  return s?.ianInput?.text || ''
}

export default function CPMilesAside({ currentScreen }: CPMilesAsideProps) {
  const milesMsg  = getMilesMessage(currentScreen)
  const ianMsg    = getIanMessage(currentScreen)
  const timeLabel = getTimeLabel(currentScreen)

  return (
    <aside style={{
      gridRow: 3,
      gridColumn: 3,
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(255,255,255,0.6)',
      backdropFilter: 'blur(18px) saturate(1.4)',
      WebkitBackdropFilter: 'blur(18px) saturate(1.4)',
      borderLeft: '1px solid rgba(255,255,255,0.7)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '16px 20px 14px',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <MilesAvatar size={36} />
          {/* Live dot */}
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 10, height: 10, borderRadius: '50%',
            background: '#22C55E',
            border: '2px solid rgba(255,255,255,0.9)',
            boxShadow: '0 0 0 3px rgba(34,197,94,0.22)',
          }} />
        </div>
        <div>
          <div style={{
            fontFamily: 'var(--font-cp-display)', fontWeight: 600,
            fontSize: 14, color: 'var(--ink)',
          }}>Miles</div>
          <div style={{
            fontFamily: 'var(--font-cp-mono)', fontSize: 10,
            textTransform: 'uppercase', letterSpacing: '0.1em',
            color: 'var(--muted)',
          }}>
            {timeLabel || 'Live'}
          </div>
        </div>
      </div>

      {/* Transcript */}
      <div style={{ flex: 1, overflow: 'hidden auto', padding: '20px 20px 12px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Miles message */}
        {milesMsg && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <MilesAvatar size={28} />
            <div style={{
              flex: 1,
              background: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.72)',
              borderRadius: '0 12px 12px 12px',
              padding: '10px 14px',
              boxShadow: 'var(--shadow-2)',
            }}>
              <div style={{
                fontFamily: 'var(--font-cp-sans)', fontSize: 13.5,
                color: 'var(--ink-2)', lineHeight: 1.6,
              }}>
                {milesMsg}
              </div>
            </div>
          </div>
        )}

        {/* Ian's response */}
        {ianMsg && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
            <div style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '12px 12px 0 12px',
              padding: '10px 14px',
              maxWidth: '80%',
              boxShadow: 'var(--shadow-1)',
            }}>
              <div style={{
                fontFamily: 'var(--font-cp-sans)', fontSize: 13.5,
                color: 'var(--ink)', lineHeight: 1.5,
                fontStyle: 'italic',
              }}>
                "{ianMsg}"
              </div>
            </div>
            <img
              src={ianAvatar}
              alt="Ian"
              style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: 'var(--bg-2)', border: '1px solid var(--border)' }}
            />
          </div>
        )}
      </div>

      {/* Input modes (static — input lives in the main area per screen) */}
      <div style={{
        flexShrink: 0,
        borderTop: '1px solid var(--border)',
        padding: '14px 20px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        {/* Mode tabs */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { label: 'Voice',   Icon: Mic },
            { label: 'Chat',    Icon: MessageCircle, active: true },
            { label: 'Sandbox', Icon: Wrench },
          ].map(({ label, Icon, active }) => (
            <div
              key={label}
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 5, padding: '7px 4px',
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${active ? 'var(--border)' : 'transparent'}`,
                background: active ? 'rgba(255,255,255,0.88)' : 'transparent',
                color: active ? 'var(--ink)' : 'var(--muted)',
                fontSize: 12, fontFamily: 'var(--font-cp-sans)',
                boxShadow: active ? 'var(--shadow-1)' : 'none',
                cursor: 'default',
              }}
            >
              <Icon size={12} />
              {label}
            </div>
          ))}
        </div>

        {/* Prompt hint */}
        <div style={{
          background: 'rgba(255,255,255,0.72)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          display: 'flex', alignItems: 'center', gap: 8,
          cursor: 'default',
        }}>
          <MessageCircle size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <span style={{
            fontFamily: 'var(--font-cp-sans)', fontSize: 13,
            color: 'var(--muted)', fontStyle: 'italic',
          }}>
            Reply using the chat below…
          </span>
        </div>
      </div>
    </aside>
  )
}

const TIME_LABELS: Record<string, string> = {
  '1.1': 'Week 2 · Tuesday', '1.3': 'Week 2 · Tuesday',
  '1.3b': 'Week 2 · Tuesday', '1.3c': 'Week 2 · Tuesday',
  '1.3d': 'Week 2 · Tuesday', '1.4': 'Week 2 · Friday',
  '1.5': 'Month 1 · Wednesday',
  '2.1': 'Month 1 · Wednesday', '2.2': 'Month 1 · Wednesday',
  '2.3': 'Month 1 · Friday', '2.4': 'Month 1 · Friday',
  '3.1': 'Month 3 · Monday', '3.2': 'Month 3 · Monday',
  '3.5': 'Month 3 · Monday',
}

function getTimeLabel(screen: string): string {
  return TIME_LABELS[screen] || ''
}
