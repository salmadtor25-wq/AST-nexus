import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticleField({ count = 3000 }) {
  const mesh = useRef()

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const sz = new Float32Array(count)

    const gold = new THREE.Color('#c9a84c')
    const cyan = new THREE.Color('#00d4ff')
    const blue = new THREE.Color('#0040aa')

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Spread particles in a wide sphere around the chip
      const r = 3 + Math.random() * 18
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      pos[i3] = r * Math.sin(phi) * Math.cos(theta)
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i3 + 2] = r * Math.cos(phi)

      // Mix colors
      const mix = Math.random()
      let c
      if (mix < 0.3) c = gold
      else if (mix < 0.6) c = cyan
      else c = blue

      col[i3] = c.r + (Math.random() - 0.5) * 0.2
      col[i3 + 1] = c.g + (Math.random() - 0.5) * 0.2
      col[i3 + 2] = c.b + (Math.random() - 0.5) * 0.2

      sz[i] = Math.random() * 1.5 + 0.2
    }
    return [pos, col, sz]
  }, [count])

  useFrame(({ clock }) => {
    if (!mesh.current) return
    mesh.current.rotation.y = clock.getElapsedTime() * 0.02
    mesh.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.015) * 0.1
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
