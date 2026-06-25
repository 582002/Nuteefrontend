import React, { useState, useRef, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useTexture, Html, Decal } from "@react-three/drei";
import * as THREE from "three";

// A simple loader to show while the 3D model is loading
const Loader = () => (
  <Html center>
    <div className="text-xl font-semibold">Loading 3D Model...</div>
  </Html>
);

// The 3D T-Shirt Model Component
const TShirtModel = ({ imageUrl, baseColor, logoScale, logoPosition, modelPosition, modelRotation }) => {
  const group = useRef(); // Ref for the whole T-shirt model
  const { nodes, materials } = useGLTF("/shirt_baked_2.glb"); 
  const texture = useTexture(imageUrl || "/neutee.png");

  useEffect(() => {
    // This effect only handles the base color of the shirt.
    const material = materials.lambert1; 
    if (material) {
      material.color.set(baseColor);
    }
  }, [materials, baseColor]);

  return (
    // Group to control the entire T-shirt model's position and rotation
    <group ref={group} 
           scale={4.5} 
           position={modelPosition} // Apply model position from state
           rotation={[0, modelRotation, 0]} // Apply model Y rotation from state
           dispose={null}>
      <mesh
        geometry={nodes.T_Shirt_male.geometry}
        material={materials.lambert1}
        material-roughness={1}
        // These position and rotation values are for the mesh within the group to orient it correctly
        position={[0.419, -0.2, 0]} 
        rotation={[Math.PI / 2, 0, 0]} 
      >
        {imageUrl && (
          <Decal
            // Position for the decal with adjustable X and Y
            position={[logoPosition.x, logoPosition.y, 0.045]} // Use logoPosition state
            rotation={[0, 0, 0]} // No rotation for the decal itself
            scale={logoScale * 0.4} // Adjusted scale multiplier for better fit
            map={texture}
          />
        )}
      </mesh>
    </group>
  );
};

// Preload the model for faster loading
useGLTF.preload("/shirt_baked_2.glb");

