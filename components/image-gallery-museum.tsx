"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useId,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import {
  TextureLoader,
  Vector3,
  SRGBColorSpace,
  PerspectiveCamera,
} from "three";
import * as Dialog from "@radix-ui/react-dialog";
import CulturalText from "./cultural-text";
import PhotoCredit from "./photo-credit";
import MuseumArchitecture, { MuseumSign } from "./museum-architecture";
import photoSources from "@/public/culture/photos/sources.json";
import {
  collections,
  culturalExhibits,
  lanternExhibits,
  type CollectionId,
} from "@/lib/culture";
import {
  ENTRANCE,
  exhibitSlots,
  moveThroughMuseum,
  museumWalls,
  museumZone,
  nearbyExhibit,
  viewSectorPath,
} from "@/lib/museum-layout";

interface Exhibit {
  id: string;
  title: string;
  artist: string;
  description: string;
  introduction: string;
  imageUrl: string;
  position: [number, number, number];
  size: [number, number];
  yaw: number;
}
interface Pose {
  x: number;
  z: number;
  yaw: number;
  fov: number;
}

function ImageFrame({ exhibit }: { exhibit: Exhibit }) {
  const texture = useLoader(TextureLoader, exhibit.imageUrl);
  texture.colorSpace = SRGBColorSpace;
  const [width, height] = exhibit.size;
  return (
    <group position={exhibit.position} rotation={[0, exhibit.yaw, 0]}>
      <mesh position={[0, 0, -0.035]}>
        <boxGeometry args={[width + 0.17, height + 0.17, 0.06]} />
        <meshStandardMaterial color="#8f7250" roughness={0.55} />
      </mesh>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={texture} roughness={0.85} />
      </mesh>
      <MuseumSign
        title={exhibit.title}
        subtitle="Step closer to discover the story"
        position={[0, -height / 2 - 0.4, 0.02]}
        width={Math.min(width + 1, 6)}
        height={0.6}
      />
    </group>
  );
}

function WalkingControls({
  mobileKeys,
  reset,
  onPose,
}: {
  mobileKeys: React.MutableRefObject<Record<string, boolean>>;
  reset: number;
  onPose: (pose: Pose) => void;
}) {
  const { camera, gl } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const yaw = useRef(0);
  const pitch = useRef(0);
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const reportTime = useRef(0);
  const forward = useMemo(() => new Vector3(), []);
  const right = useMemo(() => new Vector3(), []);
  const direction = useMemo(() => new Vector3(), []);
  useEffect(() => {
    camera.position.set(ENTRANCE.x, 0, ENTRANCE.z);
    camera.rotation.order = "YXZ";
    camera.rotation.set(0, 0, 0);
    yaw.current = 0;
    pitch.current = 0;
    keys.current = {};
    mobileKeys.current = {};
    onPose({ ...ENTRANCE, yaw: 0, fov: 90 });
  }, [camera, reset, mobileKeys, onPose]);
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (
        !(event.target instanceof HTMLElement) ||
        !event.target.closest("input, textarea, select")
      ) {
        const key = event.key.toLowerCase();
        if (
          [
            "w",
            "a",
            "s",
            "d",
            "arrowup",
            "arrowdown",
            "arrowleft",
            "arrowright",
          ].includes(key)
        ) {
          event.preventDefault();
          keys.current[key] = true;
        }
      }
    };
    const up = (event: KeyboardEvent) => {
      keys.current[event.key.toLowerCase()] = false;
    };
    const clear = () => {
      keys.current = {};
      mobileKeys.current = {};
      dragging.current = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", clear);
    };
  }, [mobileKeys]);
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.style.touchAction = "none";
    const down = (event: PointerEvent) => {
      if (event.button !== 0) return;
      dragging.current = true;
      lastPointer.current = { x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!dragging.current) return;
      const dx = event.clientX - lastPointer.current.x;
      const dy = event.clientY - lastPointer.current.y;
      lastPointer.current = { x: event.clientX, y: event.clientY };
      yaw.current -= dx * 0.0025;
      pitch.current = Math.max(
        -0.65,
        Math.min(0.65, pitch.current - dy * 0.0025),
      );
      camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");
    };
    const up = () => {
      dragging.current = false;
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("lostpointercapture", up);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("lostpointercapture", up);
    };
  }, [gl, camera]);
  useFrame(({ clock }, delta) => {
    const active = (key: string) =>
      keys.current[key] || mobileKeys.current[key];
    const fb =
      Number(!!(active("w") || active("arrowup"))) -
      Number(!!(active("s") || active("arrowdown")));
    const lr =
      Number(!!(active("d") || active("arrowright"))) -
      Number(!!(active("a") || active("arrowleft")));
    if (fb || lr) {
      forward.set(-Math.sin(yaw.current), 0, -Math.cos(yaw.current));
      right.set(Math.cos(yaw.current), 0, -Math.sin(yaw.current));
      direction
        .copy(forward)
        .multiplyScalar(fb)
        .addScaledVector(right, lr)
        .normalize()
        .multiplyScalar(5 * Math.min(delta, 0.05));
      const point = moveThroughMuseum(
        camera.position.x,
        camera.position.z,
        direction.x,
        direction.z,
      );
      camera.position.set(point.x, 0, point.z);
    }
    if (clock.elapsedTime - reportTime.current > 0.15) {
      onPose({
        x: camera.position.x,
        z: camera.position.z,
        yaw: yaw.current,
        fov:
          camera instanceof PerspectiveCamera
            ? (2 *
                Math.atan(
                  Math.tan((camera.fov * Math.PI) / 360) * camera.aspect,
                ) *
                180) /
              Math.PI
            : 90,
      });
      reportTime.current = clock.elapsedTime;
    }
  });
  return null;
}

