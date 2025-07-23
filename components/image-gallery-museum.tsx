'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import PlantModel from './ui/plant-model'
import { TextureLoader } from 'three'

// Interface mô tả thông tin của một bức tranh
interface ImageData {
  id: string
  title: string
  artist: string
  description: string
  imageUrl: string
  position: [number, number, number]
  size: [number, number]
}

// Mảng chỉ chứa 1 tranh duy nhất để trưng bày
const SAMPLE_IMAGES: ImageData[] = [
  {
    id: '1',
    title: 'Only One Image',
    artist: 'Your Name',
    description: 'Displayed in the center of the wall.',
    imageUrl: '/mock-img.jpg', // hình ảnh nằm trong thư mục /public
    position: [0, 1.5, -1.8],
    size: [6, 3.5], // Kích thước to cho giống bảo tàng
  },
]

// Component khung tranh hiển thị ảnh + viền khung
const ImageFrame: React.FC<{ imageData: ImageData }> = ({ imageData }) => {
  const texture = useLoader(TextureLoader, imageData.imageUrl) // Load ảnh từ public
  const width = imageData.size[0]
  const height = imageData.size[1]
  const frameThickness = 0.05
  const frameColor = '#5a3e1b' // Màu khung nâu trầm

  return (
    <group position={imageData.position}>
      {/* Khung viền trên */}
      <mesh position={[0, height / 2 + frameThickness / 2, -0.01]}>
        <boxGeometry args={[width + 2 * frameThickness, frameThickness, 0.02]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>

      {/* Khung viền dưới */}
      <mesh position={[0, -height / 2 - frameThickness / 2, -0.01]}>
        <boxGeometry args={[width + 2 * frameThickness, frameThickness, 0.02]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>

      {/* Khung viền trái */}
      <mesh position={[-width / 2 - frameThickness / 2, 0, -0.01]}>
        <boxGeometry args={[frameThickness, height, 0.02]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>

      {/* Khung viền phải */}
      <mesh position={[width / 2 + frameThickness / 2, 0, -0.01]}>
        <boxGeometry args={[frameThickness, height, 0.02]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>

      {/* Hình ảnh chính */}
      <mesh>
        <planeGeometry args={imageData.size} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  )
}

// Điều khiển camera kéo trái/phải để nhìn xung quanh
const CameraController = () => {
  const { camera, gl } = useThree()
  const isDragging = useRef(false)
  const lastX = useRef(0)
  const rotationY = useRef(0)

  useEffect(() => {
    const canvas = gl.domElement

    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true
      lastX.current = e.clientX
      canvas.style.cursor = 'grabbing'
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return
      const deltaX = e.clientX - lastX.current
      rotationY.current -= deltaX * 0.005
      rotationY.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotationY.current))

      camera.position.x = Math.sin(rotationY.current) * 8
      camera.position.z = Math.cos(rotationY.current) * 8
      camera.lookAt(0, 0, -2)

      lastX.current = e.clientX
    }

    const onPointerUp = () => {
      isDragging.current = false
      canvas.style.cursor = 'grab'
    }

    canvas.style.cursor = 'grab'
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
    }
  }, [camera, gl])

  return null
}

// Các mặt của căn phòng + đèn
const WallBackground = () => {
  const floorTexture = useLoader(TextureLoader, '/wood-floor.jpg')
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
  floorTexture.repeat.set(4, 2)

  const wallTexture = useLoader(TextureLoader, '/wall.jpg')
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping
  wallTexture.repeat.set(2, 2)

  return (
    <>
      {/* Tường sau */}
      <mesh position={[0, 0, -2.2]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial map={wallTexture} />
      </mesh>

      {/* Sàn */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial map={floorTexture} />
      </mesh>

      {/* Trần nhà */}
      <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial map={wallTexture} />
      </mesh>

      {/* Tường trái */}
      <mesh position={[-10, 0, -2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial map={wallTexture} />
      </mesh>

      {/* Tường phải */}
      <mesh position={[10, 0, -2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial map={wallTexture} />
      </mesh>

      {/* Đèn bóng (visual) */}
      <mesh position={[0, 3.95, -2]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="white" emissive="#fffacd" emissiveIntensity={2} />
      </mesh>

      {/* Nguồn sáng điểm */}
      <pointLight
        position={[0, 3.8, -2]}
        intensity={1.8}
        distance={15}
        color="#fffacd"
        castShadow
      />
    </>
  )
}

// Component chính hiển thị phòng trưng bày
const Gallery3D: React.FC = () => {
  return (
    <div className="w-full h-screen relative">
      <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 5] }}>
        {/* Ánh sáng môi trường và bổ sung */}
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        {/* Điều khiển xoay camera */}
        <CameraController />

        {/* Tường + nền + trần */}
        <WallBackground />

        {/* Cây cảnh hai bên cho đẹp */}
        <PlantModel position={[-8.5, -3, -1.0]} />
        <PlantModel position={[8.5, -3, -1.0]} />

        {/* Hiển thị ảnh trong khung */}
        {SAMPLE_IMAGES.map((imageData) => (
          <ImageFrame key={imageData.id} imageData={imageData} />
        ))}
      </Canvas>

      {/* Gợi ý hướng dẫn người dùng */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
        <p className="text-sm">Click and drag horizontally to look around</p>
      </div>
    </div>
  )
}

export default Gallery3D
