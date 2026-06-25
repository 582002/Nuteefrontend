// import React, { useRef } from "react";
// import { useFrame, useLoader } from "@react-three/fiber";
// import { TextureLoader, SRGBColorSpace, MeshStandardMaterial } from "three";
// import { useGLTF } from "@react-three/drei";

// export default function TShirtModel({
//   image,                  // URL of uploaded design texture
//   modelPath = "/tshirt.glb", // Path to your GLTF/GLB T-shirt model
//   colors = { inner: "#ffffff" }, // Fallback shirt color
//   rotationSpeed = 0.002    // Optional rotation speed
// }) {
//   const meshRef = useRef();

//   // ✅ Always call hooks unconditionally
//   const { scene } = useGLTF(modelPath);

//   // ✅ Load texture only if provided, else fallback to a white texture
//   const texture = image ? useLoader(TextureLoader, image) : null;
//   if (texture) texture.colorSpace = SRGBColorSpace;

//   // Rotate model slowly for preview
//   useFrame(() => {
//     if (meshRef.current) {
//       meshRef.current.rotation.y += rotationSpeed;
//     }
//   });

//   // Traverse to apply material and texture to meshes in the model
//   scene.traverse((child) => {
//     if (child.isMesh) {
//       child.material = new MeshStandardMaterial({
//         map: texture || null,
//         color: colors.inner || "#ffffff",
//         roughness: 1,
//         metalness: 0
//       });
//     }
//   });

//   return (
//     <primitive
//       ref={meshRef}
//       object={scene}
//       position={[0, -1.2, 0]}   // Adjust Y to center in your scene
//       scale={[1.5, 1.5, 1.5]}  // Scale for visibility
//     />
//   );
// }
