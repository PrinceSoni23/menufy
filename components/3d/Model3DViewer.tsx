"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Loader } from "@react-three/drei";
import * as THREE from "three";
import { useState, useEffect } from "react";

interface Model3DViewerProps {
  modelUrl: string;
  scale?: number;
  autoRotate?: boolean;
}

function ModelContent({ modelUrl, scale = 1 }: Model3DViewerProps) {
  const groupRef = useRef<THREE.Group>(null);

  const gltf = useGLTF(modelUrl);

  useEffect(() => {
    if (gltf.scene) {
      if (groupRef.current) {
        groupRef.current.scale.set(scale, scale, scale);
      }
    }
  }, [gltf, scale]);

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} />
    </group>
  );
}

export function Model3DViewer({
  modelUrl,
  scale = 1,
  autoRotate = true,
}: Model3DViewerProps) {
  return (
    <div className="w-full h-full bg-linear-to-b from-slate-900 to-slate-800 rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[-5, 5, 5]} intensity={0.8} />

        <ModelContent modelUrl={modelUrl} scale={scale} />

        <OrbitControls
          autoRotate={autoRotate}
          autoRotateSpeed={4}
          enableZoom={true}
          enablePan={true}
        />
      </Canvas>

      <Loader />
    </div>
  );
}
