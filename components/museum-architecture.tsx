"use client";

import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, CanvasTexture, SRGBColorSpace, Vector3 } from "three";
import { FLOOR_Y, museumWalls, WALL_HEIGHT } from "@/lib/museum-layout";

export function MuseumSign({
  title,
  subtitle = "",
  position,
  rotation = 0,
  width = 6,
  height = 1.15,
  dark = false,
}: {
  title: string;
  subtitle?: string;
  position: [number, number, number];
  rotation?: number;
  width?: number;
  height?: number;
  dark?: boolean;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1536;
    canvas.height = 320;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = dark ? "#28483c" : "#f4efdf";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = "center";
    ctx.fillStyle = dark ? "#f4efdf" : "#28483c";
    ctx.font = "52px Georgia";
    ctx.fillText(title, 768, subtitle ? 135 : 175, 1430);
    if (subtitle) {
      ctx.fillStyle = dark ? "#dfc495" : "#956243";
      ctx.font = "27px Arial";
      ctx.fillText(subtitle, 768, 225, 1430);
    }
    const result = new CanvasTexture(canvas);
    result.colorSpace = SRGBColorSpace;
    return result;
  }, [title, subtitle, dark]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={position} rotation={[0, rotation, 0]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

function DisplayVase() {
  const { scene } = useGLTF("/models/ceramic-vase/ceramic-vase.glb");
  const { model, scale } = useMemo(() => {
    const model = scene.clone(true);
    const box = new Box3().setFromObject(model);
    model.position.sub(box.getCenter(new Vector3()));
    return { model, scale: 2 / box.getSize(new Vector3()).y };
  }, [scene]);
  return (
    <group position={[-11, 0.5, 16]} scale={scale}>
      <primitive object={model} />
    </group>
  );
}

function Bench({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, FLOOR_Y, z]}>
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[5, 0.22, 1.4]} />
        <meshStandardMaterial color="#8b6045" roughness={0.7} />
      </mesh>
      {[-1.8, 1.8].map((leg) => (
        <mesh key={leg} position={[leg, 0.28, 0]}>
          <boxGeometry args={[0.18, 0.56, 1.1]} />
          <meshStandardMaterial color="#354238" />
        </mesh>
      ))}
    </group>
  );
}

