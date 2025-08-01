'use client'

import React, { useRef, useEffect, useMemo, useState, createContext, useContext } from 'react'
import { Canvas, useThree, useLoader, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { TextureLoader } from 'three'
import PlantModel from './ui/plant-model'
import BarrierModel from './ui/barrier-model'
import { Html, OrbitControls } from '@react-three/drei'
import StarLoader from '@/components/starloader'

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

// Mảng chỉ chứa 6 tranh trên 4 mặt tường
const SAMPLE_IMAGES: ImageData[] = [
  {
    id: '1',
    title: 'The Heart of the Harvest',
    artist: 'Artist A',
    description: 'Shaped like fruit or a blooming heart, this lantern reflects the warmth of family and the sweetness of reunion. In the glow of Mid-Autumn nights, children carry these vibrant forms through villages, reminding everyone of the ripeness of the harvest and the love that binds generations. It’s not just a light—it’s a symbol of home, togetherness, and gratitude.',
    imageUrl: '/room-1/r1-1.jpg',
    position: [0, 0, -29.9],
    size: [24, 16],
  },
  {
    id: '2',
    title: 'The Dragon of Lunar Legends',
    artist: 'Artist B',
    description: 'This dragon-shaped lantern embodies strength, wisdom, and nobility in Vietnamese culture. Crafted with vibrant colors and flowing patterns, it recalls the mythical dragon’s dance through clouds and moonlight. Carried during the Mid-Autumn Festival, it invokes tales of ancient kings and celestial creatures, lighting the way for children to dream boldly and walk with courage.',
    imageUrl: '/room-1/r1-5.jpg',
    position: [-29.9, 0, -10],
    size: [16, 12],
  },
  {
    id: '3',
    title: 'The Butterfly of Joyful Transformation',
    artist: 'Artist C',
    description: 'With its radiant wings and playful form, this butterfly-shaped lantern captures the spirit of innocence and change. In Vietnamese culture, the butterfly symbolizes beauty, freedom, and a child’s journey of discovery. During the Mid-Autumn Festival, its fluttering glow reminds children that like butterflies, they too are meant to grow, transform, and soar beyond boundaries.',
    imageUrl: '/room-1/r1-6.jpg',
    position: [-29.9, 0, 10],
    size: [16, 12],
  },
  {
    id: '4',
    title: 'The Carp of Aspiration',
    artist: 'Artist D',
    description: 'Shaped like a vibrant red carp, this lantern draws from the legend of the carp leaping over the Dragon Gate – a symbol of perseverance, learning, and transformation. During the Mid-Autumn Festival, children proudly carry carp lanterns, embodying the hope that with effort and determination, they too can overcome life’s challenges and reach greatness.',
    imageUrl: '/room-1/r1-4.jpg',
    position: [29.9, 0, -10],
    size: [16, 12],
  },
  {
    id: '5',
    title: 'The Moon Rabbit’s Blessing',
    artist: 'Artist E',
    description: 'Inspired by Vietnamese folklore, this lantern features the Moon Rabbit – a symbol of kindness and good fortune – surrounded by glowing star lanterns. During the Mid-Autumn Festival, children carry these lights to honor the Moon and celebrate family togetherness. The rabbit reminds us of the legends told under the harvest moon, where wishes whispered in candlelight may just reach the heavens.',
    imageUrl: '/room-1/r1-12.jpg',
    position: [29.9, 0, 10],
    size: [16, 12],
  },
  {
    id: '6',
  title: 'The Star of Reunion',
  artist: 'Artist F',
  description: 'This star-shaped lantern symbolizes hope and unity during the Mid-Autumn Festival. Traditionally handcrafted with bamboo and colored paper, it lights up the night as children parade through villages, representing family reunion and the joy of childhood. The five points of the star echo the five blessings: longevity, wealth, health, virtue, and peace.',
  imageUrl: '/room-1/r1-8.jpg',
  position: [0, 0, 29.9],
  size: [24, 16],

  },
]

// Camera sync context - Updated to handle shared state better
const CameraSyncContext = createContext<{
  sharedPosition: THREE.Vector3
  sharedRotation: THREE.Euler
  updateSharedCamera: (position: THREE.Vector3, rotation: THREE.Euler) => void
} | null>(null)

// Component to sync camera in VR mode - Fixed to allow both eyes to control
const CameraSync = ({ eyeId }: { eyeId: 'left' | 'right' }) => {
  const { camera, gl } = useThree()
  const context = useContext(CameraSyncContext)
  const lastUpdateTime = useRef<number>(0)
  
  useFrame(() => {
    if (!context) return
    
    const now: number = Date.now()
    
    // Both eyes can update the shared state, but with a small delay to prevent conflicts
    if (now - lastUpdateTime.current > 16) { // ~60fps throttling
      context.updateSharedCamera(camera.position.clone(), camera.rotation.clone())
      lastUpdateTime.current = now
    }
    
    // Apply shared state to current camera
    camera.position.copy(context.sharedPosition)
    camera.rotation.copy(context.sharedRotation)
  })
  
  return null
}

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

  // Tính toán rotation dựa trên vị trí trên tường
  if (z < -25) rotation.y = 0        // Tường phía sau (North)
  else if (z > 25) rotation.y = Math.PI  // Tường phía trước (South)
  else if (x < -25) rotation.y = Math.PI / 2  // Tường trái (West)
  else if (x > 25) rotation.y = -Math.PI / 2   // Tường phải (East)

  useFrame(() => {
    const distance = camera.position.distanceTo(position)
    setShowInfo(distance < 24)
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
        <Html distanceFactor={8} position={[0, -height / 2 - 2, 0]} transform>
  <div className="bg-black/95 text-white px-10 py-8 rounded-2xl border border-yellow-400/50 shadow-2xl w-full max-w-5xl space-y-6 leading-relaxed text-xl text-left">
    <p className="text-4xl font-extrabold text-red-400 tracking-tight leading-snug">
      {imageData.title}
    </p>
    
    <p className="text-4xl text-red-300 whitespace-pre-line leading-loose">
      {imageData.description}
    </p>
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

// Updated FreeMovementControls to work with VR context
const FreeMovementControls: React.FC<{
  mobileControls: React.MutableRefObject<{ [key: string]: boolean }>
  isVRMode?: boolean
}> = ({ mobileControls, isVRMode = false }) => {
  const { camera, gl } = useThree()
  const context = useContext(CameraSyncContext)
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
      
      // Update shared state in VR mode
      if (isVRMode && context) {
        context.updateSharedCamera(camera.position.clone(), camera.rotation.clone())
      }
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
  }, [gl, camera, isVRMode, context])

  useFrame((_, delta) => {
    const speed = 8
    direction.set(0, 0, 0)

    const activeKeys = { ...keys.current, ...mobileControls.current }

    if (activeKeys['w']) direction.z -= 1
    if (activeKeys['s']) direction.z += 1
    if (activeKeys['a']) direction.x -= 1
    if (activeKeys['d']) direction.x += 1

    direction.normalize()

    if (direction.lengthSq() === 0) {
      velocity.current.set(0, 0, 0)
      return
    }

    direction.applyQuaternion(camera.quaternion)
    velocity.current.copy(direction).multiplyScalar(speed * delta)

    const nextPosition = camera.position.clone().add(velocity.current)

    // Giới hạn di chuyển trong phòng 60x60x30
    const roomLimit = 28
    const heightMin = -12
    const heightMax = 12

    nextPosition.x = THREE.MathUtils.clamp(nextPosition.x, -roomLimit, roomLimit)
    nextPosition.z = THREE.MathUtils.clamp(nextPosition.z, -roomLimit, roomLimit)
    nextPosition.y = THREE.MathUtils.clamp(nextPosition.y, heightMin, heightMax)

    camera.position.copy(nextPosition)
    
    // Update shared state in VR mode
    if (isVRMode && context) {
      context.updateSharedCamera(camera.position.clone(), camera.rotation.clone())
    }
  })

  return null
}

const WallBackground = () => {
  const roomSize = 60
  const roomHeight = 30
  const floorTexture = useLoader(TextureLoader, '/dark-floor.jpg')
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
  floorTexture.repeat.set(6, 6)

  const wallTexture = useLoader(TextureLoader, '/dark-wall.jpg')
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping
  wallTexture.repeat.set(roomSize / 10, roomHeight / 5)

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
      {[-20, 0, 20].map((x) =>
        [-20, 0, 20].map((z) => (
          <group key={`${x}-${z}`} position={[x, roomHeight / 2 - 0.5, z]}>
            <mesh>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive="#fff5e1"
                emissiveIntensity={2.5}
              />
            </mesh>
            <pointLight
              intensity={1.5}
              distance={80}
              color="#fff5e1"
              castShadow
            />
          </group>
        ))
      )}
    </>
  )
}