function MobileControls({
  onMove,
}: {
  onMove: (key: string, pressed: boolean) => void;
}) {
  return (
    <div
      className="absolute bottom-5 left-4 z-20 grid grid-cols-3 gap-2"
      aria-label="Walking controls"
    >
      {[
        { key: "w", label: "Walk forward", arrow: "↑" },
        { key: "a", label: "Walk left", arrow: "←" },
        { key: "s", label: "Walk backward", arrow: "↓" },
        { key: "d", label: "Walk right", arrow: "→" },
      ].map((item, i) => (
        <button
          key={item.key}
          aria-label={item.label}
          className={`h-11 w-11 touch-none rounded-full border border-white/30 bg-[#213c33]/90 text-lg text-white ${i === 0 ? "col-start-2 row-start-1" : i === 1 ? "col-start-1 row-start-2" : i === 2 ? "col-start-2 row-start-2" : "col-start-3 row-start-2"}`}
          onPointerDown={(event) => {
            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);
            onMove(item.key, true);
          }}
          onPointerUp={() => onMove(item.key, false)}
          onPointerCancel={() => onMove(item.key, false)}
          onLostPointerCapture={() => onMove(item.key, false)}
          onKeyDown={(event) => {
            if (event.key === " " || event.key === "Enter") {
              event.preventDefault();
              onMove(item.key, true);
            }
          }}
          onKeyUp={() => onMove(item.key, false)}
        >
          {item.arrow}
        </button>
      ))}
    </div>
  );
}