// UI Panel for all customization controls
const ControlsPanel = ({ state, setState }) => {
  const fileInputRef = useRef();

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Create an image to get dimensions for proper centering
    const img = new Image();
    img.onload = () => {
      const url = URL.createObjectURL(file);
      setState({ 
        ...state, 
        imageUrl: url,
        // Reset logo position to center when new image is uploaded
        logoPosition: { x: 0, y: 0 }
      });
    };
    img.src = URL.createObjectURL(file);
  };

  const handleReset = () => {
    setState({
      imageUrl: null,
      baseColor: "#ffffff",
      logoScale: 1, // Default scale for design
      logoPosition: { x: 0, y: 0 }, // Default logo position
      modelPosition: [0, -0.5, 0], // Default model position
      modelRotation: 0, // Default model rotation
      showSummary: false,
    });
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-80 h-full bg-white/80 backdrop-blur-md p-6 shadow-lg rounded-l-2xl overflow-y-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">👕 T-Shirt Customizer</h1>
      
      {/* File Upload */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">Upload Your Design</label>
        <button
          onClick={() => fileInputRef.current.click()}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-all"
        >
          Choose Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/svg+xml"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {/* Shirt Color */}
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">Shirt Color</label>
        <div className="relative">
          <input
            type="color"
            value={state.baseColor}
            onChange={(e) => setState({ ...state, baseColor: e.target.value })}
            className="w-full h-12 p-1 border-none rounded-md cursor-pointer appearance-none"
          />
        </div>
      </div>
      
      {/* Design Controls - Size and Position */}
      {state.imageUrl && (
        <div className="space-y-6 border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-700">Design Placement</h2>
          <div>
            <label className="block text-sm font-medium text-gray-600">Design Size</label>
            <input
              type="range" min="0.2" max="2.0" step="0.01"
              value={state.logoScale}
              onChange={(e) => setState({ ...state, logoScale: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          {/* Design Position Controls */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Design Horizontal Position</label>
            <input
              type="range" min="-0.2" max="0.2" step="0.01"
              value={state.logoPosition.x}
              onChange={(e) => setState({ 
                ...state, 
                logoPosition: { ...state.logoPosition, x: parseFloat(e.target.value) } 
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600">Design Vertical Position</label>
            <input
              type="range" min="-0.2" max="0.2" step="0.01"
              value={state.logoPosition.y}
              onChange={(e) => setState({ 
                ...state, 
                logoPosition: { ...state.logoPosition, y: parseFloat(e.target.value) } 
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* T-Shirt Model Positioning Controls */}
      <div className="space-y-6 border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-700">T-Shirt Model Position</h2>
          <div>
            <label className="block text-sm font-medium text-gray-600">Model X Position</label>
            <input
              type="range" min="-1.5" max="1.5" step="0.01"
              value={state.modelPosition[0]}
              onChange={(e) => setState({ ...state, modelPosition: [parseFloat(e.target.value), state.modelPosition[1], state.modelPosition[2]] })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Model Y Position</label>
            <input
              type="range" min="-1.5" max="1.5" step="0.01"
              value={state.modelPosition[1]}
              onChange={(e) => setState({ ...state, modelPosition: [state.modelPosition[0], parseFloat(e.target.value), state.modelPosition[2]] })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Model Z Position</label>
            <input
              type="range" min="-1.5" max="1.5" step="0.01"
              value={state.modelPosition[2]}
              onChange={(e) => setState({ ...state, modelPosition: [state.modelPosition[0], state.modelPosition[1], parseFloat(e.target.value)] })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Model Rotation (Y-axis)</label>
            <input
              type="range" min="-3.14" max="3.14" step="0.01" // -PI to PI radians
              value={state.modelRotation}
              onChange={(e) => setState({ ...state, modelRotation: parseFloat(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 mt-8 border-t pt-6">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600 transition-all"
        >
          Reset Customization
        </button>
        <button
          onClick={() => setState({ ...state, showSummary: true })}
          className="px-4 py-3 bg-green-600 text-white font-bold rounded-md shadow-lg hover:bg-green-700 transition-all"
        >
          ✅ Finalize Design
        </button>
      </div>
    </div>
  );
};

// Modal to show the final design summary
const OrderSummary = ({ state, setState }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Your Custom T-Shirt</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Base Color:</h3>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border" style={{ backgroundColor: state.baseColor }}></div>
            <span>{state.baseColor}</span>
          </div>
        </div>
        {state.imageUrl && (
          <div>
            <h3 className="font-semibold">Your Design:</h3>
            <img src={state.imageUrl} alt="Custom design" className="w-32 h-32 object-contain border rounded-md mt-2" />
          </div>
        )}
        {!state.imageUrl && <p>A plain {state.baseColor} shirt.</p>}
      </div>
      <div className="mt-8 flex justify-end gap-4">
        <button onClick={() => setState({ ...state, showSummary: false })} className="px-4 py-2 bg-gray-300 rounded-md">Edit Again</button>
        <button onClick={() => alert("Order Placed!")} className="px-4 py-2 bg-indigo-600 text-white rounded-md">Place Order</button>
      </div>
    </div>
  </div>
);


// Main Designer Component
const Designer = () => {
  const [customization, setCustomization] = useState({
    imageUrl: null,
    baseColor: "#ffffff",
    logoScale: 1, // Default scale for design decal
    logoPosition: { x: 0, y: 0 }, // Default logo position (centered)
    modelPosition: [0, -0.5, 0], // Default [x, y, z] position of the whole model group
    modelRotation: 0, // Default Y-axis rotation of the whole model group (in radians)
    showSummary: false,
  });

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-[#fdf6f3] to-[#f8efec]">
      <div className="w-full max-w-7xl h-[90vh] flex flex-row rounded-2xl shadow-2xl bg-white/50">
        
        <ControlsPanel state={customization} setState={setCustomization} />
        
        <div className="flex-1 h-full">
          <Canvas camera={{ position: [0, 0, 7], fov: 30 }}>
            <Suspense fallback={<Loader />}>
              <ambientLight intensity={1.5} />
              <directionalLight position={[10, 10, 5]} intensity={2.5} />
              <OrbitControls 
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={2}
                minPolarAngle={Math.PI / 2}
                maxPolarAngle={Math.PI / 2}
              />
              {/* Pass new model position/rotation state */}
              <TShirtModel {...customization} />
            </Suspense>
          </Canvas>
        </div>
      </div>
      
      {customization.showSummary && <OrderSummary state={customization} setState={setCustomization} />}
    </div>
  );
};

export default Designer;