const Gallery3D: React.FC = () => {
  const mobileControlsRef = useRef<{ [key: string]: boolean }>({})
  const galleryRef = useRef<HTMLDivElement>(null!)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showGallery, setShowGallery] = useState(false)
  const [isVRMode, setIsVRMode] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const [isLoadingScene, setIsLoadingScene] = useState(false)
  
  // VR camera sync state - Updated to use shared state
  const [sharedPosition, setSharedPosition] = useState(new THREE.Vector3(0, 0, 25))
  const [sharedRotation, setSharedRotation] = useState(new THREE.Euler(0, 0, 0))
  
  const updateSharedCamera = (position: THREE.Vector3, rotation: THREE.Euler) => {
    setSharedPosition(position.clone())
    setSharedRotation(rotation.clone())
  }

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

  const handleDiscoverClick = async (vrMode = false) => {
    setIsLoadingScene(true)
    setShowGallery(true)
    setIsVRMode(vrMode)

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
    setIsVRMode(false)

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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
  }

  const renderScene = (eyeId?: 'left' | 'right') => (
    <>
      <ambientLight intensity={1.2} color="#FFE8C2" />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <FreeMovementControls mobileControls={mobileControlsRef} isVRMode={isVRMode} />
      {isVRMode && eyeId && <CameraSync eyeId={eyeId} />}
      <WallBackground />
      <PlantModel position={[-26, -15, -26]} />
      <PlantModel position={[26, -15, -26]} />
      <PlantModel position={[-26, -15, 26]} />
      <PlantModel position={[26, -15, 26]} />
      <BarrierModel position={[0, -15, -27.5]} />
      <BarrierModel position={[-27.5, -15, -10]} rotation={[0, Math.PI / 2, 0]} />
      <BarrierModel position={[-27.5, -15, 10]} rotation={[0, Math.PI / 2, 0]}/>
      <BarrierModel position={[27.5, -15, -10]} rotation={[0, -Math.PI / 2, 0]}/>
      <BarrierModel position={[27.5, -15, 10]} rotation={[0, -Math.PI / 2, 0]}/>
      <BarrierModel position={[0, -15, 20.5]} />

      {SAMPLE_IMAGES.map((imageData) => (
        <ImageFrame key={imageData.id} imageData={imageData} />
      ))}
    </>
  )

  return (
    <div
      id="gallery-wrapper"
      ref={galleryRef}
      className="w-full h-screen relative"
    >
      {showGallery ? (
        <>
          {isLoadingScene && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
              <StarLoader />
            </div>
          )}

          {isVRMode ? (
            // VR Mode with dual screens and improved camera sync
            <CameraSyncContext.Provider value={{ sharedPosition, sharedRotation, updateSharedCamera }}>
              <div className="flex w-full h-full">
                {/* Left Eye */}
                <div className="w-1/2 h-full border-r border-gray-600">
                  <Canvas 
                    onCreated={() => setIsLoadingScene(false)} 
                    camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 25] }}
                  >
                    {renderScene('left')}
                  </Canvas>
                </div>
                
                {/* Right Eye */}
                <div className="w-1/2 h-full">
                  <Canvas 
                    camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 25] }}
                  >
                    {renderScene('right')}
                  </Canvas>
                </div>
              </div>
            </CameraSyncContext.Provider>
          ) : (
            // Normal Mode with single screen
            <Canvas 
              onCreated={() => setIsLoadingScene(false)} 
              camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 25] }}
            >
              {renderScene()}
            </Canvas>
          )}

          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
            <p className="text-sm">
              {isVRMode 
                ? "VR Mode: Both screens respond to drag - Put on your VR headset for immersive experience"
                : isMobile
                ? "Explore the lantern museum — use the controls below to move around"
                : "Explore the lantern museum — click to look around and move using W A S D"
              }
            </p>
          </div>

          <button
            onClick={handleBackClick}
            className="absolute top-4 right-4 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            ← Back to Intro
          </button>

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

          {isVRMode && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-600 bg-opacity-90 text-white px-4 py-2 rounded-lg">
              VR Mode Active - Both Eyes Synchronized
            </div>
          )}

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

              {/* Button container */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  onClick={() => handleDiscoverClick(false)}
                  className="group bg-red-500 hover:bg-red-400 text-black font-semibold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25"
                >
                  Discover
                </button>

                <button
                  onClick={() => handleDiscoverClick(true)}
                  className="group bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-600/25 border-2 border-blue-400"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                    Turn into VR
                  </span>
                </button>
              </div>

              {/* Controls hint */}
              <p className="text-white/40 text-sm mt-3">
                {isMobile ? "Tap to explore in normal or VR mode" : "Use W A S D to walk through the museum - Try VR for immersive experience"}
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