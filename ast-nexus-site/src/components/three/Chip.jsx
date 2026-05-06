import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Individual glowing node
function Node({ position, color = '#00d4ff', scale = 1 }) {
  const mesh = useRef()
  const baseY = position[1]

  useFrame(({ clock }) => {
    if (!mesh.current) return
    mesh.current.position.y = baseY + Math.sin(clock.getElapsedTime() * 1.5 + position[0] * 5) * 0.006
    const pulse = 0.5 + Math.sin(clock.getElapsedTime() * 2 + position[2] * 3) * 0.5
    mesh.current.material.emissiveIntensity = 0.8 + pulse * 1.2
  })

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[0.018 * scale, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1}
        metalness={0.3}
        roughness={0.2}
      />
    </mesh>
  )
}

// Circuit trace line
function Trace({ start, end, color = '#c9a84c', width = 0.006 }) {
  const geometry = useMemo(() => {
    const dir = new THREE.Vector3(...end).sub(new THREE.Vector3(...start))
    const length = dir.length()
    const geo = new THREE.BoxGeometry(length, width, width)
    return geo
  }, [start, end, width])

  const midpoint = useMemo(() =>
    [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2, (start[2] + end[2]) / 2],
  [start, end])

  const rotation = useMemo(() => {
    const dir = new THREE.Vector3(...end).sub(new THREE.Vector3(...start)).normalize()
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(1, 0, 0), dir
    )
    return new THREE.Euler().setFromQuaternion(q)
  }, [start, end])

  return (
    <mesh
      geometry={geometry}
      position={midpoint}
      rotation={rotation}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  )
}

// Gold pin on chip edge
function Pin({ position }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.04, 0.06, 0.012]} />
      <meshStandardMaterial
        color="#c9a84c"
        emissive="#c9a84c"
        emissiveIntensity={0.2}
        metalness={0.95}
        roughness={0.05}
      />
    </mesh>
  )
}

