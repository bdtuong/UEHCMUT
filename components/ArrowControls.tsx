// components/ArrowControls.tsx
'use client'

import React from 'react'
import * as THREE from 'three'

interface Props {
  camera: THREE.PerspectiveCamera | null
}

const ArrowControls: React.FC<Props> = ({ camera }) => {
  const moveCamera = (dx: number, dz: number) => {
    if (!camera) return

    const direction = new THREE.Vector3()
    camera.getWorldDirection(direction)
    direction.y = 0
    direction.normalize()

    const right = new THREE.Vector3()
    right.crossVectors(direction, camera.up).normalize()

    camera.position.addScaledVector(direction, dz)
    camera.position.addScaledVector(right, dx)
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  if (!isMobile) return null

  return (
    <div className="absolute bottom-10 left-5 z-50 flex flex-col items-center gap-2">
      <button onClick={() => moveCamera(0, -1)}>⬆</button>
      <div className="flex gap-2">
        <button onClick={() => moveCamera(-1, 0)}>⬅</button>
        <button onClick={() => moveCamera(1, 0)}>➡</button>
      </div>
      <button onClick={() => moveCamera(0, 1)}>⬇</button>
    </div>
  )
}

export default ArrowControls
