import { useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject, ReactNode } from "react";
import { useNavigate } from "react-router";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles as DreiSparkles } from "@react-three/drei";
import * as THREE from "three";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { MotionValue } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  CloudSun,
  FileText,
  FlaskConical,
  Landmark,
  Menu,
  MessageCircle,
  ScanLine,
  ShieldAlert,
  ShoppingBag,
  ShoppingCart,
  Sparkles as SparklesIcon,
  Sprout,
  Tractor,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ActionLink, Heading, NavAnchor, RowButton, Text } from "@/components/ui/primitives";
import { useProfile, profileCompletion } from "@/src/lib/sagri";
import { useWeather, describeWeather, sprayAdvice } from "@/src/lib/weather";
import { useAuth } from "./src/app/AuthProvider";
import { LanguageSelector } from "./src/app/LanguageSelector";
import { BottomNav } from "./src/app/BottomNav";
import { useLanguage } from "./src/app/LanguageContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const FARM_STATE = import.meta.env.VITE_FARM_STATE || "Punjab";
const crops = ["Wheat", "Rice", "Tomato", "Onion", "Cotton"];

type MarketRow = {
  crop: string;
  price: number | null;
  change: number | null;
  trend: { value: number }[];
};

/* ------------------------------------------------------------------ */
/* 3D scene                                                            */
/* ------------------------------------------------------------------ */

const C = {
  topsoil: "hsl(24, 28%, 15%)",
  furrow: "hsl(26, 24%, 21%)",
  subsoil: "hsl(16, 40%, 32%)",
  rock: "hsl(30, 12%, 28%)",
  root: "hsl(38, 40%, 72%)",
  stone: "hsl(30, 10%, 50%)",
  sprout: "hsl(96, 36%, 44%)",
  straw: "hsl(41, 58%, 60%)",
  headYoung: "hsl(88, 32%, 50%)",
  headRipe: "hsl(38, 70%, 56%)",
  rain: "hsl(205, 40%, 80%)",
  water: "hsl(205, 45%, 40%)",
  cloud: "hsl(215, 10%, 32%)",
  sun: "hsl(40, 90%, 72%)",
  scan: "hsl(4, 72%, 64%)",
  light: "hsl(40, 45%, 92%)",
};

const SKY = [
  { at: 0, color: "hsl(222, 22%, 11%)" },
  { at: 0.25, color: "hsl(26, 16%, 7%)" },
  { at: 0.5, color: "hsl(210, 14%, 15%)" },
  { at: 0.75, color: "hsl(32, 18%, 12%)" },
  { at: 1, color: "hsl(20, 36%, 13%)" },
];

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

// One camera key per chapter; Catmull-Rom spacing maps them to p = 0, .25, .5, .75, 1.
const CAMERA_PATH: [THREE.Vector3, THREE.Vector3][] = [
  [V(5.6, 3.4, 8.6), V(0, 0.3, 0)],
  [V(0.6, -0.35, 7.4), V(0, -0.75, 2.9)],
  [V(4.4, 1.7, 5.6), V(0, 0.3, 0.4)],
  [V(1.7, 1.35, 5.3), V(0.15, 0.55, 2.55)],
  [V(-6.4, 6.6, 7.8), V(0, 0, 0)],
];

const FIELD = { cols: 26, rows: 16, sx: 0.3, sz: 0.34 };
const SOIL = { width: 8.2, depth: 5.9 };
const FRONT_Z = SOIL.depth / 2;
const SCAN_PLANT = { col: 13, row: 15, x: 0.15, z: 2.55 };

const rand = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const ease = (p: number, a: number, b: number) => THREE.MathUtils.smoothstep(p, a, b);
const band = (p: number, a: number, b: number, c: number, d: number) =>
  p <= a || p >= d ? 0 : p < b ? (p - a) / (b - a) : p <= c ? 1 : (d - p) / (d - c);

type Progress = MutableRefObject<number>;

function CameraRig({ progress, calm }: { progress: Progress; calm: boolean }) {
  const { camera, size } = useThree();
  const posCurve = useMemo(() => new THREE.CatmullRomCurve3(CAMERA_PATH.map((k) => k[0])), []);
  const lookCurve = useMemo(() => new THREE.CatmullRomCurve3(CAMERA_PATH.map((k) => k[1])), []);
  const target = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);
  const look = useRef(CAMERA_PATH[0][1].clone());

  // Shift the frame so the scene sits beside (desktop) or above (mobile) the text.
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    if (size.width >= 1024) {
      cam.setViewOffset(size.width, size.height, -size.width * 0.16, 0, size.width, size.height);
    } else {
      cam.setViewOffset(size.width, size.height, 0, size.height * 0.14, size.width, size.height);
    }
    cam.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  useFrame((state, delta) => {
    const p = THREE.MathUtils.clamp(progress.current, 0, 1);
    posCurve.getPoint(p, target);
    lookCurve.getPoint(p, lookTarget);
    if (!calm) {
      const t = state.clock.elapsedTime;
      target.x += Math.sin(t * 0.25) * 0.12;
      target.y += Math.sin(t * 0.31) * 0.05;
    }
    const k = 1 - Math.exp(-delta * 3.5);
    camera.position.lerp(target, k);
    look.current.lerp(lookTarget, k);
    camera.lookAt(look.current);
  });
  return null;
}

