'use client'

import React, { useRef, useEffect, useMemo } from 'react'
import { Canvas, useThree, useLoader, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { TextureLoader } from 'three'
import PlantModel from './ui/plant-model'
import BarrierModel from './ui/barrier-model'
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



// Camera có thể xoay 360 độ quanh trung tâm phòng
const FreeMovementControls: React.FC<{ centerWallRef: React.RefObject<THREE.Mesh> }> = ({ centerWallRef }) => {
  const { camera, gl } = useThree()
  const keys = useRef<{ [key: string]: boolean }>({})
  const velocity = useRef(new THREE.Vector3())
  const direction = new THREE.Vector3()
  const pitch = useRef(0)
  const yaw = useRef(0)
  const isPointerLocked = useRef(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => (keys.current[e.key.toLowerCase()] = true)
    const handleKeyUp = (e: KeyboardEvent) => (keys.current[e.key.toLowerCase()] = false)

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    const canvas = gl.domElement

    const onClick = () => {
      canvas.requestPointerLock()
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isPointerLocked.current) return
      yaw.current -= e.movementX * 0.002
      pitch.current -= e.movementY * 0.002
      pitch.current = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch.current))

      const quaternion = new THREE.Quaternion()
      quaternion.setFromEuler(new THREE.Euler(pitch.current, yaw.current, 0, 'YXZ'))
      camera.quaternion.copy(quaternion)
    }

    const onPointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === canvas
    }

    canvas.addEventListener('click', onClick)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('pointerlockchange', onPointerLockChange)

    return () => {
      canvas.removeEventListener('click', onClick)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('pointerlockchange', onPointerLockChange)
    }
  }, [camera, gl])

  useFrame((_, delta) => {
  const speed = 5
  direction.set(0, 0, 0)

  if (keys.current['w']) direction.z -= 1
  if (keys.current['s']) direction.z += 1
  if (keys.current['a']) direction.x -= 1
  if (keys.current['d']) direction.x += 1

  direction.normalize()
  direction.applyQuaternion(camera.quaternion)
  velocity.current.copy(direction).multiplyScalar(speed * delta)

  const nextPosition = camera.position.clone().add(velocity.current)

  const wall = centerWallRef.current
  if (wall) {
    wall.geometry.computeBoundingBox()
    wall.updateMatrixWorld(true)
    const box = wall.geometry.boundingBox!.clone().applyMatrix4(wall.matrixWorld)

    // Thêm buffer nhỏ để tránh đi xuyên
    const buffer = 0.3
    const paddedBox = box.clone().expandByScalar(buffer)

    if (paddedBox.containsPoint(nextPosition)) {
      // 🚫 Không di chuyển nếu va chạm
      return
    }
  }

  // ✅ Di chuyển nếu không va chạm
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

  const wallTexture = useLoader(TextureLoader, '/wall-1.jpg')
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

  return (
    <div className="w-full h-screen relative">
      <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [2, 1.5, 25] }}>
        <ambientLight intensity={0.9} color="#fffaf0" />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        <CenterWall ref={centerWallRef}/>

        <FreeMovementControls centerWallRef={centerWallRef}/>
        <WallBackground />

        {/* Cây cảnh */}
        <PlantModel position={[-46, -5, -46]} /> // Trái sau
        <PlantModel position={[46, -5, -46]} />  // Phải sau
        <PlantModel position={[-46, -5, 46]} />  // Trái trước
        <PlantModel position={[46, -5, 46]} />   // Phải trước
        <BarrierModel position={[0, -5, 16]} />
        <BarrierModel position={[0, -5, -27]} />


        {/* Tranh */}
        {SAMPLE_IMAGES.map((imageData) => (
          <ImageFrame key={imageData.id} imageData={imageData} />
          
        ))}
        

      </Canvas>

      <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
        <p className="text-sm">Click and drag horizontally to look around</p>
      </div>
    </div>
  )
}

export default Gallery3D
