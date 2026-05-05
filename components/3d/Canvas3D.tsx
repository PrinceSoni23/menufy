"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

interface Canvas3DProps {
  children: React.ReactNode;
  showStats?: boolean;
  cameraPosition?: [number, number, number];
}

export function Canvas3D({
  children,
  showStats = false,
  cameraPosition = [0, 0, 5],
}: Canvas3DProps) {
  return (
    <Canvas
      camera={{
        position: cameraPosition,
        fov: 75,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        {children}
      </Suspense>
    </Canvas>
  );
}

