"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { Canvas3D } from "@/components/3d/Canvas3D";

function NoodleBowl({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(state => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y = state.clock.elapsedTime * 0.45;
    groupRef.current.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
    groupRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 1.6) * 0.08 - progress * 0.35;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.35, 0]} rotation={[-0.08, 0, 0]}>
        <cylinderGeometry args={[1.35, 1.55, 0.32, 42]} />
        <meshStandardMaterial
          color="#86dcff"
          metalness={0.35}
          roughness={0.35}
        />
      </mesh>

      <mesh position={[0, -0.1, 0]}>
        <torusGeometry args={[1.03, 0.12, 24, 64]} />
        <meshStandardMaterial
          color="#d8f4ff"
          metalness={0.18}
          roughness={0.25}
        />
      </mesh>

      {Array.from({ length: 8 }).map((_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        const radius = 0.55;
        return (
          <mesh
            key={`noodle-${index}`}
            position={[
              Math.cos(angle) * radius,
              0.12 + (index % 2) * 0.05,
              Math.sin(angle) * radius,
            ]}
            rotation={[0.8, angle, 0.22]}
          >
            <torusKnotGeometry args={[0.12, 0.045, 100, 14]} />
            <meshStandardMaterial
              color="#ffd86b"
              roughness={0.65}
              metalness={0.05}
            />
          </mesh>
        );
      })}

      <mesh position={[0, 0.23, 0.15]}>
        <sphereGeometry args={[0.12, 24, 24]} />
        <meshStandardMaterial
          color="#ff6a92"
          emissive="#a12245"
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh position={[0.33, 0.21, -0.21]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial
          color="#9bff4f"
          emissive="#4a9f17"
          emissiveIntensity={0.25}
        />
      </mesh>
    </group>
  );
}

function BurgerReveal({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const topBunRef = useRef<THREE.Mesh>(null);
  const lettuceRef = useRef<THREE.Mesh>(null);

  useFrame(state => {
    if (!groupRef.current || !topBunRef.current || !lettuceRef.current) return;

    const open = Math.min(1, Math.max(0, progress * 1.4));

    groupRef.current.rotation.y = -state.clock.elapsedTime * 0.38;
    groupRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 1.2) * 0.06;

    topBunRef.current.position.y = 0.62 + open * 0.78;
    topBunRef.current.rotation.z = open * 0.32;

    lettuceRef.current.position.y = 0.12 + open * 0.32;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.55, 0]}>
        <cylinderGeometry args={[1.15, 1.15, 0.36, 40]} />
        <meshStandardMaterial
          color="#4fc8ff"
          roughness={0.35}
          metalness={0.28}
        />
      </mesh>

      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.8, 0.86, 0.26, 40]} />
        <meshStandardMaterial color="#6b331d" roughness={0.8} />
      </mesh>

      <mesh ref={lettuceRef} position={[0, 0.12, 0]}>
        <torusGeometry args={[0.86, 0.1, 24, 70]} />
        <meshStandardMaterial color="#8ce84e" roughness={0.72} />
      </mesh>

      <mesh ref={topBunRef} position={[0, 0.62, 0]} scale={[1, 0.72, 1]}>
        <sphereGeometry args={[0.98, 40, 40]} />
        <meshStandardMaterial color="#f4a65d" roughness={0.58} />
      </mesh>

      {[
        [-0.28, 0.85, 0.12],
        [0.22, 0.91, -0.08],
        [0.08, 0.96, 0.28],
      ].map((p, idx) => (
        <mesh
          key={`seed-${idx}`}
          position={[p[0], p[1], p[2]] as [number, number, number]}
          scale={[0.9, 0.4, 0.7]}
        >
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#f7e3bf" />
        </mesh>
      ))}
    </group>
  );
}

export function DishScrollShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", v => {
    setProgress(v);
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [70, -50]);
  const noodlesX = useTransform(scrollYProgress, [0, 1], [-90, 90]);
  const burgerX = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const cardsOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.25, 0.9],
    [0.2, 1, 1],
  );

  return (
    <section
      ref={sectionRef}
      className="relative px-4 sm:px-6 lg:px-8 py-24 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-[12%] w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-[14%] w-80 h-80 rounded-full bg-sky-500/20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <motion.div style={{ y: titleY }} className="text-center mb-12">
          <p className="fancy-pill">Scroll-Activated 3D Dishes</p>
          <h2 className="hero-title text-4xl sm:text-5xl lg:text-6xl font-black text-slate-100 mt-5">
            Dish Theater On Scroll
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-slate-300 text-lg">
            Noodles drift with depth while the burger opens as you move down. It
            feels like a modern product launch section, but for food.
          </p>
        </motion.div>

        <motion.div
          style={{ opacity: cardsOpacity }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
        >
          <motion.article
            style={{ x: noodlesX }}
            className="card min-h-107.5 md:min-h-120 border border-white/50 bg-white/70 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="hero-title text-2xl font-bold text-slate-100">
                Floating Noodle Plate
              </h3>
              <span className="text-xs uppercase tracking-[0.16em] text-cyan-200">
                Depth Motion
              </span>
            </div>
            <div className="h-85 md:h-95 rounded-2xl border border-white/20 bg-black/20 overflow-hidden">
              <Canvas3D cameraPosition={[0, 0.4, 4.4]}>
                <NoodleBowl progress={progress} />
              </Canvas3D>
            </div>
          </motion.article>

          <motion.article
            style={{ x: burgerX }}
            className="card min-h-107.5 md:min-h-120 border border-white/50 bg-white/70 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="hero-title text-2xl font-bold text-slate-100">
                Opening Burger Stack
              </h3>
              <span className="text-xs uppercase tracking-[0.16em] text-cyan-200">
                Reveal On Scroll
              </span>
            </div>
            <div className="h-85 md:h-95 rounded-2xl border border-white/20 bg-black/20 overflow-hidden">
              <Canvas3D cameraPosition={[0, 0.35, 4.2]}>
                <BurgerReveal progress={progress} />
              </Canvas3D>
            </div>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}

