import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function Hero() {
  const scrollRef = useRef(null)

  const handleScroll = () => {
    const el = document.querySelector('#about')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '0 40px',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Grid overlay */}
      <div className="grid-overlay" style={{ opacity: 0.5 }} />

      {/* Top scan line */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.4), transparent)',
      }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 900 }}>

        {/* Pre-label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="section-label"
          style={{ justifyContent: 'center', marginBottom: 32 }}
        >
          Welcome to the future
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="h1-display"
          style={{ marginBottom: 16 }}
        >
          <span style={{
            display: 'block',
            color: '#c8d8f0',
            lineHeight: 1.05,
          }}>AST</span>
          <span style={{
            display: 'block',
            color: '#c9a84c',
            textShadow: '0 0 40px rgba(201,168,76,0.4), 0 0 100px rgba(201,168,76,0.15)',
            lineHeight: 1.05,
          }}>NEXUS</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          style={{
            fontFamily: 'Orbitron, monospace',
            fontSize: 'clamp(0.75rem, 2vw, 1rem)',
            letterSpacing: '0.4em',
            color: '#00d4ff',
            textTransform: 'uppercase',
            marginBottom: 40,
            textShadow: '0 0 20px rgba(0,212,255,0.4)',
          }}
        >
          Intelligence&nbsp;·&nbsp;Systems&nbsp;·&nbsp;Future
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.95 }}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)',
            fontWeight: 300,
            lineHeight: 1.7,
            color: 'rgba(200,216,240,0.6)',
            maxWidth: 560,
            margin: '0 auto 52px',
          }}
        >
          A futuristic technology platform building intelligent digital systems
          for businesses, creators, and future-focused brands.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <button
            className="btn-primary"
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span>Enter the Nexus</span>
            <span style={{ fontSize: '0.8em' }}>→</span>
          </button>

          <button
            onClick={() => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 30px',
              background: 'transparent',
              border: '1px solid rgba(0,212,255,0.3)',
              color: 'rgba(0,212,255,0.8)',
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '0.78rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'border-color 0.3s, color 0.3s, box-shadow 0.3s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(0,212,255,0.7)'
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,212,255,0.15)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Explore Systems
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        style={{
          position: 'absolute', bottom: 40, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 8,
          cursor: 'pointer',
        }}
        onClick={handleScroll}
      >
        <span style={{
          fontFamily: 'Orbitron, monospace',
          fontSize: '0.55rem',
          letterSpacing: '0.3em',
          color: 'rgba(201,168,76,0.5)',
        }}>SCROLL</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          style={{
            width: 1, height: 40,
            background: 'linear-gradient(180deg, rgba(201,168,76,0.6), transparent)',
          }}
        />
      </motion.div>
    </section>
  )
}
