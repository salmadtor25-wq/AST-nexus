import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('loading') // loading | done
  const intervalRef = useRef(null)

  useEffect(() => {
    let val = 0
    intervalRef.current = setInterval(() => {
      val += Math.random() * 4 + 1
      if (val >= 100) {
        val = 100
        clearInterval(intervalRef.current)
        setProgress(100)
        setTimeout(() => setPhase('done'), 400)
        setTimeout(() => onComplete(), 1200)
      } else {
        setProgress(Math.floor(val))
      }
    }, 40)
    return () => clearInterval(intervalRef.current)
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: '#000510',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 40,
          }}
        >
          {/* Circuit SVG background */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07 }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="circuit" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M40 0 L40 30 L60 30 L60 50 L80 50" stroke="#00d4ff" strokeWidth="0.8" fill="none"/>
                <path d="M0 40 L30 40 L30 60 L50 60" stroke="#c9a84c" strokeWidth="0.8" fill="none"/>
                <circle cx="40" cy="30" r="2" fill="#00d4ff"/>
                <circle cx="30" cy="40" r="2" fill="#c9a84c"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)"/>
          </svg>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ textAlign: 'center', position: 'relative' }}
          >
            <div style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 900,
              color: '#c9a84c',
              letterSpacing: '0.25em',
              textShadow: '0 0 30px rgba(201,168,76,0.5)',
            }}>
              AST NEXUS
            </div>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '0.7rem',
              letterSpacing: '0.35em',
              color: '#00d4ff',
              marginTop: 8,
              textTransform: 'uppercase',
            }}>
              Initializing Systems
            </div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ width: 'min(400px, 80vw)', position: 'relative' }}
          >
            {/* Track */}
            <div style={{
              width: '100%', height: 2,
              background: 'rgba(201,168,76,0.15)',
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Fill */}
              <motion.div
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, #c9a84c, #f0c040, #00d4ff)',
                  transformOrigin: 'left',
                  scaleX: progress / 100,
                }}
                transition={{ duration: 0.1 }}
              />
              {/* Glow */}
              <motion.div style={{
                position: 'absolute', top: -2, height: 6,
                width: 40, background: 'rgba(240,192,64,0.6)',
                filter: 'blur(6px)',
                left: `${progress}%`,
                transform: 'translateX(-50%)',
              }} />
            </div>

            {/* Labels */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginTop: 12,
              fontFamily: 'Orbitron, monospace',
              fontSize: '0.6rem',
              color: 'rgba(201,168,76,0.6)',
              letterSpacing: '0.1em',
            }}>
              <span>LOADING CORE</span>
              <span>{progress}%</span>
            </div>
          </motion.div>

          {/* Status line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '0.65rem',
              color: 'rgba(0,212,255,0.5)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            {progress < 30 && '▸ Mapping neural architecture...'}
            {progress >= 30 && progress < 60 && '▸ Compiling intelligence layer...'}
            {progress >= 60 && progress < 90 && '▸ Activating data streams...'}
            {progress >= 90 && '▸ Systems online'}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
