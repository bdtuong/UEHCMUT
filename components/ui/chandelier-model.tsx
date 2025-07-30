// components/ui/plant-model.tsx
'use client'

import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface ChandelierModelProps {
  position?: [number, number, number]
  scale?: number | [number, number, number]
}

const ChandelierModel: React.FC<ChandelierModelProps> = ({ position = [0, 0, 0], scale = 0.01 }) => {
  const { scene } = useGLTF('/chandelier/scene.gltf')

  // Clone scene để tránh việc các instance dùng chung object
  const clonedScene = useMemo(() => scene.clone(true), [scene])

  return (
    <primitive
      object={clonedScene}
      position={position as THREE.Vector3Tuple}
      scale={Array.isArray(scale) ? (scale as THREE.Vector3Tuple) : [scale, scale, scale]}
    />
  )
}

export default ChandelierModel
