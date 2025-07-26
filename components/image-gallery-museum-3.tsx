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
  rotation?: [number, number, number]
}

// Interface cho art block
interface ArtBlock {
  id: string
  position: [number, number, number]
  rotation: [number, number, number]
  size: [number, number, number] // width, height, depth
  type: 'wall' | 'glass'
}

// Tạo 4 khối lớn ở 4 phía phòng + 1 tủ kính ở giữa
const generateArtBlocks = (): ArtBlock[] => {
  const blocks: ArtBlock[] = []
  
  // 4 khối lớn mỏng ở 4 phía
  const wallBlocks = [
    // Khối phía sau (North)
    {
      id: 'wall-north',
      position: [0, -2, -30] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      size: [25, 6, 2] as [number, number, number],
      type: 'wall' as const
    },
    // Khối phía trước (South)  
    {
      id: 'wall-south',
      position: [0, -2, 30] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      size: [25, 6, 2] as [number, number, number],
      type: 'wall' as const
    },
    // Khối phía trái (West)
    {
      id: 'wall-west',
      position: [-30, -2, 0] as [number, number, number],
      rotation: [0, Math.PI/2, 0] as [number, number, number],
      size: [25, 6, 2] as [number, number, number],
      type: 'wall' as const
    },
    // Khối phía phải (East)
    {
      id: 'wall-east',
      position: [30, -2, 0] as [number, number, number],
      rotation: [0, Math.PI/2, 0] as [number, number, number],
      size: [25, 6, 2] as [number, number, number],
      type: 'wall' as const
    }
  ]
  
  // 1 tủ kính ở giữa
  const glassCase = {
    id: 'glass-center',
    position: [0, -2, 0] as [number, number, number],
    rotation: [0, 0, 0] as [number, number, number],
    size: [4, 8, 4] as [number, number, number],
    type: 'glass' as const
  }
  
  return [...wallBlocks, glassCase]
}

// Generate art blocks
const ART_BLOCKS = generateArtBlocks()

// Tạo tranh cho tất cả các mặt của blocks
const generateImageData = (): ImageData[] => {
  const images: ImageData[] = []
  let imageId = 1
  
  ART_BLOCKS.forEach((block) => {
    const [x, y, z] = block.position
    const [rotX, rotY, rotZ] = block.rotation
    const [width, height, depth] = block.size
    
    if (block.type === 'wall') {
      // Các khối tường: tranh trên 2 mặt chính (trước và sau theo hướng block)
      const faces = [
        // Front face
        {
          position: [x, y, z + depth/2 + 0.01] as [number, number, number],
          size: [width * 0.8, height * 0.7] as [number, number],
          rotation: [0, rotY, 0] as [number, number, number]
        },
        // Back face
        {
          position: [x, y, z - depth/2 - 0.01] as [number, number, number],
          size: [width * 0.8, height * 0.7] as [number, number],
          rotation: [0, rotY + Math.PI, 0] as [number, number, number]
        }
      ]
      
      faces.forEach((face, faceIndex) => {
        images.push({
          id: `${imageId}`,
          title: `Gallery ${imageId}`,
          artist: `Artist ${String.fromCharCode(65 + (imageId % 26))}`,
          description: `Beautiful lantern artwork on ${block.id}, side ${faceIndex + 1}.`,
          imageUrl: '/mock-img.jpg',
          position: face.position,
          size: face.size,
          rotation: face.rotation
        })
        imageId++
      })
    } else if (block.type === 'glass') {
      // Tủ kính: tranh trên 4 mặt
      const faces = [
        // Front face (Z+)
        {
          position: [x, y, z + depth/2 + 0.01] as [number, number, number],
          size: [width * 0.8, height * 0.6] as [number, number],
          rotation: [0, 0, 0] as [number, number, number]
        },
        // Back face (Z-)
        {
          position: [x, y, z - depth/2 - 0.01] as [number, number, number],
          size: [width * 0.8, height * 0.6] as [number, number],
          rotation: [0, Math.PI, 0] as [number, number, number]
        },
        // Left face (X-)
        {
          position: [x - width/2 - 0.01, y, z] as [number, number, number],
          size: [depth * 0.8, height * 0.6] as [number, number],
          rotation: [0, Math.PI/2, 0] as [number, number, number]
        },
        // Right face (X+)
        {
          position: [x + width/2 + 0.01, y, z] as [number, number, number],
          size: [depth * 0.8, height * 0.6] as [number, number],
          rotation: [0, -Math.PI/2, 0] as [number, number, number]
        }
      ]
      
      faces.forEach((face, faceIndex) => {
        images.push({
          id: `${imageId}`,
          title: `Centerpiece ${imageId}`,
          artist: `Master ${String.fromCharCode(65 + (imageId % 26))}`,
          description: `Premium lantern collection in glass case, panel ${faceIndex + 1}.`,
          imageUrl: '/mock-img.jpg',
          position: face.position,
          size: face.size,
          rotation: face.rotation
        })
        imageId++
      })
    }
  })
  
  return images
}

