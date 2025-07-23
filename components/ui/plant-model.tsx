// components/ui/plant-model.tsx
'use client'

import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface PlantModelProps {
  position?: [number, number, number]
  scale?: number | [number, number, number]
}

const PlantModel: React.FC<PlantModelProps> = ({ position = [0, 0, 0], scale = 0.5 }) => {
  const { scene } = useGLTF('/plant/scene.gltf')

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

export default PlantModel
