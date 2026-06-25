// src/Components/Cus/Viewer.jsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import TShirtModel from "./TShirtModel";

export default function Viewer({ image }) {
  return (
    <div className="w-full h-[400px] bg-gray-50 rounded-xl">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <TShirtModel image={image} />
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}
