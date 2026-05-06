import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastY = useRef(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 60)
      setVisible(y < 80 || y < lastY.current)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLink = (href) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          zIndex: 100,
          padding: '20px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: scrolled
            ? 'rgba(0,5,16,0.85)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(201,168,76,0.1)' : 'none',
          transition: 'background 0.4s, border 0.4s, backdrop-filter 0.4s',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            fontFamily: 'Orbitron, monospace',
            fontSize: '1.1rem',
            fontWeight: 800,
            letterSpacing: '0.2em',
            color: '#c9a84c',
            textShadow: '0 0 20px rgba(201,168,76,0.4)',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
          }}
        >
          AST<span style={{ color: '#00d4ff' }}>·</span>NEXUS
        </button>

        {/* Desktop Links */}
        <div style={{
          display: 'flex', gap: 40, alignItems: 'center',
        }} className="desktop-nav">
          {LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => handleLink(link.href)}
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '0.78rem',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(200,216,240,0.7)',
                background: 'none', border: 'none', cursor: 'pointer',
                position: 'relative',
                padding: '4px 0',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = '#c9a84c'}
              onMouseLeave={e => e.target.style.color = 'rgba(200,216,240,0.7)'}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleLink('#contact')}
            className="btn-primary"
            style={{ padding: '9px 22px', fontSize: '0.65rem' }}
          >
            <span>Get Started</span>
          </button>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none',
            flexDirection: 'column', gap: 5, padding: 8,
            background: 'none', border: 'none', cursor: 'pointer',
          }}
          className="hamburger"
          aria-label="Menu"
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: 'block', width: 22, height: 1.5,
              background: menuOpen && i === 1 ? 'transparent' : '#c9a84c',
              transform: menuOpen
                ? i === 0 ? 'translateY(6.5px) rotate(45deg)'
                : i === 2 ? 'translateY(-6.5px) rotate(-45deg)' : 'none'
                : 'none',
              transition: 'transform 0.3s, background 0.3s',
            }} />
          ))}
        </button>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: 70, left: 0, right: 0,
              zIndex: 99,
              background: 'rgba(0,5,16,0.97)',
              backdropFilter: 'blur(30px)',
              borderBottom: '1px solid rgba(201,168,76,0.15)',
              padding: '30px 40px',
              display: 'flex', flexDirection: 'column', gap: 24,
            }}
          >
            {LINKS.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleLink(link.href)}
                style={{
                  fontFamily: 'Orbitron, monospace',
                  fontSize: '1rem',
                  color: '#c8d8f0',
                  background: 'none', border: 'none',
                  textAlign: 'left', cursor: 'pointer',
                  letterSpacing: '0.15em',
                }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}
