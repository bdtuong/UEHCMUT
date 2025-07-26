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

// Interface cho art box
interface ArtBox {
  id: string
  position: [number, number, number]
  rotation: [number, number, number]
  size: [number, number, number] // width, height, depth
}

// Tạo 30 art boxes ngẫu nhiên trong phòng
const generateArtBoxes = (): ArtBox[] => {
  const boxes: ArtBox[] = []
  const roomSize = 90 // Slightly smaller than room walls to keep boxes inside
  
  for (let i = 0; i < 30; i++) {
    const width = Math.random() * 4 + 2 // 2-6
    const height = Math.random() * 3 + 4 // 4-7
    const depth = Math.random() * 2 + 0.5 // 0.5-2.5
    
    // Random position within room bounds
    const x = (Math.random() - 0.5) * roomSize
    const z = (Math.random() - 0.5) * roomSize
    const y = height / 2 - 5 // Bottom aligned with floor
    
    // Random rotation
    const rotY = Math.random() * Math.PI * 2
    
    boxes.push({
      id: `box-${i}`,
      position: [x, y, z],
      rotation: [0, rotY, 0],
      size: [width, height, depth]
    })
  }
  
  return boxes
}

// Generate art boxes
const ART_BOXES = generateArtBoxes()

// Tạo tranh cho tất cả các mặt của boxes
const generateImageData = (): ImageData[] => {
  const images: ImageData[] = []
  let imageId = 1
  
  ART_BOXES.forEach((box, boxIndex) => {
    const [x, y, z] = box.position
    const [rotX, rotY, rotZ] = box.rotation
    const [width, height, depth] = box.size
    
    // Create paintings for each face of the box
    const faces = [
      // Front face
      {
        position: [x, y, z + depth/2 + 0.01] as [number, number, number],
        size: [width * 0.8, height * 0.6] as [number, number],
        rotation: [0, rotY, 0] as [number, number, number]
      },
      // Back face
      {
        position: [x, y, z - depth/2 - 0.01] as [number, number, number],
        size: [width * 0.8, height * 0.6] as [number, number],
        rotation: [0, rotY + Math.PI, 0] as [number, number, number]
      },
      // Left face
      {
        position: [x - width/2 - 0.01, y, z] as [number, number, number],
        size: [depth * 0.8, height * 0.6] as [number, number],
        rotation: [0, rotY + Math.PI/2, 0] as [number, number, number]
      },
      // Right face
      {
        position: [x + width/2 + 0.01, y, z] as [number, number, number],
        size: [depth * 0.8, height * 0.6] as [number, number],
        rotation: [0, rotY - Math.PI/2, 0] as [number, number, number]
      }
    ]
    
    faces.forEach((face, faceIndex) => {
      images.push({
        id: `${imageId}`,
        title: `Artwork ${imageId}`,
        artist: `Artist ${String.fromCharCode(65 + (imageId % 26))}`,
        description: `Beautiful lantern artwork on box ${boxIndex + 1}, face ${faceIndex + 1}.`,
        imageUrl: '/mock-img.jpg',
        position: face.position,
        size: face.size,
        rotation: face.rotation
      })
      imageId++
    })
  })
  
  return images
}

const SAMPLE_IMAGES = generateImageData()

