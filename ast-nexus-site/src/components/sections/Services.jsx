import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const SERVICES = [
  {
    icon: '◈',
    title: 'AI Systems',
    desc: 'Custom machine learning models, intelligent automation, and AI-driven decision engines tailored for your domain.',
    accent: '#c9a84c',
  },
  {
    icon: '⬡',
    title: 'Automation',
    desc: 'End-to-end workflow automation that eliminates friction, reduces overhead, and scales with zero human intervention.',
    accent: '#00d4ff',
  },
  {
    icon: '◉',
    title: 'Web Platforms',
    desc: 'High-performance web applications and digital platforms built with cutting-edge technology and 3D interfaces.',
    accent: '#00ffcc',
  },
  {
    icon: '◧',
    title: 'Data Intelligence',
    desc: 'Real-time analytics, predictive modeling, and intelligent dashboards that turn raw data into strategic advantage.',
    accent: '#c9a84c',
  },
  {
    icon: '⬢',
    title: 'Digital Strategy',
    desc: 'Future-proof technology roadmaps and digital transformation consulting for enterprise and growth-stage companies.',
    accent: '#00d4ff',
  },
  {
    icon: '◎',
    title: 'Smart Products',
    desc: 'AI-native digital products — from mobile apps to autonomous systems — engineered for the intelligent economy.',
    accent: '#00ffcc',
  },
]

export default function Services() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="services"
      ref={ref}
      className="section"
      style={{
        flexDirection: 'column',
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,8,28,0.9) 15%, rgba(0,8,28,0.9) 85%, transparent 100%)',
        padding: '140px 40px',
      }}
    >
      <div style={{ maxWidth: 1100, width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="section-label"
            style={{ justifyContent: 'center' }}
          >
            What We Build
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="h2-display"
            style={{ color: '#c8d8f0' }}
          >
            Intelligent{' '}
            <span className="text-glow-cyan">Systems</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.25 }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              color: 'rgba(200,216,240,0.5)',
              maxWidth: 500,
              margin: '20px auto 0',
              lineHeight: 1.7,
            }}
          >
            Six core disciplines. One unified intelligence platform.
          </motion.p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 1,
          background: 'rgba(201,168,76,0.08)',
          border: '1px solid rgba(201,168,76,0.08)',
          borderRadius: 16,
          overflow: 'hidden',
        }}>
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              style={{
                padding: '44px 36px',
                background: 'rgba(0,5,18,0.9)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default',
                transition: 'background 0.3s',
              }}
              whileHover={{ backgroundColor: 'rgba(0,10,30,0.95)' }}
              onMouseEnter={e => {
                const glow = e.currentTarget.querySelector('.card-glow')
                if (glow) glow.style.opacity = '1'
              }}
              onMouseLeave={e => {
                const glow = e.currentTarget.querySelector('.card-glow')
                if (glow) glow.style.opacity = '0'
              }}
            >
              {/* Hover glow */}
              <div
                className="card-glow"
                style={{
                  position: 'absolute', inset: 0,
                  background: `radial-gradient(circle at 30% 30%, ${s.accent}10, transparent 70%)`,
                  opacity: 0,
                  transition: 'opacity 0.4s',
                  pointerEvents: 'none',
                }}
              />

              {/* Top accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, ${s.accent}50, transparent)`,
              }} />

              {/* Icon */}
              <div style={{
                fontFamily: 'monospace',
                fontSize: '1.8rem',
                color: s.accent,
                textShadow: `0 0 20px ${s.accent}70`,
                marginBottom: 20,
              }}>
                {s.icon}
              </div>

              <h3 style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.9rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#c8d8f0',
                marginBottom: 14,
              }}>{s.title}</h3>

              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                lineHeight: 1.75,
                color: 'rgba(200,216,240,0.5)',
              }}>{s.desc}</p>

              {/* Corner */}
              <div style={{
                position: 'absolute', bottom: 16, right: 16,
                width: 12, height: 12,
                borderBottom: `1px solid ${s.accent}40`,
                borderRight: `1px solid ${s.accent}40`,
              }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
