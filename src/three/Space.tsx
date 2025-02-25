import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useAreaStore } from "@/state/areaStore";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

function Building({
  shape,
  extrudeSettings,
  tags,
}: {
  shape: THREE.Shape;
  extrudeSettings: any;
  tags: any;
}) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hoverPos, setHoverPos] = useState<THREE.Vector3 | null>(null);

  return (
    <mesh
      onPointerOver={(e) => {
        setHovered(true);
        e.stopPropagation();
      }}
      onPointerOut={(e) => {
        setHovered(false);
        e.stopPropagation();
      }}
      onPointerMove={(e) => {
        setHoverPos(e.point.clone());
        e.stopPropagation();
      }}
      onClick={(e) => {
        setClicked(!clicked);
        e.stopPropagation();
      }}
      rotation={[-Math.PI / 2, 0, 0]}
    >
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial
        color={hovered || clicked ? "#007bff" : "#9da0a3"}
      />
      {(hovered || clicked) && hoverPos && (
        <Html
          position={[
            hoverPos.x,
            hoverPos.y + extrudeSettings.depth + 0.5,
            hoverPos.z,
          ]}
          center
        >
          <div
            style={{
              color: "#000000",
              backgroundColor: "#ffffff96",
              backdropFilter: "blur(8px)",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              fontWeight: "300",
              fontSize: "12px",
              outline: "rgba(240, 240, 244, 0.51) solid 0.1rem",
            }}
          >
            <div>{JSON.stringify(tags)}</div>
          </div>
        </Html>
      )}
    </mesh>
  );
}

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

  const areaData = () => {
    const result: Array<{
      shape: THREE.Shape;
      extrudeSettings: any;
      tags: any;
    }> = [];
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
      const heightLevels = parseFloat(bld.tags["building:levels"] || "");
      if (isNaN(heightValue)) {
        heightValue = 10;
      }
      if (!isNaN(heightLevels)) {
        heightValue = heightLevels * 2.2;
      }
      const extrudeSettings = {
        steps: 1,
        depth: heightValue,
        bevelEnabled: false,
      };
      result.push({ shape, extrudeSettings, tags: bld.tags });
    });
    return result;
  };

  const buildingsData = areaData();

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
      {buildingsData.map((item, index) => (
        <Building
          key={index}
          shape={item.shape}
          extrudeSettings={item.extrudeSettings}
          tags={item.tags}
        />
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
