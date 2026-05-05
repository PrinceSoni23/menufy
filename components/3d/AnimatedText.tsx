"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface AnimatedTextProps {
  text: string;
  position?: [number, number, number];
  fontSize?: number;
  color?: string;
}

export function AnimatedText({
  text,
  position = [0, 0, 0],
  fontSize = 1,
  color = "#ffffff",
}: AnimatedTextProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.3;
      groupRef.current.position.y =
        Math.sin(_state.clock.elapsedTime * 1.5) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <Text
        fontSize={fontSize}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/fonts.woff"
      >
        {text}
        <meshPhongMaterial emissive={color} emissiveIntensity={0.5} />
      </Text>
    </group>
  );
}

