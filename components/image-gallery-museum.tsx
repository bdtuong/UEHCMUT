'use client'

import React, { useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useThree, useLoader, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { TextureLoader } from 'three'
import PlantModel from './ui/plant-model'
import BarrierModel from './ui/barrier-model'
import { OrbitControls } from '@react-three/drei'
import ArrowControls from './ArrowControls'

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
// Thêm nhiều tranh với vị trí mới và kích thước hợp lý
const SAMPLE_IMAGES: ImageData[] = [
  {
    id: '1',
    title: 'Wall Center',
    artist: 'Artist A',
    description: 'Center of back wall.',
    imageUrl: '/mock-img.jpg',
    position: [0, 1.5, -49.9], // gần sát tường sau
    size: [5, 3],
  },
  {
    id: '2',
    title: 'Left 1',
    artist: 'Artist B',
    description: 'Left wall.',
    imageUrl: '/mock-img.jpg',
    position: [-49.9, 1.5, -20],
    size: [4, 2.5],
  },
  {
    id: '3',
    title: 'Left 2',
    artist: 'Artist C',
    description: 'Left wall.',
    imageUrl: '/mock-img.jpg',
    position: [-49.9, 1.5, 20],
    size: [4, 2.5],
  },
  {
    id: '4',
    title: 'Right 1',
    artist: 'Artist D',
    description: 'Right wall.',
    imageUrl: '/mock-img.jpg',
    position: [49.9, 1.5, -20],
    size: [4, 2.5],
  },
  {
    id: '5',
    title: 'Right 2',
    artist: 'Artist E',
    description: 'Right wall.',
    imageUrl: '/mock-img.jpg',
    position: [49.9, 1.5, 20],
    size: [4, 2.5],
  },
  {
    id: '6',
    title: 'Front Center',
    artist: 'Artist F',
    description: 'Front wall.',
    imageUrl: '/mock-img.jpg',
    position: [0, 1.5, 49.9],
    size: [5, 3],
  },
  
  {
    id: '7',
    title: 'Center Short Back',
    artist: 'Artist G',
    description: 'Short back side of center wall.',
    imageUrl: '/mock-img.jpg',
    position: [0, 0.8, -20.01], // -length / 2 - 0.01
    size: [6, 3.5],
  },
  {
    id: '8',
    title: 'Center Short Front',
    artist: 'Artist H',
    description: 'Short front side of center wall.',
    imageUrl: '/mock-img.jpg',
    position: [0, 0.8, 20.01], // length / 2 + 0.01
    size: [6, 3.5],
  },
  {
    id: '9',
    title: 'Center Long Left 1',
    artist: 'Artist I',
    description: 'Left side of center wall.',
    imageUrl: '/mock-img.jpg',
    position: [-5.01, 1.5, -10], // -width / 2 - 0.01
    size: [3, 2],
  },
  {
    id: '10',
    title: 'Center Long Left 2',
    artist: 'Artist J',
    description: 'Left side of center wall.',
    imageUrl: '/mock-img.jpg',
    position: [-5.01, 1.5, 10],
    size: [3, 2],
  },
  {
    id: '11',
    title: 'Center Long Right 1',
    artist: 'Artist K',
    description: 'Right side of center wall.',
    imageUrl: '/mock-img.jpg',
    position: [5.01, 1.5, -10], // width / 2 + 0.01
    size: [3, 2],
  },
  {
    id: '12',
    title: 'Center Long Right 2',
    artist: 'Artist L',
    description: 'Right side of center wall.',
    imageUrl: '/mock-img.jpg',
    position: [5.01, 1.5, 10],
    size: [3, 2],
  },
]

// Component khung tranh hiển thị ảnh + viền khung
const ImageFrame: React.FC<{ imageData: ImageData }> = ({ imageData }) => {
  const texture = useLoader(TextureLoader, imageData.imageUrl)
  const [width, height] = imageData.size
  const frameThickness = 0.05
  const frameColor = '#D4AF37'

  const [x, y, z] = imageData.position

  const rotation = new THREE.Euler();

  if (Math.abs(z) < 20 && x < 0) {
    // Center wall, mặt trái → nhìn ra tường chính trái
    rotation.y = Math.PI / 2;
  } else if (Math.abs(z) < 20 && x > 0) {
    // Center wall, mặt phải → nhìn ra tường chính phải
    rotation.y = -Math.PI / 2;
  } else if (Math.abs(x) < 2 && z < 0) {
    // Center wall, mặt sau → nhìn ra tường chính sau
    rotation.y = Math.PI;
  } else if (Math.abs(x) < 2 && z > 0) {
    // Center wall, mặt trước → nhìn ra tường chính trước
    rotation.y = 0;
  } else if (z > 39) {
    // Tường chính trước → nhìn vào -Z
    rotation.y = Math.PI;
  } else if (z < -39) {
    // Tường chính sau → nhìn vào +Z
    rotation.y = 0;
  } else if (x > 39) {
    // Tường phải → nhìn vào -X
    rotation.y = -Math.PI / 2;
  } else if (x < -39) {
    // Tường trái → nhìn vào +X
    rotation.y = Math.PI / 2;
  }

  return (
    <group position={imageData.position} rotation={rotation}>
      {/* Khung viền */}
      <mesh position={[0, height / 2 + frameThickness / 2, -0.01]}>
        <boxGeometry args={[width + 2 * frameThickness, frameThickness, 0.02]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
      <mesh position={[0, -height / 2 - frameThickness / 2, -0.01]}>
        <boxGeometry args={[width + 2 * frameThickness, frameThickness, 0.02]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
      <mesh position={[-width / 2 - frameThickness / 2, 0, -0.01]}>
        <boxGeometry args={[frameThickness, height, 0.02]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>
      <mesh position={[width / 2 + frameThickness / 2, 0, -0.01]}>
        <boxGeometry args={[frameThickness, height, 0.02]} />
        <meshStandardMaterial color={frameColor} />
      </mesh>

      {/* Ảnh chính */}
      <mesh>
        <planeGeometry args={imageData.size} />
        <meshStandardMaterial map={texture} side={THREE.DoubleSide}/>
      </mesh>
    </group>
  )
}

// Mobile Controls Component
const MobileControls: React.FC<{ 
  onMove: (direction: string, pressed: boolean) => void;
  isMobile: boolean;
}> = ({ onMove, isMobile }) => {
  if (!isMobile) return null;

  const buttonStyle = "w-12 h-12 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center text-lg font-bold active:bg-opacity-70 select-none touch-manipulation";

  return (
    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
      {/* Movement Controls */}
      <div className="relative pointer-events-auto">
        <div className="grid grid-cols-3 gap-2 w-36">
          <div></div>
          <button
            className={buttonStyle}
            onTouchStart={() => onMove('w', true)}
            onTouchEnd={() => onMove('w', false)}
            onMouseDown={() => onMove('w', true)}
            onMouseUp={() => onMove('w', false)}
            onMouseLeave={() => onMove('w', false)}
          >
            ↑
          </button>
          <div></div>
          
          <button
            className={buttonStyle}
            onTouchStart={() => onMove('a', true)}
            onTouchEnd={() => onMove('a', false)}
            onMouseDown={() => onMove('a', true)}
            onMouseUp={() => onMove('a', false)}
            onMouseLeave={() => onMove('a', false)}
          >
            ←
          </button>
          <button
            className={buttonStyle}
            onTouchStart={() => onMove('s', true)}
            onTouchEnd={() => onMove('s', false)}
            onMouseDown={() => onMove('s', true)}
            onMouseUp={() => onMove('s', false)}
            onMouseLeave={() => onMove('s', false)}
          >
            ↓
          </button>
          <button
            className={buttonStyle}
            onTouchStart={() => onMove('d', true)}
            onTouchEnd={() => onMove('d', false)}
            onMouseDown={() => onMove('d', true)}
            onMouseUp={() => onMove('d', false)}
            onMouseLeave={() => onMove('d', false)}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

const FreeMovementControls: React.FC<{
  centerWallRef: React.RefObject<THREE.Mesh>
  mobileControls: React.MutableRefObject<{ [key: string]: boolean }>
}> = ({ centerWallRef, mobileControls }) => {
  const { camera, gl } = useThree()
  const keys = useRef<{ [key: string]: boolean }>({})
  const velocity = useRef(new THREE.Vector3())
  const direction = new THREE.Vector3()
  const pitch = useRef(0)
  const yaw = useRef(0)

  const isDragging = useRef(false)
  const lastMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  useEffect(() => {
    camera.rotation.order = 'YXZ'
  }, [camera])

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Mouse + Touch drag to rotate camera
  useEffect(() => {
    const canvas = gl.domElement

    const updateRotation = (deltaX: number, deltaY: number) => {
      yaw.current -= deltaX * 0.002
      pitch.current -= deltaY * 0.002
      pitch.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch.current))

      const quaternion = new THREE.Quaternion()
      quaternion.setFromEuler(new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ'))
      camera.quaternion.copy(quaternion)
    }

    // Mouse events
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true
      lastMouse.current = { x: e.clientX, y: e.clientY }
    }
    const onMouseUp = () => {
      isDragging.current = false
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      const deltaX = e.clientX - lastMouse.current.x
      const deltaY = e.clientY - lastMouse.current.y
      lastMouse.current = { x: e.clientX, y: e.clientY }
      updateRotation(deltaX, deltaY)
    }

    // Touch events
    const onTouchStart = (e: TouchEvent) => {
      isDragging.current = true
      const touch = e.touches[0]
      lastMouse.current = { x: touch.clientX, y: touch.clientY }
    }
    const onTouchEnd = () => {
      isDragging.current = false
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return
      const touch = e.touches[0]
      const deltaX = touch.clientX - lastMouse.current.x
      const deltaY = touch.clientY - lastMouse.current.y
      lastMouse.current = { x: touch.clientX, y: touch.clientY }
      updateRotation(deltaX, deltaY)
    }

    // Add listeners
    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mousemove', onMouseMove)

    canvas.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('touchmove', onTouchMove)

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)

      canvas.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [gl, camera])

  // WASD movement
  useFrame((_, delta) => {
    const speed = 5
    direction.set(0, 0, 0)

    const activeKeys = { ...keys.current, ...mobileControls.current }

    if (activeKeys['w']) direction.z -= 1
    if (activeKeys['s']) direction.z += 1
    if (activeKeys['a']) direction.x -= 1
    if (activeKeys['d']) direction.x += 1

    direction.normalize()
    direction.applyQuaternion(camera.quaternion)

    velocity.current.copy(direction).multiplyScalar(speed * delta)
    const nextPosition = camera.position.clone().add(velocity.current)

    // Collision detection
    const wall = centerWallRef.current
    if (wall) {
      wall.geometry.computeBoundingBox()
      wall.updateMatrixWorld(true)
      const box = wall.geometry.boundingBox!.clone().applyMatrix4(wall.matrixWorld)
      const paddedBox = box.clone().expandByScalar(0.3)
      if (paddedBox.containsPoint(nextPosition)) return
    }

    camera.position.copy(nextPosition)
    camera.position.y = THREE.MathUtils.clamp(camera.position.y, -4.5, 8)
  })

  return null
}




// Các mặt của căn phòng
const WallBackground = () => {
  const roomSize = 100
  const roomHeight = 10
  const floorTexture = useLoader(TextureLoader, '/floor-1.jpg')
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
  floorTexture.repeat.set(8, 8)

  const wallTexture = useLoader(TextureLoader, '/wall-4.jpg')
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping
  wallTexture.repeat.set(roomSize / 10, roomHeight / 2.5)

  return (
    <>
      {/* Tường sau */}
      <mesh position={[0, 0, -roomSize / 2]}>
        <planeGeometry args={[roomSize, roomHeight]} />
        <meshStandardMaterial map={wallTexture} side={THREE.DoubleSide} />
      </mesh>

      {/* Tường trước */}
      <mesh position={[0, 0, roomSize / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[roomSize, roomHeight]} />
        <meshStandardMaterial map={wallTexture} side={THREE.DoubleSide} />
      </mesh>

      {/* Tường trái */}
      <mesh position={[-roomSize / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[roomSize, roomHeight]} />
        <meshStandardMaterial map={wallTexture} side={THREE.DoubleSide} />
      </mesh>

      {/* Tường phải */}
      <mesh position={[roomSize / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[roomSize, roomHeight]} />
        <meshStandardMaterial map={wallTexture} side={THREE.DoubleSide} />
      </mesh>

      {/* Trần */}
      <mesh position={[0, roomHeight / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomSize, roomSize]} />
        <meshStandardMaterial map={wallTexture} side={THREE.DoubleSide} />
      </mesh>

      {/* Sàn */}
      <mesh position={[0, -roomHeight / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomSize, roomSize]} />
        <meshStandardMaterial map={floorTexture} side={THREE.DoubleSide} />
      </mesh>

      {/* Lưới đèn trần 3x3 */}
      {[-33, 0, 33].map((x) =>
        [-33, 0, 33].map((z) => (
          <group key={`${x}-${z}`} position={[x, roomHeight / 2 - 0.2, z]}>
            <mesh>
              <sphereGeometry args={[0.3, 16, 16]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#fff5e1"
                emissiveIntensity={2.2}
              />
            </mesh>
            <pointLight
              intensity={1.2}
              distance={60}
              color="#fff5e1"
              castShadow
            />
          </group>
        ))
      )}
    </>
  )
}

const CenterWall = React.forwardRef<THREE.Mesh>((_, ref) => {
  const wallTexture = useLoader(TextureLoader, '/wall-2.jpg')

  const width = 10
  const height = 8
  const length = 40

  return (
    <mesh ref={ref} position={[0, height / 2 - 5, 0]}>
      <boxGeometry args={[width, height, length]} />
      <meshStandardMaterial map={wallTexture} />
    </mesh>
  )
})

// Component chính
const Gallery3D: React.FC = () => {
  const centerWallRef = useRef<THREE.Mesh>(null!)
  const mobileControlsRef = useRef<{ [key: string]: boolean }>({})
  const [isMobile, setIsMobile] = useState(false)
  const [showGallery, setShowGallery] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleMobileMove = (direction: string, pressed: boolean) => {
    mobileControlsRef.current[direction] = pressed
  }

  const scrollToGallery = () => {
    setShowGallery(true)
  }

  if (!showGallery) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative flex items-center justify-center">
        {/* Subtle animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-amber-400 rounded-full opacity-60 animate-pulse"></div>
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-orange-400 rounded-full opacity-40 animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-50 animate-pulse"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          <div className="space-y-8">
            {/* Simple title */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight">
                Lantern
                <span className="block text-amber-400">World</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-300 font-light">
                Bảo tàng nghệ thuật 3D
              </p>
            </div>

            {/* Simple description */}
            <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
              Khám phá thế giới đèn lồng huyền diệu trong không gian 3D tương tác
            </p>

            {/* Call to action */}
            <button
              onClick={scrollToGallery}
              className="group bg-amber-500 hover:bg-amber-400 text-black font-semibold py-4 px-12 rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/25"
            >
              Khám phá ngay
            </button>
            
            <p className="text-slate-500 text-sm mt-4">
              {isMobile ? "Chạm để điều khiển" : "WASD để di chuyển"}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen relative">
      <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [2, 1.5, 25] }}>
        <ambientLight intensity={1.2} color="#FFE8C2" />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <CenterWall ref={centerWallRef}/>
        {/* <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          rotateSpeed={0.5}
        /> */}
        <FreeMovementControls 
          centerWallRef={centerWallRef}
          mobileControls={mobileControlsRef}
        />
        <WallBackground />

        {/* Cây cảnh */}
        <PlantModel position={[-46, -5, -46]} />
        <PlantModel position={[46, -5, -46]} />
        <PlantModel position={[-46, -5, 46]} />
        <PlantModel position={[46, -5, 46]} />
        <BarrierModel position={[0, -5, 16]} />
        <BarrierModel position={[0, -5, -27]} />

        {/* Tranh */}
        {SAMPLE_IMAGES.map((imageData) => (
          <ImageFrame key={imageData.id} imageData={imageData} />
        ))}
      </Canvas>
      
      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
        <p className="text-sm">
          {isMobile 
            ? "Khám phá bảo tàng đèn lồng — sử dụng các nút điều khiển bên dưới để di chuyển"
            : "Khám phá bảo tàng đèn lồng — nhấp chuột, nhìn xung quanh và di chuyển bằng W A S D"
          }
        </p>
      </div>

      {/* Back to intro button */}
      <button
        onClick={() => setShowGallery(false)}
        className="absolute top-4 right-4 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
      >
        ← Quay lại giới thiệu
      </button>

      <MobileControls 
        onMove={handleMobileMove}
        isMobile={isMobile}
      />
    </div>
  )
}

export default Gallery3D