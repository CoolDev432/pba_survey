'use client'

import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

function Model({ url, mouse }) {
  const group = useRef()
  const { scene, animations } = useGLTF(url)
  const { actions } = useAnimations(animations, group)
  const { camera } = useThree()

  // Play animation when loaded
  useEffect(() => {
    if (actions && Object.keys(actions).length) {
      const firstAction = actions[Object.keys(actions)[0]]
      firstAction.reset()
      firstAction.setLoop(THREE.LoopRepeat)
      firstAction.play()
    }
    return () => {
      if (actions) {
        Object.values(actions).forEach(a => {
          if (a && typeof a.stop === 'function') a.stop()
        })
      }
    }
  }, [actions])

  // Auto-center & frame model dynamically
  useEffect(() => {
    if (!group.current) return

    const box = new THREE.Box3().setFromObject(group.current)
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)

    // Re-center the model
    group.current.position.x += -center.x
    group.current.position.y += -center.y
    group.current.position.z += -center.z

    // Move camera back to fit the entire model
    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = camera.fov * (Math.PI / 180)
    let cameraZ = Math.abs(maxDim / Math.sin(fov / 2)) * 0.5

    camera.position.set(0, size.y * 0.1, cameraZ * 0.8)
    camera.lookAt(0, 0, 0)
  }, [scene, camera])

  // Smooth tilt based on mouse
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        mouse.current.x * 0.4,
        0.1
      )
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        -mouse.current.y * 0.25,
        0.1
      )
    }
  })

  return <primitive ref={group} object={scene} dispose={null} />
}

export default function ModelViewer({ src = '/Animation_Alert_withSkin.glb' }) {
  const [mounted, setMounted] = useState(false)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMouseMove = (event) => {
    const { innerWidth, innerHeight } = window
    mouse.current.x = (event.clientX / innerWidth) * 2 - 1
    mouse.current.y = (event.clientY / innerHeight) * 2 - 1
  }

  if (!mounted) return null

  return (
    <div
      onMouseMove={handleMouseMove}
      className="w-full h-[520px] flex items-center justify-center bg-transparent scale-100 p-20"
    >
      <Canvas
        camera={{ fov: 35, near: 0.1, far: 100 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          <Model url={src} mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  )
}

// Optional preload
try {
  useGLTF.preload && useGLTF.preload('/Animation_Alert_withSkin.glb')
} catch (e) {}