function FloorPlan({ pose }: { pose: Pose }) {
  const clipId = useId();
  return (
    <aside
      className="pointer-events-none absolute bottom-4 right-4 z-20 w-32 border border-[#c9b99b]/50 bg-[#faf7ef]/95 p-2 text-[#28483c] shadow-lg sm:w-44"
      aria-label={`Museum floor plan. Current location: ${museumZone(pose.x, pose.z)}`}
    >
      <p className="mb-1 text-[9px] uppercase tracking-[.15em]">You are here</p>
      <svg
        viewBox="-25 -28 50 56"
        className="w-full"
        role="img"
        aria-label="Four side galleries connected to a central walk, a welcome hall and a rear gallery"
      >
        <rect x="-22" y="-25" width="44" height="50" fill="#ede6d4" />
        <rect x="-6" y="-17" width="12" height="42" fill="#c7d0b8" />
        <defs>
          <clipPath id={clipId}>
            <rect x="-21.8" y="-24.8" width="43.6" height="49.6" />
          </clipPath>
        </defs>
        <path
          aria-label="Current field of view"
          d={viewSectorPath(pose.x, pose.z, pose.yaw, pose.fov)}
          fill="#b97546"
          fillOpacity={0.3}
          stroke="#a34c2e"
          strokeWidth={0.35}
          clipPath={`url(#${clipId})`}
        />
        {museumWalls.map((wall, i) => (
          <rect
            key={i}
            x={wall.x - wall.width / 2}
            y={wall.z - wall.depth / 2}
            width={Math.max(wall.width, 0.55)}
            height={Math.max(wall.depth, 0.55)}
            fill="#52604c"
          />
        ))}
        {[
          [-14, 4, "01"],
          [-14, -10, "02"],
          [14, 4, "03"],
          [14, -10, "04"],
          [0, -21, "05"],
        ].map(([x, z, label]) => (
          <text
            key={label}
            x={Number(x)}
            y={Number(z) + 1}
            textAnchor="middle"
            fontSize="3"
            fill="#5d624f"
          >
            {label}
          </text>
        ))}
        <circle
          cx={pose.x}
          cy={pose.z}
          r="1.25"
          fill="#a34c2e"
          stroke="#fff"
          strokeWidth=".45"
        />
      </svg>
      <p className="mt-1 text-[9px] leading-4">{museumZone(pose.x, pose.z)}</p>
    </aside>
  );
}

