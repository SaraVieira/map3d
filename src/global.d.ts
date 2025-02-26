import * as THREE from "three";
import { Object3DNode } from "@react-three/fiber";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "three-line": Object3DNode<THREE.Line, typeof THREE.Line>;
    }
  }
}