function SkyAndLight({ progress }: { progress: Progress }) {
  const { scene } = useThree();
  const stops = useMemo(() => SKY.map((s) => ({ at: s.at, c: new THREE.Color(s.color) })), []);
  const bg = useMemo(() => new THREE.Color(SKY[0].color), []);
  const fog = useMemo(() => new THREE.Fog(SKY[0].color, 11, 28), []);
  const sun = useRef<THREE.Mesh>(null);
  const sunLight = useRef<THREE.DirectionalLight>(null);
  const ambient = useRef<THREE.AmbientLight>(null);

  useEffect(() => {
    scene.background = bg;
    scene.fog = fog;
    return () => {
      scene.background = null;
      scene.fog = null;
    };
  }, [scene, bg, fog]);

  useFrame(() => {
    const p = progress.current;
    let i = 0;
    while (i < stops.length - 2 && p > stops[i + 1].at) i++;
    const a = stops[i];
    const b = stops[i + 1];
    bg.copy(a.c).lerp(b.c, THREE.MathUtils.clamp((p - a.at) / (b.at - a.at), 0, 1));
    fog.color.copy(bg);

    const angle = THREE.MathUtils.lerp(Math.PI * 0.85, Math.PI * 0.12, p);
    const x = Math.cos(angle) * 10;
    const y = 2 + Math.sin(angle) * 6;
    const rain = band(p, 0.38, 0.46, 0.58, 0.64);
    if (sun.current) {
      sun.current.position.set(x, y, -7);
      sun.current.scale.setScalar(1 - rain * 0.6);
    }
    if (sunLight.current) {
      sunLight.current.position.set(x * 0.6, Math.max(y, 2.5), 4);
      sunLight.current.intensity = 2.3 - rain * 1.5;
    }
    if (ambient.current) ambient.current.intensity = 0.5 + p * 0.25;
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={0.5} />
      <hemisphereLight args={[C.light, C.topsoil, 0.55]} />
      <directionalLight
        ref={sunLight}
        castShadow
        intensity={2.3}
        color={C.light}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <mesh ref={sun}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshBasicMaterial color={C.sun} fog={false} />
      </mesh>
    </>
  );
}

function SoilDiorama({ progress }: { progress: Progress }) {
  const roots = useRef<THREE.Group>(null);
  const water = useRef<THREE.Mesh>(null);
  const waterMat = useRef<THREE.MeshBasicMaterial>(null);

  const rootGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.012, 0.004, 1, 5);
    g.translate(0, -0.5, 0);
    return g;
  }, []);
  const waterGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(SOIL.width, 1);
    g.translate(0, -0.5, 0);
    return g;
  }, []);

  const rootData = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => ({
        x: -3.75 + i * 0.326 + (rand(i) - 0.5) * 0.08,
        len: 0.45 + rand(i + 40) * 0.75,
        tilt: (rand(i + 80) - 0.5) * 0.4,
        branch: 0.25 + rand(i + 120) * 0.3,
      })),
    [],
  );
  const stones = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        x: (rand(i + 200) - 0.5) * (SOIL.width - 0.4),
        y: -0.55 - rand(i + 260) * 1.25,
        s: 0.03 + rand(i + 320) * 0.05,
      })),
    [],
  );

  useFrame(() => {
    const p = progress.current;
    const g = Math.max(0.001, ease(p, 0.08, 0.42));
    roots.current?.children.forEach((child) => {
      child.scale.y = g;
    });
    const wet = band(p, 0.4, 0.5, 0.7, 0.82);
    if (water.current) water.current.scale.y = Math.max(0.001, ease(p, 0.42, 0.62) * 1.1);
    if (waterMat.current) waterMat.current.opacity = wet * 0.28;
  });

  const furrows = Array.from({ length: FIELD.rows }, (_, r) => (r - (FIELD.rows - 1) / 2) * FIELD.sz);

  return (
    <group>
      <mesh position={[0, -0.2, 0]} receiveShadow castShadow>
        <boxGeometry args={[SOIL.width, 0.4, SOIL.depth]} />
        <meshStandardMaterial color={C.topsoil} roughness={1} />
      </mesh>
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[SOIL.width, 0.8, SOIL.depth]} />
        <meshStandardMaterial color={C.subsoil} roughness={1} />
      </mesh>
      <mesh position={[0, -1.55, 0]}>
        <boxGeometry args={[SOIL.width, 0.7, SOIL.depth]} />
        <meshStandardMaterial color={C.rock} roughness={1} />
      </mesh>

      {furrows.map((z) => (
        <mesh key={z} position={[0, 0.015, z]} receiveShadow>
          <boxGeometry args={[SOIL.width - 0.3, 0.03, 0.12]} />
          <meshStandardMaterial color={C.furrow} roughness={1} />
        </mesh>
      ))}

      <group ref={roots}>
        {rootData.map((r, i) => (
          <group key={i} position={[r.x, 0, FRONT_Z + 0.012]} rotation={[0, 0, r.tilt]}>
            <mesh geometry={rootGeo} scale={[1, r.len, 1]}>
              <meshBasicMaterial color={C.root} />
            </mesh>
            <mesh
              geometry={rootGeo}
              position={[0, -r.len * 0.45, 0]}
              rotation={[0, 0, r.tilt > 0 ? -0.7 : 0.7]}
              scale={[0.7, r.branch, 1]}
            >
              <meshBasicMaterial color={C.root} />
            </mesh>
          </group>
        ))}
      </group>

      <mesh ref={water} geometry={waterGeo} position={[0, 0, FRONT_Z + 0.01]}>
        <meshBasicMaterial ref={waterMat} color={C.water} transparent opacity={0} depthWrite={false} />
      </mesh>

      {stones.map((s, i) => (
        <mesh key={i} position={[s.x, s.y, FRONT_Z + 0.02]}>
          <dodecahedronGeometry args={[s.s, 0]} />
          <meshStandardMaterial color={C.stone} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function WheatField({ progress }: { progress: Progress }) {
  const count = FIELD.cols * FIELD.rows;
  const stalks = useRef<THREE.InstancedMesh>(null);
  const heads = useRef<THREE.InstancedMesh>(null);
  const leaves = useRef<THREE.InstancedMesh>(null);

  const stalkGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.01, 0.018, 1, 5);
    g.translate(0, 0.5, 0);
    return g;
  }, []);
  const headGeo = useMemo(() => {
    const g = new THREE.CapsuleGeometry(0.03, 0.17, 4, 8);
    g.translate(0, 0.11, 0);
    return g;
  }, []);
  const leafGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(0.04, 0.42, 1, 3);
    g.translate(0, 0.21, 0);
    return g;
  }, []);
  const stalkMat = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.8 }), []);
  const leafMat = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.75, side: THREE.DoubleSide }), []);
  const headMat = useMemo(() => new THREE.MeshStandardMaterial({ roughness: 0.6 }), []);
  const palette = useMemo(
    () => ({
      sprout: new THREE.Color(C.sprout),
      straw: new THREE.Color(C.straw),
      headYoung: new THREE.Color(C.headYoung),
      headRipe: new THREE.Color(C.headRipe),
    }),
    [],
  );

  const plants = useMemo(() => {
    const list: { x: number; z: number; scale: number; phase: number }[] = [];
    for (let r = 0; r < FIELD.rows; r++) {
      for (let c = 0; c < FIELD.cols; c++) {
        const i = r * FIELD.cols + c;
        const isScan = r === SCAN_PLANT.row && c === SCAN_PLANT.col;
        list.push({
          x: (c - (FIELD.cols - 1) / 2) * FIELD.sx + (isScan ? 0 : (rand(i) - 0.5) * 0.08),
          z: (r - (FIELD.rows - 1) / 2) * FIELD.sz + (isScan ? 0 : (rand(i + 999) - 0.5) * 0.06),
          scale: 0.82 + rand(i + 555) * 0.32,
          phase: rand(i + 777) * Math.PI * 2,
        });
      }
    }
    return list;
  }, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const p = progress.current;
    const t = state.clock.elapsedTime;
    const growth = ease(p, 0.3, 0.84);
    const ripen = ease(p, 0.8, 0.97);
    const headGrow = ease(p, 0.52, 0.8);
    const gust = 1 + band(p, 0.38, 0.46, 0.58, 0.64) * 1.6;
    const baseHeight = 0.05 + growth * 0.9;

    plants.forEach((plant, i) => {
      const height = baseHeight * plant.scale;
      const sway =
        (Math.sin(t * 0.9 + plant.x * 0.7 + plant.z * 0.3) * 0.07 +
          Math.sin(t * 2.1 + plant.phase) * 0.02) *
        gust *
        (0.3 + growth);

      dummy.position.set(plant.x, 0.03, plant.z);
      dummy.rotation.set(0, 0, sway);
      dummy.scale.set(1, height, 1);
      dummy.updateMatrix();
      stalks.current?.setMatrixAt(i, dummy.matrix);

      const hs = Math.max(0.0001, headGrow * plant.scale);
      dummy.position.set(plant.x - Math.sin(sway) * height, 0.03 + Math.cos(sway) * height, plant.z);
      dummy.rotation.set(0, 0, sway * 1.4);
      dummy.scale.set(hs, hs, hs);
      dummy.updateMatrix();
      heads.current?.setMatrixAt(i, dummy.matrix);

      // Two leaf blades per plant, splayed outward and drooping as they grow.
      const leafScale = Math.max(0.0001, (0.35 + growth * 0.75) * plant.scale);
      for (let side = 0; side < 2; side++) {
        const dir = side === 0 ? 1 : -1;
        dummy.position.set(plant.x - Math.sin(sway) * height * 0.25, 0.03 + height * 0.18, plant.z);
        dummy.rotation.set(0, plant.phase + side * Math.PI, dir * (0.5 + growth * 0.35) + sway);
        dummy.scale.set(1, leafScale, 1);
        dummy.updateMatrix();
        leaves.current?.setMatrixAt(i * 2 + side, dummy.matrix);
      }
    });

    if (stalks.current) stalks.current.instanceMatrix.needsUpdate = true;
    if (heads.current) heads.current.instanceMatrix.needsUpdate = true;
    if (leaves.current) leaves.current.instanceMatrix.needsUpdate = true;
    stalkMat.color.copy(palette.sprout).lerp(palette.straw, ripen);
    headMat.color.copy(palette.headYoung).lerp(palette.headRipe, ripen);
    leafMat.color.copy(palette.sprout).lerp(palette.straw, ripen * 0.85);
  });

  return (
    <>
      <instancedMesh ref={stalks} args={[stalkGeo, stalkMat, count]} castShadow frustumCulled={false} />
      <instancedMesh ref={heads} args={[headGeo, headMat, count]} castShadow frustumCulled={false} />
      <instancedMesh ref={leaves} args={[leafGeo, leafMat, count * 2]} castShadow frustumCulled={false} />
    </>
  );
}

