import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email.trim()) setSent(true)
  }

  return (
    <section
      id="contact"
      ref={ref}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '140px 40px',
        position: 'relative',
        textAlign: 'center',
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,3,10,0.97) 30%)',
      }}
    >
      {/* Bottom grid */}
      <div className="grid-overlay" />

      <div style={{ maxWidth: 720, width: '100%', position: 'relative', zIndex: 1 }}>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="section-label"
          style={{ justifyContent: 'center' }}
        >
          Start Building
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15 }}
          className="h2-display"
          style={{ marginBottom: 20, color: '#c8d8f0' }}
        >
          Build the Future
          <br />
          with <span className="text-glow-gold">AST Nexus</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '1rem',
            color: 'rgba(200,216,240,0.5)',
            lineHeight: 1.7,
            marginBottom: 60,
          }}
        >
          Ready to step into the next generation of technology?
          Let's architect your intelligent future together.
        </motion.p>

        {/* Email form */}
        {!sent ? (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              gap: 12,
              maxWidth: 500,
              margin: '0 auto 60px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              style={{
                flex: '1 1 240px',
                padding: '14px 20px',
                background: 'rgba(0,8,28,0.8)',
                border: '1px solid rgba(201,168,76,0.25)',
                borderRadius: 2,
                color: '#c8d8f0',
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '0.9rem',
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(201,168,76,0.6)'}
              onBlur={e => e.target.style.borderColor = 'rgba(201,168,76,0.25)'}
            />
            <button type="submit" className="btn-primary">
              <span>Launch →</span>
            </button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              padding: '28px 48px',
              border: '1px solid rgba(0,212,255,0.3)',
              borderRadius: 4,
              marginBottom: 60,
              display: 'inline-block',
            }}
          >
            <div style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              color: '#00ffcc',
              textShadow: '0 0 20px rgba(0,255,204,0.4)',
            }}>
              ✓ Transmission received. We will be in touch.
            </div>
          </motion.div>
        )}

        {/* Divider */}
        <div style={{
          width: '100%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)',
          marginBottom: 50,
        }} />

        {/* Footer nav */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 24,
          }}
        >
          <div style={{
            fontFamily: 'Orbitron, monospace',
            fontSize: '1rem',
            fontWeight: 800,
            color: '#c9a84c',
            textShadow: '0 0 20px rgba(201,168,76,0.3)',
            letterSpacing: '0.2em',
          }}>
            AST<span style={{ color: '#00d4ff' }}>·</span>NEXUS
          </div>

          <div style={{
            display: 'flex', gap: 32,
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '0.72rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(200,216,240,0.35)',
          }}>
            {['Twitter', 'LinkedIn', 'GitHub'].map(s => (
              <span
                key={s}
                style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#c9a84c'}
                onMouseLeave={e => e.target.style.color = 'rgba(200,216,240,0.35)'}
              >{s}</span>
            ))}
          </div>

          <div style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '0.7rem',
            color: 'rgba(200,216,240,0.25)',
            letterSpacing: '0.08em',
          }}>
            © 2025 AST Nexus. All rights reserved.
          </div>
        </motion.div>
      </div>
    </section>
  )
}
