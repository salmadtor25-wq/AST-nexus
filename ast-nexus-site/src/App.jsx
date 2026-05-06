import { Suspense, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import Scene from './components/three/Scene'
import LoadingScreen from './components/LoadingScreen'
import Navigation from './components/Navigation'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Services from './components/sections/Services'
import ChipJourney from './components/sections/ChipJourney'
import WhyUs from './components/sections/WhyUs'
import Contact from './components/sections/Contact'

function CanvasFallback() {
  return null
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [dpr, setDpr] = useState(1.5)

  const handleLoadComplete = useCallback(() => {
    setLoaded(true)
  }, [])

  return (
    <>
      {/* Loading screen */}
      <LoadingScreen onComplete={handleLoadComplete} />

      {/* Fixed 3D canvas */}
      <div id="canvas-root">
        <Canvas
          shadows
          dpr={dpr}
          camera={{ position: [0, 4.5, 18], fov: 55, near: 0.01, far: 200 }}
          gl={{
            antialias: true,
            toneMapping: 4, // ACESFilmicToneMapping
            toneMappingExposure: 1.1,
            outputColorSpace: 'srgb',
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <PerformanceMonitor
            onDecline={() => setDpr(1)}
            onIncline={() => setDpr(Math.min(window.devicePixelRatio, 2))}
          />
          <AdaptiveDpr pixelated />
          <Suspense fallback={<CanvasFallback />}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Scrollable HTML overlay */}
      <div id="scroll-content">
        <Navigation />
        <Hero />
        <About />
        <Services />
        <ChipJourney />
        <WhyUs />
        <Contact />
      </div>
    </>
  )
}