function LeafScan({ progress }: { progress: Progress }) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const beamMat = useRef<THREE.MeshBasicMaterial>(null);
  const beamGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.13, 0.13, 1, 32, 1, true);
    g.translate(0, 0.5, 0);
    return g;
  }, []);

  useFrame((state) => {
    const p = progress.current;
    const s = band(p, 0.65, 0.7, 0.8, 0.85);
    if (group.current) group.current.visible = s > 0.01;
    if (ringMat.current) ringMat.current.opacity = s * 0.9;
    if (beamMat.current) beamMat.current.opacity = s * 0.06;
    if (ring.current) {
      const top = (0.05 + ease(p, 0.3, 0.84) * 0.9) * 1.05;
      const wave = Math.sin(state.clock.elapsedTime * 1.8) * 0.5 + 0.5;
      ring.current.position.y = 0.08 + wave * top;
    }
  });

  return (
    <group ref={group} position={[SCAN_PLANT.x, 0.03, SCAN_PLANT.z]} visible={false}>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.13, 0.005, 8, 64]} />
        <meshBasicMaterial ref={ringMat} color={C.scan} transparent opacity={0} />
      </mesh>
      <mesh geometry={beamGeo}>
        <meshBasicMaterial
          ref={beamMat}
          color={C.scan}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Weather({ progress }: { progress: Progress }) {
  const count = 450;
  const rain = useRef<THREE.InstancedMesh>(null);
  const rainGeo = useMemo(() => new THREE.BoxGeometry(0.006, 0.22, 0.006), []);
  const rainMat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: C.rain, transparent: true, opacity: 0, depthWrite: false }),
    [],
  );
  const cloudMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: C.cloud,
        transparent: true,
        opacity: 0,
        roughness: 1,
        flatShading: true,
        depthWrite: false,
      }),
    [],
  );
  const drops = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: (rand(i + 1500) - 0.5) * 9,
        y: rand(i + 1700) * 4.5,
        z: (rand(i + 1900) - 0.5) * 6.4,
        speed: 6 + rand(i + 2100) * 3,
      })),
    [],
  );
  const clouds = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        x: (rand(i + 3000) - 0.5) * 8,
        y: 4.2 + rand(i + 3100) * 0.7,
        z: (rand(i + 3200) - 0.5) * 4,
        s: 0.8 + rand(i + 3300) * 0.8,
      })),
    [],
  );
  const cloudGroup = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    const intensity = band(progress.current, 0.36, 0.44, 0.58, 0.65);
    rainMat.opacity = intensity * 0.55;
    cloudMat.opacity = intensity * 0.85;
    if (cloudGroup.current) {
      cloudGroup.current.visible = intensity > 0.01;
      cloudGroup.current.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.6;
    }
    if (!rain.current) return;
    rain.current.visible = intensity > 0.01;
    if (!rain.current.visible) return;
    const step = Math.min(delta, 0.05);
    drops.forEach((d, i) => {
      d.y -= d.speed * step;
      if (d.y < 0) d.y += 4.5;
      dummy.position.set(d.x + d.y * 0.06, d.y, d.z);
      dummy.rotation.set(0, 0, 0.06);
      dummy.updateMatrix();
      rain.current?.setMatrixAt(i, dummy.matrix);
    });
    rain.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={rain} args={[rainGeo, rainMat, count]} frustumCulled={false} visible={false} />
      <group ref={cloudGroup} visible={false}>
        {clouds.map((c, i) => (
          <mesh key={i} position={[c.x, c.y, c.z]} scale={[1.7 * c.s, 0.45 * c.s, 1.1 * c.s]} material={cloudMat}>
            <icosahedronGeometry args={[1, 1]} />
          </mesh>
        ))}
      </group>
    </>
  );
}

