// components/ui/barrier-model.tsx
'use client'

import React, { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface BarrierModelProps {
  position?: [number, number, number]
  scale?: number | [number, number, number]
}

const BarrierModel: React.FC<BarrierModelProps> = ({ position = [0, 0, 0], scale = 0.03 }) => {
  const { scene } = useGLTF('/barrier/scene.gltf')

  // Clone scene để tránh việc các instance dùng chung object
  const clonedScene = useMemo(() => scene.clone(true), [scene])
useEffect(() => {
  console.log('Loaded GLTF scene:', scene)
  console.log('Cloned scene:', clonedScene)
}, [scene, clonedScene])

  return (
    <primitive
      object={clonedScene}
      position={position as THREE.Vector3Tuple}
      scale={Array.isArray(scale) ? (scale as THREE.Vector3Tuple) : [scale, scale, scale]}
    />
  )
}

export default BarrierModel
