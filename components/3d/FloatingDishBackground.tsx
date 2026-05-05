"use client";

import { useMemo, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Canvas3D } from "@/components/3d/Canvas3D";

function FloatingPizza({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/pizza+3d+model.glb");

  const normalizedScene = useMemo(() => {
    const cloned = scene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    cloned.position.sub(center);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const targetSize = 2;
    const scale = targetSize / maxDim;
    cloned.scale.setScalar(scale);

    return cloned;
  }, [scene]);

  useFrame(() => {
    if (!groupRef.current) return;

    const p = progress;

    groupRef.current.position.x = 0;
    groupRef.current.position.y = 0.2 - p * 0.55;
    groupRef.current.position.z = -0.8 + p * 1.15;
    groupRef.current.rotation.y = -0.25 + p * 2.1;
    groupRef.current.rotation.x = 0.62 - p * 0.44;
    groupRef.current.rotation.z = -0.06 + p * 0.14;

    const scale = 3.25 + p * 1.45;
    groupRef.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={groupRef}>
      <primitive object={normalizedScene} rotation={[0, Math.PI, 0]} />
    </group>
  );
}

export function FloatingDishBackground() {
  const [progress, setProgress] = useState(0);
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", v => {
    setProgress(v);
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-80">
      <Canvas3D cameraPosition={[0, 0, 6.5]}>
        <pointLight position={[2, 3, 3]} intensity={1.2} color="#7fe6ff" />
        <pointLight position={[-3, -2, 2]} intensity={0.95} color="#66bbff" />
        <spotLight
          position={[0, 4.4, 3.2]}
          angle={0.48}
          penumbra={0.8}
          intensity={0.95}
          color="#b9edff"
        />
        <FloatingPizza progress={progress} />
      </Canvas3D>
    </div>
  );
}

useGLTF.preload("/pizza+3d+model.glb");