export default function MuseumArchitecture() {
  return (
    <>
      <color attach="background" args={["#e8e2d2"]} />
      <hemisphereLight args={["#fff9e9", "#b9ae93", 1.8]} />
      <directionalLight position={[0, 9, 13]} intensity={2.2} color="#fff1d8" />
      <mesh position={[0, FLOOR_Y - 0.12, 0]}>
        <boxGeometry args={[44, 0.24, 50]} />
        <meshStandardMaterial color="#d9d0ba" roughness={0.9} />
      </mesh>
      <gridHelper
        args={[50, 25, "#c3b99f", "#cfc5af"]}
        position={[0, FLOOR_Y + 0.004, 0]}
      />
      <mesh position={[0, FLOOR_Y + 0.012, 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7, 39]} />
        <meshStandardMaterial color="#a2ac93" roughness={1} />
      </mesh>
      {museumWalls.map((wall, index) => (
        <group key={index} position={[wall.x, 0, wall.z]}>
          <mesh position={[0, FLOOR_Y + WALL_HEIGHT / 2, 0]}>
            <boxGeometry args={[wall.width, WALL_HEIGHT, wall.depth]} />
            <meshStandardMaterial
              color={wall.kind === "outer" ? "#e7dfcc" : "#f3eedf"}
              roughness={0.92}
            />
          </mesh>
          <mesh position={[0, FLOOR_Y + 0.12, 0]}>
            <boxGeometry
              args={[wall.width + 0.035, 0.24, wall.depth + 0.035]}
            />
            <meshStandardMaterial color="#8c7556" roughness={0.85} />
          </mesh>
          <mesh position={[0, FLOOR_Y + WALL_HEIGHT - 0.09, 0]}>
            <boxGeometry args={[wall.width + 0.05, 0.18, wall.depth + 0.05]} />
            <meshStandardMaterial color="#af9c7b" />
          </mesh>
        </group>
      ))}
      {/* Lintels frame the openings while leaving the walking route unobstructed. */}
      {[-6, 6].flatMap((x) =>
        [5, -10].map((z) => (
          <group key={`${x}-${z}`}>
            <mesh position={[x, 3.2, z]}>
              <boxGeometry args={[0.48, 2.4, 6]} />
              <meshStandardMaterial color="#e0d5bc" />
            </mesh>
            {[z - 3, z + 3].map((edge) => (
              <mesh key={edge} position={[x, 0.2, edge]}>
                <boxGeometry args={[0.48, 3.6, 0.12]} />
                <meshStandardMaterial color="#9c7653" />
              </mesh>
            ))}
          </group>
        )),
      )}
      {[-14, 14].map((x) => (
        <mesh key={x} position={[x, 3.2, -3]}>
          <boxGeometry args={[4, 2.4, 0.48]} />
          <meshStandardMaterial color="#e0d5bc" />
        </mesh>
      ))}
      <mesh position={[0, 3.2, -17]}>
        <boxGeometry args={[8, 2.4, 0.48]} />
        <meshStandardMaterial color="#28483c" />
      </mesh>
      {/* Floating roof slabs keep each room intimate; the central walk remains a bright atrium. */}
      {[-14, 14].flatMap((x) =>
        [3.5, -10].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 4.5, z]}>
            <boxGeometry args={[16, 0.2, 13.5]} />
            <meshStandardMaterial color="#eee7d7" />
          </mesh>
        )),
      )}
      <mesh position={[0, 4.5, -21]}>
        <boxGeometry args={[44, 0.2, 8]} />
        <meshStandardMaterial color="#eee7d7" />
      </mesh>
      {[-19, -9, 1, 11, 21].map((z) => (
        <group key={z}>
          <mesh position={[0, 4.6, z]}>
            <boxGeometry args={[12, 0.2, 0.25]} />
            <meshStandardMaterial color="#8b7050" />
          </mesh>
          <mesh position={[0, 4.35, z]}>
            <boxGeometry args={[3, 0.035, 0.16]} />
            <meshBasicMaterial color="#fff7df" />
          </mesh>
        </group>
      ))}
      {[
        [-14, 4],
        [-14, -10],
        [14, 4],
        [14, -10],
        [0, -21],
        [0, 16],
      ].map(([x, z], i) => (
        <group key={i}>
          <pointLight
            position={[x, 3.5, z]}
            intensity={38}
            distance={17}
            decay={2}
            color="#fff4d9"
          />
          <mesh position={[x, 4.36, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[3.5, 0.3]} />
            <meshBasicMaterial color="#fff7dd" />
          </mesh>
        </group>
      ))}
      <mesh position={[-11, -1.05, 16]}>
        <cylinderGeometry args={[1.5, 1.6, 1.1, 48]} />
        <meshStandardMaterial color="#b6a285" roughness={0.9} />
      </mesh>
      <DisplayVase />
      <MuseumSign
        title="A closer look at clay"
        subtitle="Contemporary material study / Poly Haven CC0"
        position={[-11, -0.9, 17.62]}
        width={3.2}
        height={0.65}
      />
      <Bench x={11} z={17} />
      <Bench x={0} z={-21} />
      <MuseumSign
        title="THE CULTURE WALK"
        subtitle="Four galleries / one shared journey"
        position={[0, 3.1, -16.72]}
        width={7.5}
      />
      <MuseumSign
        title="01 / MATERIAL & MAKING"
        subtitle="← West gallery"
        position={[-11, 2.8, 10.5]}
        width={6.5}
        height={1.1}
      />
      <MuseumSign
        title="03 / PATTERN & EXPRESSION"
        subtitle="East gallery →"
        position={[11, 2.8, 10.5]}
        width={6.5}
        height={1.1}
      />
      <MuseumSign
        title="02 / EVERYDAY KNOWLEDGE"
        subtitle="← West gallery"
        position={[-5.75, 1.7, -2.5]}
        rotation={Math.PI / 2}
        width={6}
        height={1.1}
      />
      <MuseumSign
        title="04 / ART & PLACE"
        subtitle="East gallery →"
        position={[5.75, 1.7, -2.5]}
        rotation={-Math.PI / 2}
        width={6}
        height={1.1}
      />
      <MuseumSign
        title="05 / SHARED STORIES"
        subtitle="A place to pause and connect the collections"
        position={[0, 2.7, -24.7]}
        width={7}
        height={1.1}
        dark
      />
    </>
  );
}