const SAMPLE_IMAGES = generateImageData()

const ImageFrame: React.FC<{ imageData: ImageData }> = ({ imageData }) => {
  const { camera } = useThree()
  const texture = useLoader(TextureLoader, imageData.imageUrl)
  const [width, height] = imageData.size
  const frameThickness = 0.04
  const frameColor = '#D4AF37'
  const [showInfo, setShowInfo] = useState(false)

  const [x, y, z] = imageData.position
  const position = new THREE.Vector3(x, y, z)

  // Use provided rotation
  const rotation = imageData.rotation 
    ? new THREE.Euler(...imageData.rotation)
    : new THREE.Euler()

  // Kiểm tra khoảng cách camera
  useFrame(() => {
    const distance = camera.position.distanceTo(position)
    setShowInfo(distance < 5)
  })

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

      {/* Hiện thông tin nếu đủ gần */}
      {showInfo && (
        <Html distanceFactor={10} position={[0, height / 2 + 0.4, 0]} transform sprite>
          <div className="bg-white/90 backdrop-blur text-black p-2 rounded-md shadow-lg max-w-sm text-sm">
            <p className="font-semibold">{imageData.title}</p>
            <p className="italic text-gray-600">{imageData.artist}</p>
            <p>{imageData.description}</p>
          </div>
        </Html>
      )}
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
  artBlocksRef: React.RefObject<THREE.Group[]>
  mobileControls: React.MutableRefObject<{ [key: string]: boolean }>
}> = ({ artBlocksRef, mobileControls }) => {
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

  useFrame((_, delta) => {
    const speed = 5
    direction.set(0, 0, 0)

    const activeKeys = { ...keys.current, ...mobileControls.current }

    if (activeKeys['w']) direction.z -= 3
    if (activeKeys['s']) direction.z += 3
    if (activeKeys['a']) direction.x -= 3
    if (activeKeys['d']) direction.x += 3

    direction.normalize()

    // 🧼 Nếu không có phím di chuyển, dừng luôn
    if (direction.lengthSq() === 0) {
      velocity.current.set(0, 0, 0)
      return
    }

    direction.applyQuaternion(camera.quaternion)
    velocity.current.copy(direction).multiplyScalar(speed * delta)

    const nextPosition = camera.position.clone().add(velocity.current)

    // 🚧 Collision with art blocks
    const blocks = artBlocksRef.current
    if (blocks) {
      let collision = false
      for (const block of blocks) {
        if (block && block.children[0]) { // Check if block mesh exists
          const blockMesh = block.children[0] as THREE.Mesh
          blockMesh.geometry.computeBoundingBox()
          blockMesh.updateMatrixWorld(true)
          const blockBounds = blockMesh.geometry.boundingBox!.clone().applyMatrix4(blockMesh.matrixWorld)
          const paddedBox = blockBounds.clone().expandByScalar(1.0) // Larger padding for bigger blocks
          if (paddedBox.containsPoint(nextPosition)) {
            collision = true
            break
          }
        }
      }
      
      if (collision) {
        velocity.current.set(0, 0, 0)
        return
      }
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

// Component for art blocks (4 wall blocks + 1 glass case)
const ArtBlocks: React.FC<{ blocksRef: React.RefObject<THREE.Group[]> }> = ({ blocksRef }) => {
  const wallTexture = useLoader(TextureLoader, '/wall-2.jpg')
  
  useEffect(() => {
    if (blocksRef.current) {
      // Initialize the array if needed
      blocksRef.current = []
    }
  }, [blocksRef])

  return (
    <>
      {ART_BLOCKS.map((artBlock, index) => (
        <group
          key={artBlock.id}
          ref={(el) => {
            if (blocksRef.current && el) {
              blocksRef.current[index] = el
            }
          }}
          position={artBlock.position}
          rotation={artBlock.rotation}
        >
          <mesh>
            <boxGeometry args={artBlock.size} />
            {artBlock.type === 'glass' ? (
              <meshPhysicalMaterial
                color="#ffffff"
                transmission={0.9}
                opacity={0.3}
                transparent={true}
                roughness={0.1}
                metalness={0.0}
                clearcoat={1.0}
                clearcoatRoughness={0.1}
                ior={1.5}
                thickness={0.5}
              />
            ) : (
              <meshStandardMaterial map={wallTexture} />
            )}
          </mesh>
        </group>
      ))}
    </>
  )
}

const Gallery3D3: React.FC = () => {
  const artBlocksRef = useRef<THREE.Group[]>([])
  const mobileControlsRef = useRef<{ [key: string]: boolean }>({})
  const galleryRef = useRef<HTMLDivElement>(null!)
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

  const handleDiscoverClick = async () => {
    setShowGallery(true)

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

    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen()
      } catch (err) {
        console.warn("Failed to exit fullscreen:", err)
      }
    }
  }

  if (!showGallery) {
    return (
      <div className="relative min-h-screen bg-gradient-to-br from-black via-[#0d1a0d] to-black px-8 py-20 overflow-hidden flex items-center justify-center">
  {/* Soft glowing particles */}
  <div className="absolute inset-0 pointer-events-none z-0">
    {Array.from({ length: 40 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-1.5 h-1.5 bg-green-400 rounded-full opacity-20 animate-sparkle"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      />
    ))}
  </div>

  {/* Main content */}
  <div className="relative z-10 flex flex-col-reverse md:flex-row items-center gap-16 max-w-7xl w-full">
    {/* Left: Image of person holding lantern */}
    <div className="flex-1 flex justify-center items-center">
      <div className="relative w-[400px] h-[500px] rounded-xl overflow-hidden shadow-2xl shadow-green-400/30 border border-green-400/20">
        <img
          src="/lantern-3.png" // 👉 Replace with your green-themed image
          alt="Person holding lantern"
          className="object-cover w-full h-full"
        />
      </div>
    </div>

    {/* Right: Text content */}
    <div className="flex-1 space-y-5 text-left text-white">
      <p className="uppercase text-sm tracking-widest text-green-200/60">Section 3</p>
      <h2 className="text-3xl md:text-4xl font-medium italic text-green-100/90">
        A moment of <span className="text-green-400 font-bold">connection</span>, where light carries meaning.
      </h2>

      <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-tight">
        <span className="text-green-400">Touch</span>{" "}
        <span className="block text-white">of Light</span>
      </h1>

      <p className="text-white/80 text-lg max-w-lg leading-relaxed">
        Feel the spirit of the lantern—held close, glowing warm. A gesture of care, memory, and heritage passed between generations.
      </p>

      <button
        onClick={handleDiscoverClick}
        className="mt-4 group bg-green-400 hover:bg-green-300 text-black font-semibold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-400/30"
      >
        Feel the Glow
      </button>

      <p className="text-white/40 text-sm mt-2">
        {isMobile ? "Tap to explore light stories" : "Click & drag to feel the connection"}
      </p>
    </div>
  </div>

  {/* Sparkle animation */}
  <style jsx>{`
    @keyframes sparkle {
      0% {
        transform: translateY(0px) scale(1);
        opacity: 0.2;
      }
      50% {
        transform: translateY(-10px) scale(1.3);
        opacity: 0.6;
      }
      100% {
        transform: translateY(-20px) scale(0.8);
        opacity: 0;
      }
    }
    .animate-sparkle {
      animation: sparkle 6s ease-in-out infinite;
    }
  `}</style>
</div>


    )
  }

  return (
    <div
      id="gallery-wrapper"
      ref={galleryRef}
      className="w-full h-screen relative"
    >
      <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [2, 1.5, 25] }}>
        <ambientLight intensity={1.2} color="#FFE8C2" />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <ArtBlocks blocksRef={artBlocksRef} />
        <FreeMovementControls
          artBlocksRef={artBlocksRef}
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

      <MobileControls onMove={handleMobileMove} isMobile={isMobile} />
    </div>
  )
}

export default Gallery3D3