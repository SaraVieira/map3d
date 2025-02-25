import React, { useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useAreaStore } from "@/state/areaStore";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { NextButton } from "@/components/button/BottomButton";
import { ChevronRight } from "lucide-react";
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
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <OrbitControls />
      <Export />
    </Canvas>
  );
}

// function Floor() {
//   return (
//     <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
//       <planeGeometry args={[50, 50]} />
//       <meshStandardMaterial color="#ffffff" />
//     </mesh>
//   );
// }

export function Export() {
  const { scene } = useThree();

  const action = useActionStore((state) => state.action);
  const setAction = useActionStore((state) => state.setAction);

  useEffect(() => {
    if (action == true) {
      setAction(false);
      console.log(action);
      exportGLB();
    }
  }, [action]);

  const exportGLB = () => {
    const sceneClone = scene.clone(true);
    sceneClone.traverse((child) => {
      if (child.userData && child.userData.skipExport === true) {
        if (child.parent) child.parent.remove(child);
      }
    });

    const exporter = new GLTFExporter();
    const options = {
      binary: true,
      embedImages: true,
    };
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
      function () {
        console.log("An error happened");
      },
      options
    );
  };

  return <></>;
}
