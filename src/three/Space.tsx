import React, { useEffect, useState } from "react";
import { Canvas, useThree, useLoader } from "@react-three/fiber";
import { useAreaStore } from "@/state/areaStore";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { css } from "@emotion/react";
import { useActionStore } from "@/state/exportStore";
import { GLTFExporter } from "three/examples/jsm/Addons.js";

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

function Roads({ area }: { area: any }) {
  const [roads, setRoads] = useState<any[]>([]);
  const center = useAreaStore((state) => state.center);
  const refLat = (center[1].lat + center[0].lat) / 2;
  const refLng = (center[1].lng + center[0].lng) / 2;
  const scale = 51000;
  function project(lat: number, lng: number) {
    const x = (lng - refLng) * scale;
    const y = (lat - refLat) * scale;
    return new THREE.Vector2(x, y);
  }
  useEffect(() => {
    const south = area[1].lat;
    const west = area[1].lng;
    const north = area[0].lat;
    const east = area[0].lng;
    const query = `[out:json][timeout:25];(way["highway"](${south},${west},${north},${east}););out body geom;`;
    fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
      .then((response) => response.json())
      .then((data) => {
        setRoads(data.elements);
      })
      .catch((err) => console.error(err));
  }, [area]);
  return (
    <>
      {roads.map((road, index) => {
        if (!road.geometry || road.geometry.length < 2) return null;
        const points = road.geometry.map((pt: any) => {
          const v = project(pt.lat, pt.lon);
          return new THREE.Vector3(v.x, 0.1, -v.y);
        });
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={index} geometry={lineGeometry}>
            <lineBasicMaterial
              attach="material"
              color="#34f516"
              linewidth={4}
            />
          </line>
        );
      })}
    </>
  );
}
export function Export() {
  const { scene } = useThree();
  const action = useActionStore((state) => state.action);
  const setAction = useActionStore((state) => state.setAction);
  useEffect(() => {
    if (action === true) {
      setAction(false);
      exportGLB();
    }
  }, [action, setAction, scene]);
  const exportGLB = () => {
    const sceneClone = scene.clone(true);
    sceneClone.traverse((child) => {
      if (child.userData && child.userData.skipExport === true) {
        child.parent?.remove(child);
      }
      if ((child as any).isHtml === true) {
        child.parent?.remove(child);
      }
    });
    const exporter = new GLTFExporter();
    const options = { binary: true, embedImages: true };
    exporter.parse(
      sceneClone,
      (result) => {
        if (result instanceof ArrayBuffer) {
          const blob = new Blob([result], { type: "model/gltf-binary" });
          const link = document.createElement("a");
          link.style.display = "none";
          document.body.appendChild(link);
          link.href = URL.createObjectURL(blob);
          link.download = "scene.glb";
          link.click();
          document.body.removeChild(link);
        } else {
          console.error("GLB export failed: unexpected result", result);
        }
      },
      (error) => {
        console.error("An error occurred during export", error);
      },
      options
    );
  };
  return null;
}

export function Space() {
  const areas = useAreaStore((state) => state.areas);
  const center = useAreaStore((state) => state.center);
  const refLat = (center[1].lat + center[0].lat) / 2;
  const refLng = (center[1].lng + center[0].lng) / 2;
  const scale = 51000;
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
    <Canvas camera={{ fov: 90, near: 0.1, far: 7000 }}>
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
      <Roads area={center} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <OrbitControls />
      <Export />
    </Canvas>
  );
}