export default function Chip() {
  const groupRef = useRef()
  const innerGlowRef = useRef()

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    // Very gentle floating + rotation
    groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.12) * 0.06
    groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.05
  })

  // Generate circuit traces on PCB
  const pcbTraces = useMemo(() => {
    const traces = []
    const h = 0.055
    // Horizontal traces
    for (let row = -4; row <= 4; row++) {
      const z = row * 0.38
      const startX = -2.4 + Math.random() * 0.4
      const endX = 2.4 - Math.random() * 0.4
      traces.push({ start: [startX, h, z], end: [endX, h, z], color: '#1a4030' })
    }
    // Vertical traces
    for (let col = -5; col <= 5; col++) {
      const x = col * 0.4
      traces.push({ start: [x, h, -2.4], end: [x, h, 2.4], color: '#1a4030' })
    }
    // Gold accent traces near chip
    const goldTraces = [
      { start: [-0.85, h, -0.85], end: [-2.2, h, -0.85], color: '#c9a84c', width: 0.008 },
      { start: [-0.85, h, 0.85], end: [-2.2, h, 0.85], color: '#c9a84c', width: 0.008 },
      { start: [0.85, h, -0.85], end: [2.2, h, -0.85], color: '#c9a84c', width: 0.008 },
      { start: [0.85, h, 0.85], end: [2.2, h, 0.85], color: '#c9a84c', width: 0.008 },
      { start: [-0.85, h, 0], end: [-2.2, h, 0], color: '#c9a84c', width: 0.008 },
      { start: [0.85, h, 0], end: [2.2, h, 0], color: '#c9a84c', width: 0.008 },
      { start: [0, h, -0.85], end: [0, h, -2.2], color: '#00d4ff', width: 0.008 },
      { start: [0, h, 0.85], end: [0, h, 2.2], color: '#00d4ff', width: 0.008 },
    ]
    return [...traces, ...goldTraces]
  }, [])

  // Nodes on the PCB
  const pcbNodes = useMemo(() => {
    const nodes = []
    const h = 0.072
    // Via holes / solder points
    for (let i = 0; i < 60; i++) {
      nodes.push({
        position: [(Math.random() - 0.5) * 4.5, h, (Math.random() - 0.5) * 4.5],
        color: Math.random() > 0.5 ? '#c9a84c' : '#00d4ff',
        scale: 0.4 + Math.random() * 0.6,
      })
    }
    // Special bright nodes along gold traces
    for (let x = -2; x <= 2; x += 0.5) {
      nodes.push({ position: [x, h, 0], color: '#c9a84c', scale: 0.5 })
      nodes.push({ position: [0, h, x], color: '#00d4ff', scale: 0.5 })
    }
    return nodes
  }, [])

  // Chip pins (QFP style)
  const pins = useMemo(() => {
    const pins = []
    const chipSize = 0.85
    const pinCount = 10
    const spacing = (chipSize * 2) / (pinCount + 1)
    const y = 0.09

    // Left + right sides
    for (let i = 1; i <= pinCount; i++) {
      const z = -chipSize + i * spacing
      pins.push({ position: [-chipSize - 0.06, y, z] })
      pins.push({ position: [chipSize + 0.06, y, z] })
    }
    // Top + bottom sides
    for (let i = 1; i <= pinCount; i++) {
      const x = -chipSize + i * spacing
      pins.push({ position: [x, y, -chipSize - 0.06] })
      pins.push({ position: [x, y, chipSize + 0.06] })
    }
    return pins
  }, [])

  // Internal die circuit grid nodes
  const dieNodes = useMemo(() => {
    const nodes = []
    const h = 0.16
    for (let x = -6; x <= 6; x++) {
      for (let z = -6; z <= 6; z++) {
        if (Math.abs(x) <= 6 && Math.abs(z) <= 6) {
          nodes.push({
            position: [x * 0.12, h, z * 0.12],
            color: Math.random() > 0.6 ? '#c9a84c' : Math.random() > 0.5 ? '#00d4ff' : '#0055aa',
            scale: 0.3 + Math.random() * 0.4,
          })
        }
      }
    }
    return nodes
  }, [])

  return (
    <group ref={groupRef}>

      {/* ─── PCB BOARD ──────────────────────────────── */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[5.5, 0.1, 5.5]} />
        <meshStandardMaterial
          color="#080e08"
          metalness={0.3}
          roughness={0.7}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* PCB top surface slight sheen */}
      <mesh position={[0, 0.052, 0]}>
        <boxGeometry args={[5.5, 0.002, 5.5]} />
        <meshStandardMaterial
          color="#0d1a0d"
          metalness={0.5}
          roughness={0.4}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* PCB Circuit traces */}
      {pcbTraces.map((t, i) => (
        <Trace key={`pcbt-${i}`} {...t} />
      ))}

      {/* PCB nodes */}
      {pcbNodes.map((n, i) => (
        <Node key={`pcbn-${i}`} {...n} />
      ))}

      {/* ─── CHIP BODY ──────────────────────────────── */}
      <group position={[0, 0, 0]}>
        {/* Main chip housing */}
        <mesh position={[0, 0.13, 0]} castShadow>
          <boxGeometry args={[1.75, 0.16, 1.75]} />
          <meshStandardMaterial
            color="#080808"
            metalness={0.6}
            roughness={0.25}
          />
        </mesh>

        {/* Top face — dark die area */}
        <mesh position={[0, 0.212, 0]}>
          <boxGeometry args={[1.5, 0.006, 1.5]} />
          <meshStandardMaterial
            color="#020208"
            metalness={0.7}
            roughness={0.15}
          />
        </mesh>

        {/* Gold border ring */}
        <mesh position={[0, 0.205, 0]}>
          <boxGeometry args={[1.72, 0.004, 1.72]} />
          <meshStandardMaterial
            color="#c9a84c"
            emissive="#c9a84c"
            emissiveIntensity={0.3}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>

        {/* Inner die face */}
        <mesh position={[0, 0.218, 0]}>
          <boxGeometry args={[1.45, 0.003, 1.45]} />
          <meshStandardMaterial
            color="#0a0015"
            emissive="#000822"
            emissiveIntensity={0.5}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* Die internal circuit grid */}
        {dieNodes.map((n, i) => (
          <Node key={`die-${i}`} {...n} />
        ))}

        {/* Die circuit horizontal lines */}
        {[-0.48, -0.24, 0, 0.24, 0.48].map((z, i) => (
          <mesh key={`dh-${i}`} position={[0, 0.222, z]}>
            <boxGeometry args={[1.3, 0.002, 0.003]} />
            <meshStandardMaterial
              color="#00d4ff"
              emissive="#00d4ff"
              emissiveIntensity={0.3}
              transparent
              opacity={0.6}
            />
          </mesh>
        ))}
        {[-0.48, -0.24, 0, 0.24, 0.48].map((x, i) => (
          <mesh key={`dv-${i}`} position={[x, 0.222, 0]}>
            <boxGeometry args={[0.003, 0.002, 1.3]} />
            <meshStandardMaterial
              color="#c9a84c"
              emissive="#c9a84c"
              emissiveIntensity={0.3}
              transparent
              opacity={0.6}
            />
          </mesh>
        ))}

        {/* Chip label */}
        <mesh position={[0, 0.225, 0.35]}>
          <boxGeometry args={[0.5, 0.001, 0.06]} />
          <meshStandardMaterial
            color="#c9a84c"
            emissive="#c9a84c"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Pins */}
        {pins.map((p, i) => (
          <Pin key={`pin-${i}`} position={p.position} />
        ))}

        {/* Inner ambient glow beneath chip */}
        <mesh ref={innerGlowRef} position={[0, 0.06, 0]}>
          <boxGeometry args={[1.6, 0.01, 1.6]} />
          <meshStandardMaterial
            color="#0044ff"
            emissive="#0044ff"
            emissiveIntensity={1.5}
            transparent
            opacity={0.15}
          />
        </mesh>
      </group>

      {/* ─── CAPACITORS / RESISTORS ─────────────────── */}
      {[
        [-1.5, -0.5], [-1.5, 0.2], [-1.5, 0.9],
        [1.5, -0.7], [1.5, 0.3], [1.5, 1.1],
        [-0.5, -1.5], [0.3, -1.5], [1.1, -1.5],
        [-0.7, 1.5], [0.2, 1.5], [0.9, 1.5],
      ].map(([x, z], i) => (
        <group key={`cap-${i}`} position={[x, 0.085, z]}>
          <mesh>
            <boxGeometry args={[0.08, 0.06, 0.05]} />
            <meshStandardMaterial
              color={i % 3 === 0 ? '#1a1a2e' : i % 3 === 1 ? '#0d0d0d' : '#1a0d00'}
              metalness={0.4}
              roughness={0.6}
            />
          </mesh>
          {/* End caps */}
          {[-0.045, 0.045].map((dx, j) => (
            <mesh key={j} position={[dx, 0, 0]}>
              <boxGeometry args={[0.01, 0.062, 0.052]} />
              <meshStandardMaterial
                color="#c9a84c"
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* ─── EDGE GLOW ──────────────────────────────── */}
      {[[-2.75, 0, 0], [2.75, 0, 0], [0, 0, -2.75], [0, 0, 2.75]].map(([x, y, z], i) => (
        <mesh key={`edge-${i}`} position={[x, 0.055, z]} rotation={[0, i < 2 ? 0 : Math.PI / 2, 0]}>
          <boxGeometry args={[5.5, 0.002, 0.01]} />
          <meshStandardMaterial
            color="#00d4ff"
            emissive="#00d4ff"
            emissiveIntensity={0.8}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}
