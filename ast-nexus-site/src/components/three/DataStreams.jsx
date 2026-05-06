import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// One animated data stream moving along a circuit path
function StreamLine({ points, color, speed = 1, offset = 0 }) {
  const meshRef = useRef()
  const progressRef = useRef(offset)

  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      points.map(p => new THREE.Vector3(...p))
    )
  }, [points])

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 40, 0.003, 4, false)
  }, [curve])

  const particles = useMemo(() => {
    const count = 5
    return Array.from({ length: count }, (_, i) => i / count)
  }, [])

  const particleMeshes = useRef([])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    progressRef.current = (t * speed * 0.08) % 1

    particleMeshes.current.forEach((mesh, i) => {
      if (!mesh) return
      const progress = (progressRef.current + i * 0.2) % 1
      const pt = curve.getPoint(progress)
      mesh.position.copy(pt)
    })
  })

  return (
    <group>
      {/* Tube trace */}
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.25}
        />
      </mesh>
      {/* Moving particles on the trace */}
      {particles.map((_, i) => (
        <mesh
          key={i}
          ref={el => (particleMeshes.current[i] = el)}
        >
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={2.5}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function DataStreams() {
  const streams = useMemo(() => [
    {
      points: [[-2, 0.06, -1], [-1.5, 0.06, -1], [-1.5, 0.06, 0], [-0.5, 0.06, 0]],
      color: '#00d4ff', speed: 1.2, offset: 0,
    },
    {
      points: [[2, 0.06, 1], [1.5, 0.06, 1], [1.5, 0.06, 0], [0.5, 0.06, 0]],
      color: '#c9a84c', speed: 0.8, offset: 0.3,
    },
    {
      points: [[-2, 0.06, 1], [-2, 0.06, 0.5], [-1, 0.06, 0.5], [-1, 0.06, -0.5]],
      color: '#00ffcc', speed: 1.5, offset: 0.6,
    },
    {
      points: [[2, 0.06, -1], [2, 0.06, -0.5], [1, 0.06, -0.5], [1, 0.06, 0.5]],
      color: '#00d4ff', speed: 0.9, offset: 0.1,
    },
    {
      points: [[0, 0.06, -2], [0, 0.06, -1.5], [0.5, 0.06, -1.5], [0.5, 0.06, 0]],
      color: '#c9a84c', speed: 1.1, offset: 0.4,
    },
    {
      points: [[0, 0.06, 2], [-0.5, 0.06, 2], [-0.5, 0.06, 1], [-0.5, 0.06, 0]],
      color: '#0077ff', speed: 1.3, offset: 0.7,
    },
  ], [])

  return (
    <group>
      {streams.map((s, i) => (
        <StreamLine key={i} {...s} />
      ))}
    </group>
  )
}
