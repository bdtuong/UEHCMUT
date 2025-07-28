'use client'

import React, { useEffect, useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface BarrierModelProps {
  position?: [number, number, number]
  rotation?: [number, number, number] // 👈 Thêm rotation
  scale?: number | [number, number, number]
}

const BarrierModel: React.FC<BarrierModelProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0], // 👈 Giá trị mặc định
  scale = 0.03
}) => {
  const { scene } = useGLTF('/barrier/scene.gltf')

  // Clone scene để tránh chia sẻ đối tượng giữa các instance
  const clonedScene = useMemo(() => scene.clone(true), [scene])

  useEffect(() => {
    console.log('Loaded GLTF scene:', scene)
    console.log('Cloned scene:', clonedScene)
  }, [scene, clonedScene])

  return (
    <primitive
      object={clonedScene}
      position={position as THREE.Vector3Tuple}
      rotation={rotation as unknown as THREE.Euler} // 👈 Thêm dòng này
      scale={Array.isArray(scale) ? (scale as THREE.Vector3Tuple) : [scale, scale, scale]}
    />
  )
}

export default BarrierModel
