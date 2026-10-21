'use client'

import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Float, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

interface HorrorSceneProps {
  wrongGuesses: number
  maxGuesses: number
  highContrast?: boolean
  reduceMotion?: boolean
}

function ProjectorAndReel({ wrongGuesses, maxGuesses }: { wrongGuesses: number; maxGuesses: number }) {
  const reelRef = useRef<THREE.Group>(null)
  const chassisRef = useRef<THREE.Group>(null)
  const beamRef = useRef<THREE.Mesh>(null)

  const progress = wrongGuesses / maxGuesses

  const beamColor = progress >= 1 ? '#ef4444' : progress > 0.5 ? '#f59e0b' : '#22c55e'
  const heatColor = progress >= 1 ? '#ef4444' : progress > 0.3 ? '#f97316' : '#27272a'

  useFrame((state, delta) => {
    if (reelRef.current) {
      const spinSpeed = progress >= 1 ? 0 : Math.max(0.1, 3.5 - progress * 3.0)
      reelRef.current.rotation.z -= delta * spinSpeed

      if (wrongGuesses > 0) {
        const intensity = progress * 0.25
        reelRef.current.position.x = (Math.random() - 0.5) * intensity
        reelRef.current.position.y = (Math.random() - 0.5) * intensity
        reelRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 15) * intensity
        reelRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 12) * intensity
      } else {
        reelRef.current.position.set(0, 0, 0)
        reelRef.current.rotation.x = 0
        reelRef.current.rotation.y = 0
      }
    }

    if (chassisRef.current && wrongGuesses > 0) {
      chassisRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 25) * 0.02 * wrongGuesses
      chassisRef.current.position.y = (Math.random() - 0.5) * 0.03 * wrongGuesses
    }

    if (beamRef.current) {
      const flicker = Math.sin(state.clock.elapsedTime * (15 + wrongGuesses * 10)) * 0.15
      beamRef.current.scale.x = 1 + flicker
      beamRef.current.scale.z = 1 + flicker
    }
  })

  return (
    <group ref={chassisRef} position={[0, 0.1, 0]}>
      {/* PROJECTOR CHASSIS */}
      <mesh position={[-1.2, -0.4, 0]}>
        <boxGeometry args={[1.8, 1.4, 1.2]} />
        <meshStandardMaterial 
          color={heatColor} 
          roughness={0.4} 
          metalness={0.7}
          emissive={heatColor}
          emissiveIntensity={progress * 0.8}
        />
      </mesh>

      {/* Vent Grille */}
      <mesh position={[-1.2, 0.31, 0]}>
        <boxGeometry args={[1.2, 0.05, 0.8]} />
        <meshStandardMaterial color={wrongGuesses > 2 ? '#ef4444' : '#18181b'} emissive={wrongGuesses > 2 ? '#ef4444' : '#000000'} emissiveIntensity={0.6} />
      </mesh>

      {/* Lens Barrel */}
      <mesh position={[-0.1, -0.2, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.25, 0.6, 16]} />
        <meshStandardMaterial color={wrongGuesses > 3 ? '#991b1b' : '#52525b'} roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Lens Glow */}
      <mesh position={[0.2, -0.2, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 0.05, 16]} />
        <meshBasicMaterial color={beamColor} />
      </mesh>

      {/* 35MM REEL */}
      <group position={[-1.2, 1.1, 0]}>
        <mesh position={[0, -0.4, 0]}>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshStandardMaterial color="#3f3f46" roughness={0.5} />
        </mesh>

        <group ref={reelRef}>
          <mesh>
            <torusGeometry args={[0.8, 0.06, 16, 32]} />
            <meshStandardMaterial color={progress >= 1 ? '#7f1d1d' : '#e4e4e7'} roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh>
            <cylinderGeometry args={[0.74, 0.74, 0.1, 32]} />
            <meshStandardMaterial color="#18181b" roughness={0.9} />
          </mesh>
          {[0, Math.PI / 3, (2 * Math.PI) / 3].map((angle, i) => (
            <mesh key={i} rotation={[0, 0, angle]}>
              <boxGeometry args={[1.5, 0.08, 0.04]} />
              <meshStandardMaterial color="#a1a1aa" roughness={0.3} metalness={0.8} />
            </mesh>
          ))}
        </group>
      </group>

      {/* PROJECTION BEAM */}
      <mesh ref={beamRef} position={[2.2, -0.2, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[1.2, 3.8, 32, 1, true]} />
        <meshBasicMaterial
          color={beamColor}
          transparent
          opacity={progress >= 1 ? 0.45 : 0.25}
          side={THREE.DoubleSide}
        />
      </mesh>

      <pointLight
        position={[0.3, -0.2, 0]}
        intensity={progress >= 1 ? 14 : 5 + wrongGuesses * 1.5}
        color={beamColor}
        distance={6}
      />

      {wrongGuesses > 1 && (
        <pointLight
          position={[-1.2, -0.2, 0]}
          intensity={wrongGuesses * 3}
          color="#ef4444"
          distance={3}
        />
      )}
    </group>
  )
}

export default function HorrorScene({
  wrongGuesses,
  maxGuesses,
  highContrast = false,
  reduceMotion = false,
}: HorrorSceneProps) {
  const progress = wrongGuesses / maxGuesses

  return (
    <div className="w-full h-full relative bg-black">
      <Canvas gl={{ antialias: true }}>
        <PerspectiveCamera
          makeDefault
          position={[0, 0.2, 6.5]}
          fov={48}
        />

        <ambientLight intensity={highContrast ? 0.7 : 0.4} />
        <directionalLight position={[4, 6, 4]} intensity={1.5} color="#fef08a" castShadow />
        <pointLight position={[-3, -1, -2]} intensity={0.6} color="#22c55e" />

        <color attach="background" args={['#0c0a09']} />

        {!reduceMotion && (
          <Sparkles
            count={wrongGuesses > 0 ? 20 + wrongGuesses * 15 : 15}
            scale={[7, 5, 5]}
            size={wrongGuesses > 2 ? 3.5 : 2.0}
            speed={wrongGuesses > 2 ? 1.4 : 0.4}
            color={progress >= 1 ? '#dc2626' : wrongGuesses > 2 ? '#f97316' : '#22c55e'}
          />
        )}

        <Float
          speed={reduceMotion ? 0 : 1.0 + progress * 1.5}
          rotationIntensity={0.05 + progress * 0.1}
          floatIntensity={0.15}
        >
          <ProjectorAndReel wrongGuesses={wrongGuesses} maxGuesses={maxGuesses} />
        </Float>
      </Canvas>
    </div>
  )
}