const ImageFrame: React.FC<{ imageData: ImageData }> = ({ imageData }) => {
  const { camera } = useThree()
  const texture = useLoader(TextureLoader, imageData.imageUrl)
  const [width, height] = imageData.size
  const frameThickness = 0.03
  const frameColor = '#D4AF37'
  const [showInfo, setShowInfo] = useState(false)

  const [x, y, z] = imageData.position
  const position = new THREE.Vector3(x, y, z)

  // Use provided rotation or calculate based on position
  const rotation = imageData.rotation 
    ? new THREE.Euler(...imageData.rotation)
    : new THREE.Euler()

  // Kiểm tra khoảng cách camera
  useFrame(() => {
    const distance = camera.position.distanceTo(position)
    setShowInfo(distance < 4)
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
        <Html distanceFactor={10} position={[0, height / 2 + 0.3, 0]} transform sprite>
          <div className="bg-white/90 backdrop-blur text-black p-2 rounded-md shadow-lg max-w-xs text-xs">
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
  artBoxesRef: React.RefObject<THREE.Group[]>
  mobileControls: React.MutableRefObject<{ [key: string]: boolean }>
}> = ({ artBoxesRef, mobileControls }) => {
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

    // 🚧 Collision with art boxes
    const boxes = artBoxesRef.current
    if (boxes) {
      let collision = false
      for (const box of boxes) {
        if (box && box.children[0]) { // Check if box mesh exists
          const boxMesh = box.children[0] as THREE.Mesh
          boxMesh.geometry.computeBoundingBox()
          boxMesh.updateMatrixWorld(true)
          const boxBounds = boxMesh.geometry.boundingBox!.clone().applyMatrix4(boxMesh.matrixWorld)
          const paddedBox = boxBounds.clone().expandByScalar(0.5)
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

// Component for multiple art boxes
const ArtBoxes: React.FC<{ boxesRef: React.RefObject<THREE.Group[]> }> = ({ boxesRef }) => {
  const wallTexture = useLoader(TextureLoader, '/wall-2.jpg')
  
  useEffect(() => {
    if (boxesRef.current) {
      // Initialize the array if needed
      boxesRef.current = []
    }
  }, [boxesRef])

  return (
    <>
      {ART_BOXES.map((artBox, index) => (
        <group
          key={artBox.id}
          ref={(el) => {
            if (boxesRef.current && el) {
              boxesRef.current[index] = el
            }
          }}
          position={artBox.position}
          rotation={artBox.rotation}
        >
          <mesh>
            <boxGeometry args={artBox.size} />
            <meshStandardMaterial map={wallTexture} />
          </mesh>
        </group>
      ))}
    </>
  )
}

const Gallery3D2: React.FC = () => {
  const artBoxesRef = useRef<THREE.Group[]>([])
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
      <div className="min-h-screen bg-black relative flex items-center justify-center overflow-hidden px-8">
  {/* Yellow particles floating in the background */}
  <div className="absolute inset-0 pointer-events-none">
    {Array.from({ length: 25 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-40 animate-float-fade"
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
      <p className="uppercase text-sm text-white/50 tracking-widest">Section 2</p>
      <h2 className="text-2xl md:text-3xl font-medium text-white/80 italic">
        A journey into the <span className="text-yellow-400 font-semibold">creative flames</span> of Vietnamese artisans.
      </h2>

      {/* Title */}
      <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-tight">
        <span className="text-yellow-400">Ignite</span>{" "}
        <span className="block text-white">Inspiration</span>
      </h1>

      {/* Subtitle */}
      <p className="text-xl md:text-2xl text-white/70 font-light">
        Stories behind the glow
      </p>

      {/* Description */}
      <p className="text-white/70 text-lg max-w-lg leading-relaxed">
        Discover the rich heritage of lantern craftsmanship, passed down through generations — now reborn in digital form, sparking creativity in every visitor.
      </p>

      {/* Button */}
      <button
        onClick={handleDiscoverClick}
        className="mt-4 group bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-4 px-10 rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/25"
      >
        Enter
      </button>

      {/* Controls hint */}
      <p className="text-white/40 text-sm mt-3">
        {isMobile ? "Tap to explore" : "Click and drag to look around"}
      </p>
    </div>

    {/* Right side: Image or 3D element */}
    <div className="flex-1 hidden md:flex items-center justify-center">
      <div className="w-full h-[400px] rounded-xl border border-yellow-400/20 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/30">
        <img
          src="/lantern-2.png"
          alt="Crafting preview"
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
        <ArtBoxes boxesRef={artBoxesRef} />
        <FreeMovementControls
          artBoxesRef={artBoxesRef}
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

export default Gallery3D2