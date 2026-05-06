import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const MILESTONES = [
  { pct: '0%', label: 'Exterior', desc: 'The chip surface. A monument of human engineering.' },
  { pct: '33%', label: 'Surface', desc: 'Millions of gold traces forming a city from above.' },
  { pct: '66%', label: 'Core', desc: 'Logic gates, memory cells, processing nodes alive.' },
  { pct: '100%', label: 'Intelligence', desc: 'The place where data becomes thought.' },
]

export default function ChipJourney() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      id="journey"
      ref={ref}
      className="section"
      style={{
        flexDirection: 'column',
        minHeight: '120vh',
        padding: '140px 40px',
        background: 'transparent',
      }}
    >
      <div style={{ maxWidth: 900, width: '100%', textAlign: 'center' }}>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="section-label"
          style={{ justifyContent: 'center' }}
        >
          The Digital Core
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="h2-display"
          style={{ marginBottom: 28, color: '#c8d8f0' }}
        >
          Enter the{' '}
          <span className="text-glow-gold">Chip</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '1.05rem',
            lineHeight: 1.8,
            color: 'rgba(200,216,240,0.55)',
            maxWidth: 600,
            margin: '0 auto 80px',
          }}
        >
          As you scroll, you journey through a futuristic computer chip —
          entering a digital world of flowing data, living circuits, and AI nodes.
          This is the brain of AST Nexus.
        </motion.p>

        {/* Milestones */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 2,
          marginBottom: 80,
        }}>
          {MILESTONES.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="glass"
              style={{ padding: '28px 20px', textAlign: 'center' }}
            >
              <div style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '1.4rem',
                fontWeight: 800,
                color: '#c9a84c',
                textShadow: '0 0 20px rgba(201,168,76,0.4)',
                marginBottom: 8,
              }}>{m.pct}</div>
              <div style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                color: '#00d4ff',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}>{m.label}</div>
              <div style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8rem',
                color: 'rgba(200,216,240,0.45)',
                lineHeight: 1.6,
              }}>{m.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 16,
            padding: '14px 28px',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: 2,
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            style={{
              width: 16, height: 16,
              border: '1px solid rgba(0,212,255,0.6)',
              borderTop: '1px solid #00d4ff',
              borderRadius: '50%',
            }}
          />
          <span style={{
            fontFamily: 'Orbitron, monospace',
            fontSize: '0.6rem',
            letterSpacing: '0.25em',
            color: 'rgba(0,212,255,0.6)',
            textTransform: 'uppercase',
          }}>
            Scroll to journey deeper
          </span>
        </motion.div>
      </div>
    </section>
  )
}
