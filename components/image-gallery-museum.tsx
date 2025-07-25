'use client'

import React, { useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useThree, useLoader, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { TextureLoader } from 'three'
import PlantModel from './ui/plant-model'
import BarrierModel from './ui/barrier-model'
import { Html, OrbitControls } from '@react-three/drei'
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

// Mảng chỉ chứa các tranh để trưng bày
const SAMPLE_IMAGES: ImageData[] = [
  {
    id: '1',
    title: 'Wall Center',
    artist: 'Artist A',
    description: 'Center of back wall.',
    imageUrl: '/mock-img.jpg',
    position: [0, 1.5, -49.9],
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
    position: [0, 0.8, -20.01],
    size: [6, 3.5],
  },
  {
    id: '8',
    title: 'Center Short Front',
    artist: 'Artist H',
    description: 'Short front side of center wall.',
    imageUrl: '/mock-img.jpg',
    position: [0, 0.8, 20.01],
    size: [6, 3.5],
  },
  {
    id: '9',
    title: 'Center Long Left 1',
    artist: 'Artist I',
    description: 'Left side of center wall.',
    imageUrl: '/mock-img.jpg',
    position: [-5.01, 1.5, -10],
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
    position: [5.01, 1.5, -10],
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

const ImageFrame: React.FC<{ imageData: ImageData }> = ({ imageData }) => {
  const { camera } = useThree()
  const texture = useLoader(TextureLoader, imageData.imageUrl)
  const [width, height] = imageData.size
  const frameThickness = 0.05
  const frameColor = '#D4AF37'
  const [showInfo, setShowInfo] = useState(false)

  const [x, y, z] = imageData.position
  const position = new THREE.Vector3(x, y, z)

  const rotation = new THREE.Euler()

  if (Math.abs(z) < 20 && x < 0) rotation.y = Math.PI / 2
  else if (Math.abs(z) < 20 && x > 0) rotation.y = -Math.PI / 2
  else if (Math.abs(x) < 2 && z < 0) rotation.y = Math.PI
  else if (Math.abs(x) < 2 && z > 0) rotation.y = 0
  else if (z > 39) rotation.y = Math.PI
  else if (z < -39) rotation.y = 0
  else if (x > 39) rotation.y = -Math.PI / 2
  else if (x < -39) rotation.y = Math.PI / 2

  useFrame(() => {
    const distance = camera.position.distanceTo(position)
    setShowInfo(distance < 6)
  })

  return (
    <group position={imageData.position} rotation={rotation}>
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
      <mesh>
        <planeGeometry args={imageData.size} />
        <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
      {showInfo && (
        <Html distanceFactor={10} position={[0, height / 2 + 0.5, 0]} transform sprite>
          <div className="bg-white/90 backdrop-blur text-black p-2 rounded-md shadow-lg max-w-2xl text-sm">
            <p className="font-semibold">{imageData.title}</p>
            <p className="italic text-gray-600">{imageData.artist}</p>
            <p>{imageData.description}</p>
          </div>
        </Html>
      )}
    </group>
  )
}

const MobileControls: React.FC<{
  onMove: (direction: string, pressed: boolean) => void
  isMobile: boolean
}> = ({ onMove, isMobile }) => {
  if (!isMobile) return null

  const buttonStyle = "w-12 h-12 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center text-lg font-bold active:bg-opacity-70 select-none touch-manipulation"

  return (
    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
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
  )
}

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

  useFrame((_, delta) => {
    const speed = 5
    direction.set(0, 0, 0)

    const activeKeys = { ...keys.current, ...mobileControls.current }

    if (activeKeys['w']) direction.z -= 3
    if (activeKeys['s']) direction.z += 3
    if (activeKeys['a']) direction.x -= 3
    if (activeKeys['d']) direction.x += 3

    direction.normalize()

    if (direction.lengthSq() === 0) {
      velocity.current.set(0, 0, 0)
      return
    }

    direction.applyQuaternion(camera.quaternion)
    velocity.current.copy(direction).multiplyScalar(speed * delta)

    const nextPosition = camera.position.clone().add(velocity.current)

    const wall = centerWallRef.current
    if (wall) {
      wall.geometry.computeBoundingBox()
      wall.updateMatrixWorld(true)
      const box = wall.geometry.boundingBox!.clone().applyMatrix4(wall.matrixWorld)
      const paddedBox = box.clone().expandByScalar(0.3)
      if (paddedBox.containsPoint(nextPosition)) {
        velocity.current.set(0, 0, 0)
        return
      }
    }

    camera.position.copy(nextPosition)
    camera.position.y = THREE.MathUtils.clamp(camera.position.y, -4.5, 8)
  })

  return null
}

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
      <mesh position={[0, 0, -roomSize / 2]}>
        <planeGeometry args={[roomSize, roomHeight]} />
        <meshStandardMaterial map={wallTexture} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, roomSize / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[roomSize, roomHeight]} />
        <meshStandardMaterial map={wallTexture} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-roomSize / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[roomSize, roomHeight]} />
        <meshStandardMaterial map={wallTexture} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[roomSize / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[roomSize, roomHeight]} />
        <meshStandardMaterial map={wallTexture} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, roomHeight / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomSize, roomSize]} />
        <meshStandardMaterial map={wallTexture} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -roomHeight / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[roomSize, roomSize]} />
        <meshStandardMaterial map={floorTexture} side={THREE.DoubleSide} />
      </mesh>
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

