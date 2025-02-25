import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useAreaStore } from "@/state/areaStore";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export function Space() {
  const areas = useAreaStore((state) => state.areas);
  const center = useAreaStore((state) => state.center);

  const refLat = (center[1].lat + center[0].lat) / 2;
  const refLng = (center[1].lng + center[0].lng) / 2;
  const scale = 111000;

  function project(lat: number, lng: number) {
    const x = (lng - refLng) * scale;
    const y = (lat - refLat) * scale;
    return new THREE.Vector2(x, y);
  }

  const areaMap = () => {
    const result = [];
    areas.forEach((bld: any) => {
      if (!bld.geometry || bld.geometry.length < 3) return;
      const shapePoints = bld.geometry.map((pt: any) =>
        project(pt.lat, pt.lng)
      );
      if (!shapePoints[0].equals(shapePoints[shapePoints.length - 1])) {
        shapePoints.push(shapePoints[0]);
      }
      const shape = new THREE.Shape(shapePoints);
      let heightValue = parseFloat(bld.tags.height || "");
      if (isNaN(heightValue)) {
        heightValue = 10;
      }
      const extrudeSettings = {
        steps: 1,
        depth: heightValue,
        bevelEnabled: false,
      };
      result.push([shape, extrudeSettings]);
    });
    console.log(result);
    return result;
  };

  return (
    <Canvas camera={{ fov: 90, near: 0.1, far: 4000 }}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />

      {areaMap().map((item, index) => (
        <mesh key={index} rotation={[-Math.PI / 2, 0, 0]}>
          <extrudeGeometry args={[item[0], item[1]]} />
          <meshStandardMaterial color="gray" />
        </mesh>
      ))}
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <OrbitControls />
    </Canvas>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  );
}