function FieldScene({ progress, calm }: { progress: Progress; calm: boolean }) {
  return (
    <>
      <SkyAndLight progress={progress} />
      <CameraRig progress={progress} calm={calm} />
      <SoilDiorama progress={progress} />
      <WheatField progress={progress} />
      <LeafScan progress={progress} />
      <Weather progress={progress} />
      <DreiSparkles count={40} scale={[9, 3, 7]} position={[0, 1.4, 0]} size={2} speed={0.25} color={C.straw} opacity={0.45} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Scroll story                                                        */
/* ------------------------------------------------------------------ */

type Chapter = {
  key: string;
  label: string;
  title: string;
  body: string;
  action?: { label: string; href: string };
  input: number[];
  opacity: number[];
  y: number[];
};

const CHAPTERS: Chapter[] = [
  {
    key: "intro",
    label: "Begin",
    title: "Every field has a story.",
    body: "SAGRI helps you read your soil, plan your crop, catch disease early and sell at the right time.",
    input: [0, 0.07, 0.12],
    opacity: [1, 1, 0],
    y: [0, 0, -40],
  },
  {
    key: "soil",
    label: "Before sowing",
    title: "It starts underground.",
    body: "Know what your soil holds — nutrients, pH and moisture — before you decide what to sow.",
    action: { label: "Check soil health", href: "/soil-health" },
    input: [0.15, 0.2, 0.3, 0.35],
    opacity: [0, 1, 1, 0],
    y: [40, 0, 0, -40],
  },
  {
    key: "rain",
    label: "Monsoon",
    title: "Then the rain arrives.",
    body: "Plan sowing around the forecast, and pick a crop that suits your land and season.",
    action: { label: "Get a crop suggestion", href: "/crop-recommendation" },
    input: [0.4, 0.45, 0.55, 0.6],
    opacity: [0, 1, 1, 0],
    y: [40, 0, 0, -40],
  },
  {
    key: "grow",
    label: "Growing",
    title: "Keep a close eye on it.",
    body: "Photograph a leaf and find out what’s wrong while there’s still time to act.",
    action: { label: "Scan a leaf", href: "/disease-detection" },
    input: [0.65, 0.7, 0.8, 0.85],
    opacity: [0, 1, 1, 0],
    y: [40, 0, 0, -40],
  },
  {
    key: "harvest",
    label: "Harvest",
    title: "And bring it home.",
    body: "Follow mandi prices nearby so you know when it’s worth selling.",
    action: { label: "See price forecasts", href: "/price-forecasting" },
    input: [0.88, 0.93, 1],
    opacity: [0, 1, 1],
    y: [40, 0, 0],
  },
];

function StoryLayer({
  progress,
  chapter,
  children,
}: {
  progress: MotionValue<number>;
  chapter: Chapter;
  children: ReactNode;
}) {
  const opacity = useTransform(progress, chapter.input, chapter.opacity);
  const y = useTransform(progress, chapter.input, chapter.y);
  const pointerEvents = useTransform(opacity, (v): "auto" | "none" => (v > 0.6 ? "auto" : "none"));
  return (
    <motion.div
      style={{ opacity, y, pointerEvents }}
      className="absolute inset-0 flex items-end pb-32 lg:items-center lg:pb-0"
    >
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="max-w-lg">{children}</div>
      </div>
    </motion.div>
  );
}

function SeasonStory({ onNavigate }: { onNavigate: (href: string) => void }) {
  const ref = useRef<HTMLElement>(null);
  const calm = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const progress = useRef(0);
  const [active, setActive] = useState(0);

  useMotionValueEvent(smooth, "change", (v) => {
    progress.current = v;
    setActive(Math.round(THREE.MathUtils.clamp(v, 0, 1) * 4));
  });

  return (
    <section ref={ref} id="top" className="relative h-story">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{ position: [5.6, 3.4, 8.6], fov: 35, near: 0.1, far: 60 }}
          gl={{ antialias: true }}
        >
          <FieldScene progress={progress} calm={calm} />
        </Canvas>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent lg:bg-gradient-to-r lg:via-background/25" />

        {CHAPTERS.map((chapter, i) => (
          <StoryLayer key={chapter.key} progress={smooth} chapter={chapter}>
            {i === 0 ? (
              <>
                <Heading as="h1" family="serif" size="display">
                  {chapter.title}
                </Heading>
                <Text size="lg" tone="muted" className="mt-6 max-w-md">
                  {chapter.body}
                </Text>
                <div className="mt-12 flex items-center gap-4">
                  <motion.div
                    className="h-10 w-px origin-top bg-foreground/50"
                    animate={calm ? undefined : { scaleY: [0, 1, 1], opacity: [1, 1, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <Text size="sm" tone="muted">
                    Scroll through a season
                  </Text>
                </div>
              </>
            ) : (
              <>
                <Text size="sm" tone="accent">
                  {chapter.label}
                </Text>
                <Heading family="serif" size="title" className="mt-3">
                  {chapter.title}
                </Heading>
                <Text size="lg" tone="muted" className="mt-5">
                  {chapter.body}
                </Text>
                {chapter.action && (
                  <ActionLink className="mt-8" onClick={() => onNavigate(chapter.action!.href)}>
                    {chapter.action.label}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </ActionLink>
                )}
              </>
            )}
          </StoryLayer>
        ))}

        <div className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-5 rounded-2xl bg-background/60 px-5 py-5 backdrop-blur-md lg:flex">
          {CHAPTERS.map((chapter, i) => (
            <div key={chapter.key} className="flex items-center gap-3">
              <Text
                as="span"
                size="xs"
                tone={active === i ? "default" : "muted"}
                className={active === i ? "opacity-100 transition-opacity" : "opacity-50 transition-opacity"}
              >
                {chapter.label}
              </Text>
              <motion.span
                className="block h-px w-10 origin-right bg-foreground"
                animate={{ scaleX: active === i ? 1 : 0.35, opacity: active === i ? 1 : 0.4 }}
                transition={{ duration: 0.4 }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Tools                                                               */
/* ------------------------------------------------------------------ */

const TOOLS = [
  { title: "Plant Disease Vision", detail: "Photograph a leaf to get deep learning diagnosis and CIBRC cures.", href: "/disease-detection", icon: ScanLine },
  { title: "Crop Recommendation", detail: "Find what grows best on your land this season with Random Forest AI.", href: "/crop-recommendation", icon: Sprout },
  { title: "Mandi Price Forecaster", detail: "See 6-month projected mandi rates before you sell your harvest.", href: "/price-forecasting", icon: TrendingUp },
  { title: "Crop Risk Radar", detail: "Evaluate drought, thermal shock and crop failure risks with XGBoost.", href: "/risk-prediction", icon: ShieldAlert },
  { title: "Soil Health & NPK", detail: "Understand nutrient deficits and pH in your field.", href: "/soil-health", icon: FlaskConical },
  { title: "Live Weather & Rain Radar", detail: "Plan sowing, spraying and irrigation around 7-day hourly forecasts.", href: "/weather", icon: CloudSun },
  { title: "Mandi Market Rates", detail: "Compare live modal prices across regional yards and APMC centers.", href: "/market-price", icon: TrendingUp },
  { title: "AI Crop Calendar", detail: "Stage-by-stage sowing, irrigation and harvest scheduler.", href: "/crop-calendar", icon: Calendar },
  { title: "Government Schemes", detail: "PM-Kisan, PMFBY insurance and central subsidy checker.", href: "/schemes", icon: FileText },
  { title: "Krishi Sahayak AI Expert", detail: "Talk directly to our multilingual agronomist AI.", href: "/expert-connect", icon: MessageCircle },
  { title: "Farmer Community Forum", detail: "Connect with neighbouring farmers and share agronomic knowledge.", href: "/community", icon: Users },
  { title: "Audit & Prediction History", detail: "Audit log of all past scans, recommendations and soil tests.", href: "/history", icon: CheckCircle2 },
];

function ToolsSection({ onNavigate }: { onNavigate: (href: string) => void }) {
  return (
    <section id="tools" className="bg-paper">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-28 lg:grid-cols-12 lg:px-10 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-4"
        >
          <Text size="sm" tone="inkMuted">
            Tools
          </Text>
          <Heading family="serif" size="title" tone="ink" className="mt-4">
            One for each decision you make in a season.
          </Heading>
        </motion.div>

        <ul className="border-t border-line lg:col-span-8">
          {TOOLS.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.li
                key={tool.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="border-b border-line"
              >
                <RowButton onClick={() => onNavigate(tool.href)} className="relative overflow-hidden">
                  <span className="absolute inset-0 origin-left scale-x-0 bg-ink/5 transition-transform duration-500 group-hover:scale-x-100" />
                  <span className="relative grid grid-cols-12 items-center gap-4 py-8">
                    <Text as="span" size="xs" tone="inkMuted" mono className="col-span-1">
                      {String(i + 1).padStart(2, "0")}
                    </Text>
                    <span className="col-span-10 transition-transform duration-500 group-hover:translate-x-2 sm:col-span-5">
                      <Heading as="h3" family="serif" size="subtitle" tone="ink">
                        {tool.title}
                      </Heading>
                    </span>
                    <Text as="span" size="sm" tone="inkMuted" className="col-span-10 col-start-2 sm:col-span-5 sm:col-start-auto">
                      {tool.detail}
                    </Text>
                    <span className="col-span-1 col-start-12 row-start-1 flex justify-end text-ink sm:row-start-auto">
                      <Icon className="h-5 w-5 opacity-0 transition-all duration-300 group-hover:opacity-100 sm:hidden" />
                      <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </span>
                </RowButton>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Today                                                               */
/* ------------------------------------------------------------------ */

function formatINR(value: number | null) {
  if (value == null || !Number.isFinite(value)) return "—";
  return `₹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value)}`;
}

function useMarket() {
  const [market, setMarket] = useState<MarketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!FARM_STATE) {
        setMarket([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(false);
      try {
        const rows = await Promise.all(
          crops.map(async (crop) => {
            const response = await fetch(`${API_BASE}/api/historical_prices`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ crop_name: crop, state: FARM_STATE }),
            });
            if (!response.ok) throw new Error("Market request failed");
            const payload = await response.json();
            const list = Array.isArray(payload) ? payload : payload?.data ?? payload?.prices ?? [];
            const values = Array.isArray(list)
              ? list
                  .map((item: Record<string, unknown>) =>
                    Number(item?.modal_price ?? item?.modalPrice ?? item?.price ?? item?.value),
                  )
                  .filter(Number.isFinite)
              : [];
            const price = values.length ? values[values.length - 1] : null;
            const previous = values.length > 1 ? values[values.length - 2] : null;
            const change = previous && price != null ? ((price - previous) / previous) * 100 : null;
            return { crop, price, change, trend: values.slice(-7).map((value) => ({ value })) };
          }),
        );
        if (!cancelled) setMarket(rows);
      } catch {
        if (!cancelled) {
          setError(true);
          setMarket([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { market, loading, error };
}

function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function TodaySection({ onNavigate }: { onNavigate: (href: string) => void }) {
  const [profile] = useProfile();
  const weather = useWeather(profile.district);
  const condition = weather ? describeWeather(weather.current.code) : null;
  const spray = weather ? sprayAdvice(weather) : null;
  const { market, loading, error } = useMarket();
  const today = useMemo(
    () => new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" }).format(new Date()),
    [],
  );
  const hasPrices = market.some((row) => row.price != null);

  return (
    <section id="today" className="bg-background">
      <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
        <Reveal>
          <Text size="sm" tone="muted">
            {today}
          </Text>
          <Heading family="serif" size="title" className="mt-3">
            Today on your farm
          </Heading>
        </Reveal>

        <div className="mt-16 grid gap-16 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-border">
          <Reveal className="lg:pr-12">
            <CloudSun className="h-6 w-6 text-rain" strokeWidth={1.5} />
            <Heading as="h3" size="small" className="mt-6">
              {weather && condition ? `${Math.round(weather.current.temp)}°C · ${condition.label}` : "Weather"}
            </Heading>
            <Text size="sm" tone="muted" className="mt-3 max-w-xs">
              {weather
                ? `Humidity ${Math.round(weather.current.humidity)}% · Wind ${Math.round(weather.current.wind)} km/h. ${spray?.text || "Good conditions for fieldwork."}`
                : "Real-time forecast for your fields with daily spraying windows."}
            </Text>
            <ActionLink className="mt-6" onClick={() => onNavigate("/weather")}>
              View hourly forecast
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </ActionLink>
          </Reveal>

          <Reveal delay={0.1} className="lg:px-12">
            <TrendingUp className="h-6 w-6 text-wheat" strokeWidth={1.5} />
            <Heading as="h3" size="small" className="mt-6">
              Mandi prices
            </Heading>
            {loading ? (
              <div className="mt-5 space-y-4">
                {crops.slice(0, 3).map((crop) => (
                  <Skeleton key={crop} className="h-5 w-full" />
                ))}
              </div>
            ) : error ? (
              <Text size="sm" tone="muted" className="mt-3 max-w-xs">
                We couldn’t reach the price service. Try again in a little while.
              </Text>
            ) : !hasPrices ? (
              <Text size="sm" tone="muted" className="mt-3 max-w-xs">
                Prices from mandis in your state will appear here once your state is set.
              </Text>
            ) : (
              <ul className="mt-5 divide-y divide-border">
                {market.map((row) => (
                  <li key={row.crop} className="flex items-center gap-4 py-3">
                    <Text as="span" size="sm" className="w-20">
                      {row.crop}
                    </Text>
                    <span className="hidden h-6 flex-1 sm:block">
                      {row.trend.length > 1 && (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={row.trend}>
                            <Area
                              type="monotone"
                              dataKey="value"
                              stroke={C.straw}
                              fill={C.straw}
                              fillOpacity={0.12}
                              strokeWidth={1.5}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </span>
                    <Text as="span" size="sm" mono className="ml-auto">
                      {formatINR(row.price)}
                    </Text>
                    <Text
                      as="span"
                      size="xs"
                      mono
                      tone="inherit"
                      className={`w-14 text-right ${
                        row.change == null ? "text-muted-foreground" : row.change >= 0 ? "text-leaf" : "text-alert"
                      }`}
                    >
                      {row.change == null ? "—" : `${row.change >= 0 ? "+" : ""}${row.change.toFixed(1)}%`}
                    </Text>
                  </li>
                ))}
              </ul>
            )}
            <ActionLink className="mt-6" onClick={() => onNavigate("/market-price")}>
              All markets
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </ActionLink>
          </Reveal>

          <Reveal delay={0.2} className="lg:pl-12">
            <Sprout className="h-6 w-6 text-leaf" strokeWidth={1.5} />
            <Heading as="h3" size="small" className="mt-6">
              Your farm
            </Heading>
            <Text size="sm" tone="muted" className="mt-3 max-w-xs">
              {profile.name} · {profile.acres} Acres in {profile.village}.
            </Text>
            <div className="mt-6 max-w-xs">
              <Progress value={profileCompletion(profile).pct} />
              <Text size="xs" tone="muted" className="mt-2">
                Profile {profileCompletion(profile).pct}% complete
              </Text>
            </div>
            <ActionLink className="mt-6" onClick={() => onNavigate("/profile")}>
              Edit your profile
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </ActionLink>
          </Reveal>
        </div>

        {/* Marketplace & Services Section */}
        <div className="mt-20 border-t border-border pt-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-wheat" />
              <Heading as="h3" family="serif" size="subtitle">
                Marketplace & Direct Services
              </Heading>
            </div>
            <Text size="xs" tone="muted">
              Direct farmer-to-buyer transactions · Zero commission
            </Text>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button
              type="button"
              onClick={() => onNavigate("/sell-crops")}
              className="group relative overflow-hidden rounded-3xl border border-wheat/30 bg-card p-6 text-left transition-all hover:border-wheat hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wheat/15 border border-wheat/30 text-wheat mb-4 group-hover:scale-105 transition-transform">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <Heading as="h4" family="serif" size="small" className="text-foreground">
                Sell Produce
              </Heading>
              <p className="mt-1 text-xs text-muted-foreground">
                List harvest directly to millers & get MSP+ rates
              </p>
              <div className="mt-4 flex items-center text-xs font-semibold text-wheat">
                <span>Get Best Price</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("/buy-seeds")}
              className="group relative overflow-hidden rounded-3xl border border-leaf/30 bg-card p-6 text-left transition-all hover:border-leaf hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-leaf/15 border border-leaf/30 text-leaf mb-4 group-hover:scale-105 transition-transform">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <Heading as="h4" family="serif" size="small" className="text-foreground">
                Buy Seeds
              </Heading>
              <p className="mt-1 text-xs text-muted-foreground">
                Certified high-germination seed varieties with subsidy
              </p>
              <div className="mt-4 flex items-center text-xs font-semibold text-leaf">
                <span>Browse Seeds</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("/loans")}
              className="group relative overflow-hidden rounded-3xl border border-primary/30 bg-card p-6 text-left transition-all hover:border-primary hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 border border-primary/30 text-primary mb-4 group-hover:scale-105 transition-transform">
                <Landmark className="h-6 w-6" />
              </div>
              <Heading as="h4" family="serif" size="small" className="text-foreground">
                Check Loans
              </Heading>
              <p className="mt-1 text-xs text-muted-foreground">
                Calculate KCC limits & 4% subvented credit eligibility
              </p>
              <div className="mt-4 flex items-center text-xs font-semibold text-primary">
                <span>View Schemes</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("/rent-machinery")}
              className="group relative overflow-hidden rounded-3xl border border-alert/30 bg-card p-6 text-left transition-all hover:border-alert hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-alert/15 border border-alert/30 text-alert mb-4 group-hover:scale-105 transition-transform">
                <Tractor className="h-6 w-6" />
              </div>
              <Heading as="h4" family="serif" size="small" className="text-foreground">
                Rent Machinery
              </Heading>
              <p className="mt-1 text-xs text-muted-foreground">
                Book tractors, harvesters & spray drones near your village
              </p>
              <div className="mt-4 flex items-center text-xs font-semibold text-alert">
                <span>Book Equipment</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </div>
        </div>

        <div className="mt-24 flex flex-wrap gap-x-10 gap-y-4 border-t border-border pt-8">
          {[
            { label: "Government schemes", href: "/schemes" },
            { label: "Your history", href: "/history" },
            { label: "Talk to an expert", href: "/expert-connect" },
          ].map((link) => (
            <ActionLink key={link.href} tone="muted" onClick={() => onNavigate(link.href)}>
              {link.label}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </ActionLink>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const NAV = [
  { key: "nav.dashboard", label: "Dashboard", href: "/dashboard" },
  { key: "nav.tools", label: "Tools", href: "#tools" },
  { key: "nav.today", label: "Today", href: "#today" },
  { key: "nav.market", label: "Mandi Market Rates", href: "/market-price" },
  { key: "nav.schemes", label: "Government Schemes", href: "/schemes" },
];

export default function FarmerDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, openModal } = useAuth();
  const { t } = useLanguage();
  const nav = useNavigate();
  const navigate = (href: string) => {
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      nav(href);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-wheat/30">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/40 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-6 lg:px-10">
          <button
            type="button"
            onClick={() => navigate("#top")}
            className="font-serif text-2xl text-foreground hover:opacity-80 transition-opacity"
            aria-label="Sagri home"
            title="Sagri · Home & Season Story"
          >
            Sagri
          </button>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => navigate(item.href)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {t(item.key) || item.label}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <LanguageSelector />

            {user?.role === "admin" && (
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="hidden h-9 items-center rounded-full border border-primary/30 bg-primary/10 px-3 text-xs font-semibold text-primary transition-colors hover:bg-primary/20 md:inline-flex"
              >
                🛡️ Admin
              </button>
            )}

            {user ? (
              <button
                type="button"
                onClick={openModal}
                className="hidden h-9 items-center gap-2 rounded-full border border-wheat/30 bg-wheat/10 px-3 text-xs font-medium text-foreground transition-all hover:bg-wheat/20 md:inline-flex"
                title="Account & Rewards"
              >
                <span className="font-serif text-sm font-semibold text-wheat">{user.name.split(" ")[0]}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-wheat/20 px-2 py-0.5 text-[10px] font-bold text-wheat">
                  <SparklesIcon className="h-2.5 w-2.5" />
                  {user.points} pts
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={openModal}
                className="hidden h-9 items-center rounded-full bg-wheat px-3.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-wheat/90 md:inline-flex"
              >
                Login
              </button>
            )}

            <Button variant="outline" className="hidden rounded-full md:inline-flex text-xs h-9 px-3" onClick={() => navigate("/profile")}>
              Your profile
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {menuOpen && (
          <nav className="border-t border-border/40 bg-background md:hidden">
            <div className="flex flex-col gap-1 px-6 py-4">
              {[...NAV, { key: "nav.profile", label: "Your profile", href: "/profile" }].map((item) => (
                <button
                  key={item.href}
                  type="button"
                  className="py-3 text-left text-base text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(item.href);
                  }}
                >
                  {t(item.key) || item.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main>
        <SeasonStory onNavigate={navigate} />
        <ToolsSection onNavigate={navigate} />
        <TodaySection onNavigate={navigate} />
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <Text as="span" className="font-serif text-xl">
            Sagri
          </Text>
          <Text size="xs" tone="muted">
            Built with farmers, for every season. © {new Date().getFullYear()}
          </Text>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
}
