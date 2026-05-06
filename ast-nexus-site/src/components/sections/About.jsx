import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const STATS = [
  { value: '200+', label: 'Systems Built' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '50+', label: 'AI Deployments' },
  { value: '24/7', label: 'System Uptime' },
]

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="about"
      ref={ref}
      className="section"
      style={{
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,5,16,0.85) 20%, rgba(0,5,16,0.85) 80%, transparent 100%)',
        padding: '140px 40px',
      }}
    >
      <div style={{
        maxWidth: 1100,
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 80,
        alignItems: 'center',
      }}>
        {/* Left: text */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="section-label"
          >
            Who We Are
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="h2-display"
            style={{ marginBottom: 28, color: '#c8d8f0' }}
          >
            The Nexus of{' '}
            <span className="text-glow-gold">Intelligence</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.25 }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              lineHeight: 1.85,
              color: 'rgba(200,216,240,0.65)',
              marginBottom: 20,
            }}
          >
            AST Nexus is the connection point between intelligence, technology,
            and the future. We build AI-powered systems, automation tools, and
            advanced digital experiences that move businesses forward.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.35 }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              lineHeight: 1.85,
              color: 'rgba(200,216,240,0.55)',
              marginBottom: 40,
            }}
          >
            We exist at the intersection where AI, software, data, and digital
            innovation converge — creating a unified ecosystem that scales with your vision.
          </motion.p>

          <motion.button
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
            className="btn-primary"
            onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span>Our Systems →</span>
          </motion.button>
        </div>

        {/* Right: stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 2,
        }}>
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className="glass"
              style={{
                padding: '36px 28px',
                borderRadius: i === 0 ? '12px 0 0 0'
                  : i === 1 ? '0 12px 0 0'
                  : i === 2 ? '0 0 0 12px'
                  : '0 0 12px 0',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
              whileHover={{ scale: 1.03 }}
            >
              {/* Glow accent */}
              <div style={{
                position: 'absolute', inset: 0,
                background: i % 2 === 0
                  ? 'radial-gradient(circle at 30% 30%, rgba(201,168,76,0.08), transparent 60%)'
                  : 'radial-gradient(circle at 70% 70%, rgba(0,212,255,0.08), transparent 60%)',
              }} />
              <div style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                fontWeight: 800,
                color: i % 2 === 0 ? '#c9a84c' : '#00d4ff',
                textShadow: i % 2 === 0
                  ? '0 0 20px rgba(201,168,76,0.4)'
                  : '0 0 20px rgba(0,212,255,0.4)',
                position: 'relative',
              }}>{stat.value}</div>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(200,216,240,0.5)',
                marginTop: 8,
                position: 'relative',
              }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
