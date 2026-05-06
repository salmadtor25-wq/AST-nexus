import { useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Environment, Stars } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import Chip from './Chip'
import ParticleField from './ParticleField'
import DataStreams from './DataStreams'

// Camera keyframes: [scrollProgress, position, lookAt]
const CAM_KEYS = [
  { t: 0.00, pos: [0, 4.5, 18], look: [0, 0, 0] },   // Hero — wide establishing shot
  { t: 0.12, pos: [0, 3.0, 13], look: [0, 0, 0] },   // About — closer approach
  { t: 0.25, pos: [1.5, 2.0, 8], look: [0, 0, 0] },  // Services — angle in
  { t: 0.38, pos: [0, 1.2, 5], look: [0, 0, 0] },    // Services lower
  { t: 0.50, pos: [0, 0.6, 2.8], look: [0, 0.1, 0] }, // Approaching chip surface
  { t: 0.60, pos: [0.3, 0.28, 1.2], look: [0, 0.18, 0] }, // On chip surface
  { t: 0.68, pos: [0.8, 0.22, 0.4], look: [0, 0.18, 0] }, // Inside — looking across die
  { t: 0.76, pos: [-0.5, 0.22, -0.1], look: [0, 0.18, 0.5] }, // Deep inside chip
  { t: 0.85, pos: [0, 0.5, 1.8], look: [0, 0.1, 0] },  // Why Us — pulling out
  { t: 1.00, pos: [0, 2.5, 9], look: [0, 0, 0] },    // Contact — wide final
]

function lerp3(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ]
}

function CameraController() {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(...CAM_KEYS[0].pos))
  const targetLook = useRef(new THREE.Vector3(...CAM_KEYS[0].look))

  useFrame(() => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    const progress = maxScroll > 0 ? Math.min(window.scrollY / maxScroll, 1) : 0

    // Find bracketing keyframes
    let k0 = CAM_KEYS[0]
    let k1 = CAM_KEYS[1]
    for (let i = 0; i < CAM_KEYS.length - 1; i++) {
      if (progress >= CAM_KEYS[i].t && progress <= CAM_KEYS[i + 1].t) {
        k0 = CAM_KEYS[i]
        k1 = CAM_KEYS[i + 1]
        break
      }
    }

    const span = k1.t - k0.t
    const local = span > 0 ? (progress - k0.t) / span : 0
    const ease = local < 0.5 ? 2 * local * local : -1 + (4 - 2 * local) * local

    const newPos = lerp3(k0.pos, k1.pos, ease)
    const newLook = lerp3(k0.look, k1.look, ease)

    targetPos.current.set(...newPos)
    targetLook.current.set(...newLook)

    // Smooth damp toward target
    camera.position.lerp(targetPos.current, 0.06)
    const currentLook = new THREE.Vector3()
    camera.getWorldDirection(currentLook)
    const desiredLook = targetLook.current.clone().sub(camera.position).normalize()
    const blendedDir = currentLook.lerp(desiredLook, 0.06)
    camera.lookAt(camera.position.clone().add(blendedDir))
  })

  return null
}

function Lights() {
  const rimRef = useRef()
  const fillRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (rimRef.current) {
      rimRef.current.intensity = 0.8 + Math.sin(t * 0.5) * 0.2
    }
    if (fillRef.current) {
      fillRef.current.intensity = 0.4 + Math.sin(t * 0.3 + 1) * 0.1
    }
  })

  return (
    <>
      {/* Key light — warm gold from top-right */}
      <directionalLight
        position={[5, 8, 3]}
        intensity={1.2}
        color="#f0c878"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      {/* Rim light — cyan from behind-left */}
      <directionalLight
        ref={rimRef}
        position={[-6, 3, -5]}
        intensity={0.8}
        color="#00d4ff"
      />
      {/* Fill light — deep blue from below */}
      <pointLight
        ref={fillRef}
        position={[0, -3, 0]}
        intensity={0.4}
        color="#0033aa"
      />
      {/* Chip top glow */}
      <pointLight
        position={[0, 1.5, 0]}
        intensity={0.6}
        color="#0044ff"
        distance={6}
      />
      {/* Gold accent point */}
      <pointLight
        position={[2, 0.5, 2]}
        intensity={0.5}
        color="#c9a84c"
        distance={4}
      />
      {/* Ambient */}
      <ambientLight intensity={0.12} color="#000820" />
    </>
  )
}

function SceneFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial
        color="#000510"
        metalness={0.4}
        roughness={0.8}
      />
    </mesh>
  )
}

export default function Scene() {
  return (
    <>
      <CameraController />
      <Lights />
      <SceneFloor />

      {/* Deep space stars */}
      <Stars
        radius={80}
        depth={50}
        count={3000}
        factor={3}
        saturation={0.3}
        fade
        speed={0.3}
      />

      {/* Main chip model */}
      <Chip />

      {/* Ambient particles */}
      <ParticleField count={2500} />

      {/* Data streams on circuit traces */}
      <DataStreams />

      {/* Fog for depth */}
      <fog attach="fog" args={['#000510', 20, 60]} />

      {/* Post-processing */}
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.8}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.0008, 0.0008]}
          radialModulation={false}
        />
      </EffectComposer>
    </>
  )
}
