import { useRef } from "react";
import { useThree } from "@react-three/fiber";
import {
  PerspectiveCamera,
  OrbitControls,
  Icosahedron,
  HemisphereLight,
} from "@react-three/drei";
import React, { useEffect, useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VideoTexture } from "three";

const CAMERA_Z_DISTANCE = 2;

export const IcosahedronComponent: React.FC<{
  aspectRatio: number;
  baseScale: number;
}> = ({ aspectRatio, baseScale }) => {
  const meshRef = useRef();
  const frame = useCurrentFrame();

  const rotation = (frame / 60) * Math.PI * 2 * 0.1; // Adjust rotation speed

  return (
    <>
      <PerspectiveCamera
        makeDefault // Sets this camera as the default
        position={[0, 0, 2]} // Sets the position of the camera
        fov={75} // Field of view
        aspect={window.innerWidth / window.innerHeight} // Aspect ratio
        near={0.1} // Near clipping plane
        far={10} // Far clipping plane
      />
      <OrbitControls
        enableDamping // Enables damping (inertia)
        dampingFactor={0.05} // Sets the damping factor
      />
      {/* Add objects in the scene here */}
      <Icosahedron
        ref={meshRef}
        args={[1, 2]}
        position={[0, 0, 0]}
        rotation={[0, rotation, 0]}
      >
        <meshStandardMaterial flatShading attach="material" color="orange" />
        <Icosahedron args={[1, 2]}>
          <meshBasicMaterial wireframe color="black" />
        </Icosahedron>
      </Icosahedron>

      <hemisphereLight
        skyColor={0x00ddff}
        groundColor={0xccff00}
        intensity={1}
        position={[0, 0, 0]}
      />
    </>
  );
};
