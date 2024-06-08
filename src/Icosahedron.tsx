import { useThree } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls, Icosahedron } from '@react-three/drei';
import React, { useEffect, useMemo } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { VideoTexture } from "three";

const CAMERA_Z_DISTANCE = 2;

export const Icosahedron: React.FC<{
  aspectRatio: number;
  baseScale: number;
}> = ({ aspectRatio, baseScale }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // During the whole scene, the phone is rotating.
  // 2 * Math.PI is a full rotation.
  const constantRotation = interpolate(
    frame,
    [0, durationInFrames],
    [0, Math.PI * 6],
  );

  // When the composition starts, there is some extra
  // rotation and translation.
  const entranceAnimation = spring({
    frame,
    fps,
    config: {
      damping: 200,
      mass: 3,
    },
  });

  // Calculate the entrance rotation,
  // doing one full spin
  const entranceRotation = interpolate(
    entranceAnimation,
    [0, 1],
    [-Math.PI, Math.PI],
  );

  // Calculating the total rotation of the phone
  const rotateY = entranceRotation + constantRotation;

  // Calculating the translation of the phone at the beginning.
  // The start position of the phone is set to 4 "units"
  const translateY = interpolate(entranceAnimation, [0, 1], [-4, 0]);

  return (
    <group
      scale={entranceAnimation}
      rotation={[0, rotateY, 0]}
      position={[0, translateY, 0]}
    >
      <PerspectiveCamera
        makeDefault // sets this camera as the default
        position={[0, 0, 2]} // sets the position of the camera
        fov={75} // field of view
        aspect={window.innerWidth / window.innerHeight} // aspect ratio
        near={0.1} // near clipping plane
        far={10} // far clipping plane
      />
      <OrbitControls 
        enableDamping={true} // enables damping (inertia)
        dampingFactor={0.05} // sets the damping factor
      />
      {/* Add objects in the scene here */}
      <Icosahedron args={[1, 2]} position={[0, 0, 0]}>
        <meshStandardMaterial attach="material" color={0xccff} flatShading={true} />
      </Icosahedron>
      {/* <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={'orange'} />
      </mesh> */}
      
    </group>
  );
};
