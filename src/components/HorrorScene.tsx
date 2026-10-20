'use client'

import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei'
import * as THREE from 'three'

interface HorrorSceneProps {
  wrongGuesses: number
  maxGuesses?: number
  highContrast?: boolean
  reduceMotion?: boolean
}

function SceneContent({ wrongGuesses, highContrast, reduceMotion }: { wrongGuesses: number; highContrast?: boolean; reduceMotion?: boolean }) {
  const lightRef = useRef<THREE.PointLight>(null)
  const victimRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!reduceMotion && lightRef.current) {
      const time = clock.getElapsedTime()
      lightRef.current.intensity = 2.2 + wrongGuesses * 0.4 + Math.sin(time * 12) * 0.5
    }
    if (!reduceMotion && victimRef.current && wrongGuesses >= 4) {
      const time = clock.getElapsedTime()
      victimRef.current.rotation.z = Math.sin(time * 3) * 0.06
    }
  })

  const beamColor = wrongGuesses >= 5 ? '#ff0000' : '#ff3333'
  // Bright amber wood color for maximum visibility
  const postColor = highContrast ? '#ffffff' : '#f59e0b'
  const victimColor = highContrast ? '#ff0000' : '#450a0a'

  return (
    <>
      <color attach="background" args={['#080808']} />
      
      {/* High-intensity lighting */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 5, 4]} intensity={2.5} color="#ffffff" />
      
      <pointLight
        ref={lightRef}
        position={[0, 2, 2]}
        color={beamColor}
        distance={12}
        decay={1}
      />

      {/* Projection Screen Background - Sepia Film Tone */}
      <mesh position={[0, 0, -2.2]}>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial
          color={highContrast ? '#111111' : '#c2a888'}
          roughness={0.5}
        />
      </mesh>

      {/* Countdown Leader Rings on Screen */}
      <mesh position={[0, 0, -2.1]}>
        <ringGeometry args={[2.0, 2.1, 32]} />
        <meshBasicMaterial color="#554433" />
      </mesh>
      <mesh position={[0, 0, -2.1]}>
        <ringGeometry args={[3.2, 3.25, 32]} />
        <meshBasicMaterial color="#443322" />
      </mesh>

      {/* Countdown Number */}
      <Text
        position={[0, 0.1, -2.0]}
        fontSize={3.5}
        color="#332211"
        anchorX="center"
        anchorY="middle"
      >
        10
      </Text>

      {/* --- BRIGHT GALLOWS FRAME --- */}
      {/* Vertical Post */}
      <mesh position={[-1.4, -0.1, 0]}>
        <boxGeometry args={[0.35, 4.5, 0.35]} />
        <meshStandardMaterial color={postColor} emissive="#78350f" emissiveIntensity={0.5} roughness={0.3} />
      </mesh>
      
      {/* Top Beam */}
      <mesh position={[-0.1, 2.0, 0]}>
        <boxGeometry args={[2.8, 0.35, 0.35]} />
        <meshStandardMaterial color={postColor} emissive="#78350f" emissiveIntensity={0.5} roughness={0.3} />
      </mesh>

      {/* --- PROGRESSIVE TRAP MECHANISMS --- */}
      {wrongGuesses >= 1 && (
        <mesh position={[-0.9, 1.5, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[1.1, 0.25, 0.25]} />
          <meshStandardMaterial color={postColor} emissive="#78350f" emissiveIntensity={0.5} roughness={0.3} />
        </mesh>
      )}

      {wrongGuesses >= 2 && (
        <mesh position={[1.1, 1.8, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#404040" metalness={0.9} roughness={0.2} />
        </mesh>
      )}

      {wrongGuesses >= 3 && (
        <mesh position={[1.1, 1.2, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.9]} />
          <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.1} />
        </mesh>
      )}

      {/* Hanging Victim Rig */}
      <group ref={victimRef} position={[1.1, 0.3, 0]}>
        {wrongGuesses >= 4 && (
          <mesh position={[0, 0.55, 0]}>
            <sphereGeometry args={[0.32, 20, 20]} />
            <meshStandardMaterial color={highContrast ? '#ffffff' : '#fcd34d'} roughness={0.3} />
          </mesh>
        )}
        
        {wrongGuesses >= 5 && (
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.24, 0.18, 1.0]} />
            <meshStandardMaterial color={victimColor} roughness={0.4} />
          </mesh>
        )}

        {wrongGuesses >= 6 && (
          <mesh position={[0, -0.9, 0]}>
            <boxGeometry args={[0.75, 0.5, 0.4]} />
            <meshStandardMaterial color="#dc2626" metalness={0.6} roughness={0.2} />
          </mesh>
        )}
      </group>
    </>
  )
}

export default function HorrorScene({ wrongGuesses, maxGuesses = 6, highContrast = false, reduceMotion = false }: HorrorSceneProps) {
  return (
    <div className="w-full h-80 md:h-96 rounded-2xl overflow-hidden border-2 border-red-950/80 shadow-[0_0_35px_rgba(0,0,0,0.95)] bg-black relative group">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0.1, 4.6]} fov={52} />
        <SceneContent wrongGuesses={wrongGuesses} highContrast={highContrast} reduceMotion={reduceMotion} />
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  )
}