const Gallery3D: React.FC = () => {
  const centerWallRef = useRef<THREE.Mesh>(null!)
  const mobileControlsRef = useRef<{ [key: string]: boolean }>({})
  const galleryRef = useRef<HTMLDivElement>(null!)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [volume, setVolume] = useState(0.5) // Mức âm lượng mặc định (0.0 - 1.0)

  // Khởi tạo audio
  useEffect(() => {
    audioRef.current = new Audio('/Lanterns-at-Dusk.mp3')
    audioRef.current.loop = true
    audioRef.current.volume = volume

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Cập nhật âm lượng khi volume thay đổi
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

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

  const handleDiscoverClick = async () => {
    setShowGallery(true)

    if (audioRef.current) {
      try {
        await audioRef.current.play()
      } catch (err) {
        console.warn("Failed to play audio:", err)
      }
    }

    setTimeout(async () => {
      if (galleryRef.current) {
        try {
          if (galleryRef.current.requestFullscreen) {
            await galleryRef.current.requestFullscreen()
          } else if ((galleryRef.current as any).webkitRequestFullscreen) {
            await (galleryRef.current as any).webkitRequestFullscreen()
          }
        } catch (err) {
          console.warn("Failed to enter fullscreen:", err)
        }
      }
    }, 100)
  }

  const handleBackClick = async () => {
    setShowGallery(false)

    if (audioRef.current) {
      audioRef.current.pause()
    }

    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen()
      } catch (err) {
        console.warn("Failed to exit fullscreen:", err)
      }
    }
  }

  // Xử lý thay đổi âm lượng
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
  }

  return (
    <div
      id="gallery-wrapper"
      ref={galleryRef}
      className="w-full h-screen relative"
    >
      {showGallery ? (
        <>
          <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [2, 1.5, 25] }}>
            <ambientLight intensity={1.2} color="#FFE8C2" />
            <pointLight position={[10, 10, 10]} intensity={0.5} />
            <CenterWall ref={centerWallRef} />
            <FreeMovementControls
              centerWallRef={centerWallRef}
              mobileControls={mobileControlsRef}
            />
            <WallBackground />
            <PlantModel position={[-46, -5, -46]} />
            <PlantModel position={[46, -5, -46]} />
            <PlantModel position={[-46, -5, 46]} />
            <PlantModel position={[46, -5, 46]} />
            <BarrierModel position={[0, -5, 16]} />
            <BarrierModel position={[0, -5, -27]} />
            {SAMPLE_IMAGES.map((imageData) => (
              <ImageFrame key={imageData.id} imageData={imageData} />
            ))}
          </Canvas>

          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
            <p className="text-sm">
              {isMobile
                ? "Explore the lantern museum — use the controls below to move around"
                : "Explore the lantern museum — click to look around and move using W A S D"}
            </p>
          </div>

          <button
            onClick={handleBackClick}
            className="absolute top-4 right-4 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            ← Back to Intro
          </button>

          {/* Thanh trượt điều chỉnh âm lượng */}
          <div className="absolute top-16 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg flex items-center space-x-2">
            <label htmlFor="volume" className="text-sm">Volume:</label>
            <input
              id="volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 accent-amber-500"
            />
          </div>

          <MobileControls onMove={handleMobileMove} isMobile={isMobile} />
        </>
      ) : (
        <div className="min-h-screen bg-black relative flex items-center justify-center overflow-hidden px-8">
  {/* Red particles floating in the background */}
  <div className="absolute inset-0 pointer-events-none">
    {Array.from({ length: 25 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-1.5 h-1.5 bg-red-500 rounded-full opacity-40 animate-float-fade"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    ))}
  </div>

  {/* Horizontal layout */}
  <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-7xl gap-16">
    {/* Left side: Text content */}
    <div className="flex-1 space-y-6 text-left">
      {/* Section intro */}
      <p className="uppercase text-sm text-white/50 tracking-widest">Section 1</p>
      <h2 className="text-2xl md:text-3xl font-medium text-white/80 italic">
        The beginning of the <span className="text-red-500 font-semibold">light culture</span>, where tradition meets imagination.
      </h2>

      {/* Title */}
      <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-tight">
        <span className="text-red-500">Lantern</span>{" "}
        <span className="block text-white">World</span>
      </h1>

      {/* Subtitle */}
      <p className="text-xl md:text-2xl text-white/70 font-light">
        A 3D Art Museum experience
      </p>

      {/* Description */}
      <p className="text-white/70 text-lg max-w-lg leading-relaxed">
        Step into a magical universe of lanterns — a modern reinterpretation of Vietnamese light culture in an immersive, interactive space.
      </p>

      {/* Button */}
      <button
        onClick={handleDiscoverClick}
        className="mt-4 group bg-red-500 hover:bg-red-400 text-black font-semibold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25"
      >
        Discover
      </button>

      {/* Controls hint */}
      <p className="text-white/40 text-sm mt-3">
        {isMobile ? "Tap to move" : "Use W A S D to move"}
      </p>
    </div>

    {/* Right side: Placeholder for illustration or 3D preview */}
    <div className="flex-1 hidden md:flex items-center justify-center">
      <div className="w-full h-[400px] rounded-xl border border-red-500/20 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/30">
        <img
          src="/lantern-1.png"
          alt="Lantern preview"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  </div>

  {/* Floating effect animation */}
  <style jsx>{`
    @keyframes floatFade {
      0% {
        transform: translateY(0px) scale(1);
        opacity: 0.4;
      }
      50% {
        transform: translateY(-20px) scale(1.2);
        opacity: 0.8;
      }
      100% {
        transform: translateY(-40px) scale(0.8);
        opacity: 0;
      }
    }
    .animate-float-fade {
      animation: floatFade 5s ease-in-out infinite;
    }
  `}</style>
</div>


      )}
    </div>
  )
}

export default Gallery3D