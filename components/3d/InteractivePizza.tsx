"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

const INGREDIENTS = [
  { name: "Fresh Mozzarella", icon: "🧀", color: "#FFD700" },
  { name: "Tomato Sauce", icon: "🍅", color: "#FF6B6B" },
  { name: "Basil", icon: "🌿", color: "#51CF66" },
  { name: "Olive Oil", icon: "🫒", color: "#F08C00" },
  { name: "San Marzano Tomato", icon: "🍞", color: "#DC2626" },
];

function PizzaScene({ onReady }: { onReady: () => void }) {
  const { scene: pizzaScene } = useGLTF("/pizza+3d+model.glb");
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);

  const normalizedScene = useMemo(() => {
    const cloned = pizzaScene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    cloned.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    cloned.scale.setScalar(2.6 / maxDim);

    return cloned;
  }, [pizzaScene]);

  useEffect(() => {
    onReady();
  }, [onReady]);

  useFrame(() => {
    if (groupRef.current && !isHovered) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      position={[0, -0.1, 0]}
      rotation={[0, Math.PI, 0]}
    >
      <primitive object={normalizedScene} />
    </group>
  );
}

function CanvasResizeHandler() {
  const { gl, camera } = useThree();

  useEffect(() => {
    // Force canvas to measure and set correct size on mount
    const handleResize = () => {
      const canvas = gl.domElement;
      const parent = canvas.parentElement;

      if (parent) {
        const width = parent.clientWidth;
        const height = parent.clientHeight;

        gl.setSize(width, height);

        if (camera instanceof THREE.PerspectiveCamera) {
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }
      }
    };

    // Call immediately on mount
    handleResize();

    // Also add resize listener
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [gl, camera]);

  return null;
}

export function InteractivePizza() {
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredIngredient, setHoveredIngredient] = useState<string | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger a small delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      if (containerRef.current) {
        // Force a layout recalculation
        window.dispatchEvent(new Event("resize"));
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const ingredientVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.5 + i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-transparent"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="w-12 h-12 border-3 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-cyan-300 text-sm font-semibold">
              Loading pizza...
            </p>
          </div>
        </div>
      )}

      {/* Animated Background Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-r from-orange-500/20 via-red-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse opacity-30" />
      </motion.div>

      <Canvas
        onCreated={({ camera, gl }) => {
          camera.position.set(0, 5, 5);
          camera.lookAt(0, 0, 0);

          // Force size calculation immediately
          const canvas = gl.domElement;
          const parent = canvas.parentElement;
          if (parent) {
            const width = parent.clientWidth;
            const height = parent.clientHeight;
            gl.setSize(width, height);
            if (camera instanceof THREE.PerspectiveCamera) {
              camera.aspect = width / height;
              camera.updateProjectionMatrix();
            }
          }

        }}
        className="w-full h-full absolute inset-0 z-10"
        gl={{
          antialias: true,
          alpha: true,
          stencil: false,
          depth: true,
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 5, 5]} fov={55} />

        <ambientLight intensity={1.2} />

        <directionalLight position={[8, 6, 8]} intensity={3} color="#FFA500" />

        <directionalLight
          position={[-8, 4, -8]}
          intensity={1.8}
          color="#00B4FF"
        />

        <directionalLight
          position={[0, 8, -10]}
          intensity={1.5}
          color="#FF6B9D"
        />

        <pointLight position={[5, 5, 5]} intensity={1.6} color="#FFD700" />
        <pointLight position={[-5, 5, 5]} intensity={1.2} color="#00F0FF" />
        <pointLight position={[0, -3, 8]} intensity={0.6} color="#FF4500" />

        <Suspense fallback={null}>
          <PizzaScene onReady={() => setIsLoading(false)} />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={3}
          rotateSpeed={1.2}
          minDistance={4}
          maxDistance={12}
          dampingFactor={0.05}
          target={new THREE.Vector3(0, 0, 0)}
        />

        <CanvasResizeHandler />
      </Canvas>

      {/* Ingredients Panel - Bottom Right */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute bottom-8 right-8 z-20 max-w-xs"
      >
        <div className="p-6">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm font-bold text-[#1a1a1a] mb-4 uppercase tracking-wider"
          >
            Fresh Ingredients
          </motion.h3>

          <div className="space-y-3">
            {INGREDIENTS.map((ingredient, index) => (
              <motion.div
                key={ingredient.name}
                custom={index}
                variants={ingredientVariants}
                initial="hidden"
                animate="visible"
                onMouseEnter={() => setHoveredIngredient(ingredient.name)}
                onMouseLeave={() => setHoveredIngredient(null)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <motion.div
                  animate={
                    hoveredIngredient === ingredient.name
                      ? { scale: 1.3, rotate: 10 }
                      : { scale: 1, rotate: 0 }
                  }
                  transition={{ duration: 0.3 }}
                  className="text-xl"
                >
                  {ingredient.icon}
                </motion.div>

                <motion.div
                  className="flex-1 overflow-hidden"
                  animate={
                    hoveredIngredient === ingredient.name ? { x: 5 } : { x: 0 }
                  }
                >
                  <p className="text-xs font-semibold text-[#555842] group-hover:text-orange-600 transition-colors duration-300">
                    {ingredient.name}
                  </p>
                  <div className="h-0.5 bg-linear-to-r from-orange-500/0 via-orange-500/40 to-orange-500/0 mt-1 w-full" />
                </motion.div>

                <motion.div
                  animate={
                    hoveredIngredient === ingredient.name
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.5 }
                  }
                  transition={{ duration: 0.3 }}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: ingredient.color }}
                />
              </motion.div>
            ))}
          </div>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="h-px bg-linear-to-r from-transparent via-orange-500/50 to-transparent mt-4"
          />
        </div>
      </motion.div>

      {/* Floating Ingredient Tags - Left Side */}
      <div className="absolute left-4 bottom-20 z-20 space-y-3 pointer-events-none">
        {["Handmade", "Organic", "100% Italian"].map((tag, index) => (
          <motion.div
            key={tag}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + index * 0.2, duration: 0.6 }}
            className="px-3 py-1 rounded-full text-xs font-bold text-[#555842] bg-[#555842]/10 border border-[#555842]/30 backdrop-blur-sm"
          >
            ✨ {tag}
          </motion.div>
        ))}
      </div>

      {/* Animated Shine Effect */}
      <motion.div
        className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-5 opacity-0"
        animate={{
          opacity: [0, 0.3, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay: 1,
        }}
      >
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent transform -skew-x-12" />
      </motion.div>
    </div>
  );
}

