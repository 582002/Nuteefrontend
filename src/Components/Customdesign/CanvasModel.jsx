import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
// Import Html from drei
import { OrbitControls, useGLTF, useTexture, Decal, Html } from '@react-three/drei';

// A simple loader component to show while the model is loading
// Wrap the <p> tag with the <Html> component
const CanvasModel = () => (
  <Html center>
    <p className="text-center font-semibold text-gray-600">Loading 3D Model...</p>
  </Html>
);
// src/components/CanvasModel.jsx

// ... (imports and Loader component are the same)

const Tshirt = ({ designImage, designProps }) => {
  // useGLTF reads the structure of your model file
  const { nodes, materials } = useGLTF('/tshirt_model.glb');

  // Find the correct names by inspecting your model
  const designTexture = useTexture(designImage ? designImage : 'data:image/png;base64,iVBORw0KGgoAAAANSUEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');

  // V-- UPDATE THESE LINES --V
  const targetMesh = nodes.shirt_mesh;       // Replace 'shirt_mesh' with your model's mesh name
  const targetMaterial = materials.fabric_material; // Replace 'fabric_material' with your model's material name
  // ^-- UPDATE THESE LINES --^

  return (
    <group>
      {/* Add a check to ensure the mesh and material exist before rendering */}
      {targetMesh && targetMaterial && (
        <mesh
          castShadow
          geometry={targetMesh.geometry}
          material={targetMaterial}
          material-roughness={1}
          dispose={null}
        >
          {designImage && (
            <Decal
              position={designProps.position}
              rotation={designProps.rotation}
              scale={designProps.scale}
              map={designTexture}
            />
          )}
        </mesh>
      )}
    </group>
  );
};
export default CanvasModel;