function SceneReady({ onReady }: { onReady: () => void }) {
  useEffect(onReady, [onReady]);
  return null;
}
function LoadingStatus({ slow }: { slow: boolean }) {
  const { progress } = useProgress();
  return (
    <div
      className="absolute inset-0 z-10 grid place-items-center bg-[#e8e2d2] p-8 text-center text-[#28483c]"
      role="status"
    >
      <div>
        <div className="mx-auto mb-5 h-9 w-9 animate-spin rounded-full border-2 border-[#28483c]/20 border-t-[#28483c]" />
        <p className="font-serif text-2xl">Opening the museum…</p>
        <p className="mt-3 text-sm">
          {slow
            ? "Loading is taking longer than usual. You can leave or use reading mode."
            : "Preparing the galleries, artwork and material study."}
        </p>
        <p className="mt-3 text-sm">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}

export default function Gallery3D({
  collectionId = "craft",
  onClose,
  onRead,
}: {
  collectionId?: CollectionId;
  onClose: () => void;
  onRead: () => void;
}) {
  const collection = collections.find((item) => item.id === collectionId)!;
  const records = useMemo(
    () =>
      collectionId === "festival"
        ? lanternExhibits
        : collectionId === "art"
          ? [
              culturalExhibits[3],
              culturalExhibits[2],
              culturalExhibits[4],
              culturalExhibits[0],
              culturalExhibits[1],
              culturalExhibits[5],
            ]
          : culturalExhibits,
    [collectionId],
  );
  const exhibits: Exhibit[] = useMemo(
    () =>
      records.map((record, index) => {
        const slot = exhibitSlots[index];
        const photo = photoSources.find(
          (photo) => photo.src === record.imageUrl,
        );
        const ratio = photo
          ? photo.width / photo.height
          : slot.size[0] / slot.size[1];
        const width = Math.min(slot.size[0], slot.size[1] * ratio);
        return {
          ...record,
          ...slot,
          size: [width, width / ratio] as [number, number],
        };
      }),
    [records],
  );
  const mobileKeys = useRef<Record<string, boolean>>({});
  const [mobile, setMobile] = useState(false);
  const [ready, setReady] = useState(false);
  const [slow, setSlow] = useState(false);
  const [pose, setPose] = useState<Pose>({ ...ENTRANCE, yaw: 0, fov: 90 });
  const [reset, setReset] = useState(0);
  const [selected, setSelected] = useState<Exhibit | null>(null);
  useEffect(() => {
    setSelected((current) => {
      const nearby = nearbyExhibit(pose.x, pose.z, exhibits, current?.id);
      return nearby?.id === current?.id ? current : nearby;
    });
  }, [pose, exhibits]);
  const markReady = useCallback(() => setReady(true), []);
  const reportPose = useCallback((pose: Pose) => setPose(pose), []);
  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse), (max-width: 768px)");
    const update = () => setMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (ready) return;
    const timer = window.setTimeout(() => setSlow(true), 15000);
    return () => window.clearTimeout(timer);
  }, [ready]);
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[#e8e2d2]" />
        <Dialog.Content className="fixed inset-0 z-50 h-[100dvh] w-screen overflow-hidden bg-[#e8e2d2] outline-none">
          <Dialog.Title className="sr-only">
            {collection.title} 3D museum
          </Dialog.Title>
          <Canvas
            dpr={[1, 1.5]}
            camera={{
              fov: 66,
              near: 0.1,
              far: 130,
              position: [ENTRANCE.x, 0, ENTRANCE.z],
            }}
            aria-label="Multi-room cultural museum with connected galleries"
          >
            <Suspense fallback={null}>
              <MuseumArchitecture />
              <WalkingControls
                mobileKeys={mobileKeys}
                reset={reset}
                onPose={reportPose}
              />
              {exhibits.map((exhibit) => (
                <ImageFrame key={exhibit.id} exhibit={exhibit} />
              ))}
              <SceneReady onReady={markReady} />
            </Suspense>
          </Canvas>
          {!ready && <LoadingStatus slow={slow} />}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-wrap items-start justify-between gap-3 bg-gradient-to-b from-[#18362e]/95 via-[#18362e]/65 to-transparent p-4 pb-10 text-white">
            <div className="max-w-xl">
              <p className="font-serif text-lg">{collection.title}</p>
              <Dialog.Description className="mt-1 text-xs leading-6 text-white/80">
                {mobile
                  ? "Drag to look · Use the arrows to walk"
                  : "Drag to look · W A S D / arrow keys to walk · Esc to leave"}{" "}
                · Walk near an artwork to reveal its story.
              </Dialog.Description>
              <p
                className="mt-1 text-[10px] uppercase tracking-[.16em] text-[#edc785]"
                aria-live="polite"
              >
                {museumZone(pose.x, pose.z)}
              </p>
            </div>
            <div className="pointer-events-auto flex flex-wrap gap-2 text-xs">
              <button
                className="border border-white/40 bg-[#18362e]/80 px-3 py-2"
                onClick={() => {
                  setReset((value) => value + 1);
                  setSelected(null);
                }}
              >
                Return to entrance
              </button>
              <button
                className="border border-white/40 bg-[#18362e]/80 px-3 py-2"
                onClick={onRead}
              >
                Read collection
              </button>
              <Dialog.Close className="bg-[#d2b88d] px-3 py-2 text-[#16251f]">
                Leave the room
              </Dialog.Close>
            </div>
          </div>
          {ready && (
            <>
              <FloorPlan pose={pose} />
              {mobile && (
                <MobileControls
                  onMove={(key, pressed) => {
                    mobileKeys.current[key] = pressed;
                  }}
                />
              )}
            </>
          )}
          {selected && (
            <article
              className="absolute left-4 top-44 z-30 max-h-[calc(100dvh-320px)] w-[min(350px,calc(100vw-32px))] overflow-y-auto border border-[#d0bea0] bg-[#faf7ef]/95 p-5 text-[#28483c] shadow-xl backdrop-blur-sm sm:left-6 sm:top-28 sm:max-h-[calc(100dvh-150px)]"
              aria-label="Selected exhibit details"
            >
              <p className="eyebrow text-[9px]">{selected.artist}</p>
              <h3 className="mt-3 font-serif text-2xl">{selected.title}</h3>
              <p className="mt-4 text-sm leading-7">
                <CulturalText>{selected.introduction}</CulturalText>
              </p>
              <p className="mt-4 text-[10px] uppercase tracking-wider text-[#7a806d]">
                Move away to continue exploring
              </p>
              <PhotoCredit src={selected.imageUrl} className="mt-4" />
            </article>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
