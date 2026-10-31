"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  Html,
  Lightformer,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { Box3, Vector3 } from "three";

function Vase({ angle }: { angle: number }) {
  const { scene } = useGLTF("/models/ceramic-vase/ceramic-vase.glb");
  const { model, scale } = useMemo(() => {
    const model = scene.clone(true);
    const box = new Box3().setFromObject(model);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    model.position.sub(center);
    return { model, scale: 3.4 / size.y };
  }, [scene]);
  return (
    <group rotation={[0, angle, 0]} scale={scale}>
      <primitive object={model} />
    </group>
  );
}

export default function HeroVaseScene() {
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [angle, setAngle] = useState(-0.4);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const rotate = (step: number) => {
    setPaused(true);
    setAngle((value) => value + step);
  };
  const rotating = !paused && !reducedMotion;

  return (
    <div
      className="relative h-full w-full bg-[#e7dece]"
      tabIndex={0}
      role="region"
      aria-label="Interactive ceramic vase. Drag to rotate or use the left and right arrow keys."
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          rotate(event.key === "ArrowLeft" ? -Math.PI / 8 : Math.PI / 8);
        }
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-12 z-10 text-center text-[9px] uppercase tracking-[.15em] text-[#6c7263]">
        Interactive ceramic study / 001
      </div>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.35, 7.2], fov: 36 }}
        gl={{ alpha: true, antialias: true }}
        aria-label="Three-dimensional white ceramic vase"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 5, 4]} intensity={3} color="#fff4dd" />
        <directionalLight
          position={[-4, 2, -3]}
          intensity={1.5}
          color="#e4edff"
        />
        <Suspense
          fallback={
            <Html center>
              <p
                role="status"
                className="w-48 text-center text-xs text-[#62685f]"
              >
                Loading ceramic vase…
              </p>
            </Html>
          }
        >
          <Environment resolution={128} frames={1}>
            <Lightformer position={[3, 2, 4]} scale={[3, 5, 1]} intensity={3} />
            <Lightformer
              position={[-3, 1, 2]}
              scale={[2, 4, 1]}
              intensity={2}
            />
            <Lightformer
              position={[0, 4, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={4}
              intensity={1}
            />
          </Environment>
          <Vase angle={angle} />
        </Suspense>
        <mesh position={[0, -1.81, 0]}>
          <cylinderGeometry args={[1.15, 1.2, 0.18, 64]} />
          <meshStandardMaterial color="#b8a88e" roughness={0.95} />
        </mesh>
        <OrbitControls
          makeDefault
          target={[0, -0.05, 0]}
          enableZoom={false}
          enablePan={false}
          autoRotate={rotating && !dragging}
          autoRotateSpeed={0.75}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI * 0.58}
          onStart={() => setDragging(true)}
          onEnd={() => setDragging(false)}
        />
      </Canvas>
      <div className="absolute inset-x-0 bottom-6 flex flex-col items-center gap-2">
        <p className="pointer-events-none text-[10px] text-[#62685f]">
          Drag to explore · Use ← → to rotate
        </p>
      </div>
    </div>
  );
}
