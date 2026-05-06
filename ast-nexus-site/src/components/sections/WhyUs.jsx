import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const PILLARS = [
  {
    num: '01',
    title: 'Premium Design',
    desc: 'Every pixel, animation, and interaction is crafted with cinematic precision. We do not make websites. We build digital worlds.',
    accent: '#c9a84c',
  },
  {
    num: '02',
    title: 'Smart Technology',
    desc: 'AI is not a feature — it is the foundation. Our systems think, adapt, and improve automatically over time.',
    accent: '#00d4ff',
  },
  {
    num: '03',
    title: 'Scalable Architecture',
    desc: 'From startup to enterprise, our infrastructure scales elastically. Built for millions, performs like a prototype.',
    accent: '#00ffcc',
  },
  {
    num: '04',
    title: 'Future-Ready',
    desc: 'We build with tomorrow in mind. When the technology landscape shifts, your system evolves with it.',
    accent: '#c9a84c',
  },
]

export default function WhyUs() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      style={{
        padding: '140px 40px',
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,4,14,0.95) 20%, rgba(0,4,14,0.95) 80%, transparent 100%)',
        position: 'relative',
      }}
    >
      <div className="grid-overlay" />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 90 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="section-label"
            style={{ justifyContent: 'center' }}
          >
            Why AST Nexus
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="h2-display"
            style={{ color: '#c8d8f0' }}
          >
            Built for the{' '}
            <span className="text-glow-gold">Exceptional</span>
          </motion.h2>
        </div>

        {/* Pillars */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 40,
        }}>
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
              style={{ position: 'relative' }}
            >
              {/* Number */}
              <div style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.25em',
                color: p.accent,
                marginBottom: 20,
                opacity: 0.7,
              }}>{p.num}</div>

              {/* Divider */}
              <div style={{
                width: '100%', height: 1,
                background: `linear-gradient(90deg, ${p.accent}50, transparent)`,
                marginBottom: 24,
              }} />

              <h3 style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#c8d8f0',
                letterSpacing: '0.08em',
                marginBottom: 16,
              }}>{p.title}</h3>

              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                lineHeight: 1.8,
                color: 'rgba(200,216,240,0.5)',
              }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Quote block */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          style={{
            marginTop: 100,
            padding: '60px 60px',
            borderLeft: '2px solid rgba(201,168,76,0.4)',
            background: 'linear-gradient(90deg, rgba(201,168,76,0.05), transparent)',
            position: 'relative',
          }}
        >
          <div style={{
            position: 'absolute', top: -1, left: -2,
            width: 12, height: 12,
            background: '#c9a84c',
          }} />
          <p style={{
            fontFamily: 'Orbitron, monospace',
            fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
            fontWeight: 500,
            lineHeight: 1.6,
            color: 'rgba(200,216,240,0.8)',
            letterSpacing: '0.03em',
            maxWidth: 700,
          }}>
            "We do not just build technology. We architect the future — one
            intelligent system at a time."
          </p>
          <div style={{
            marginTop: 24,
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            color: '#c9a84c',
            textTransform: 'uppercase',
          }}>
            — AST Nexus Manifesto
          </div>
        </motion.div>
      </div>
    </section>
  )
}
