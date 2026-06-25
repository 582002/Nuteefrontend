import React, { useRef } from "react";
import htmlToImage from "html-to-image";

export default function ControlPanel({
  shirtColor,
  setShirtColor,
  partsColor,
  setPartsColor,
  setDecalImage,
  decalProps,
  setDecalProps,
  animate,
  setAnimate,
  reverse,
  setReverse,
  speed,
  setSpeed
}) {
  const handleUpload = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const url = URL.createObjectURL(e.target.files[0]);
    setDecalImage(url);
  };

  const updateDecal = (patch) => {
    setDecalProps((p) => ({ ...p, ...patch }));
  };

  const angleButtons = [
    { label: "0", angles: [0, 0, 0] },
    { label: "45", angles: [0, Math.PI / 4, 0] },
    { label: "120", angles: [0, (120 * Math.PI) / 180, 0] },
    { label: "180", angles: [0, Math.PI, 0] },
    { label: "240", angles: [0, (240 * Math.PI) / 180, 0] },
    { label: "315", angles: [0, (315 * Math.PI) / 180, 0] }
  ];

  const snapshot = async () => {
    // capture the canvas area (3D viewport)
    const node = document.querySelector(".r3f-canvas") || document.querySelector("canvas");
    if (!node) {
      alert("Canvas not found.");
      return;
    }
    try {
      const dataUrl = await htmlToImage.toPng(node, { cacheBust: true, width: node.width, height: node.height });
      const link = document.createElement("a");
      link.download = "tshirt-snapshot.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      alert("Snapshot failed: " + err.message);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">3D T-shirt mockup designer</h2>

      <div className="bg-gray-700 p-3 rounded">
        <label className="block text-sm">Shirt base color</label>
        <input type="color" value={shirtColor} onChange={(e) => setShirtColor(e.target.value)} className="mt-2" />
      </div>

      <div className="bg-gray-700 p-3 rounded">
        <label className="block text-sm">Collar color</label>
        <input type="color" value={partsColor.collar} onChange={(e) => setPartsColor({...partsColor, collar: e.target.value})} className="mt-2" />
        <label className="block text-sm mt-3">Sleeves color</label>
        <input type="color" value={partsColor.sleeves} onChange={(e) => setPartsColor({...partsColor, sleeves: e.target.value})} className="mt-2" />
      </div>

      <div className="bg-gray-700 p-3 rounded">
        <label className="block text-sm">Upload design image</label>
        <input type="file" accept="image/*" onChange={handleUpload} className="mt-2" />
      </div>

      <div className="bg-gray-700 p-3 rounded space-y-2">
        <label className="block text-sm font-medium">Design position & size</label>

        <div className="grid grid-cols-2 gap-2">
          <label className="text-xs">X</label>
          <input type="range" min="-0.8" max="0.8" step="0.01" value={decalProps.position[0]} onChange={(e) => updateDecal({ position: [parseFloat(e.target.value), decalProps.position[1], decalProps.position[2]] })} />
          <label className="text-xs">Y</label>
          <input type="range" min="-0.3" max="0.6" step="0.01" value={decalProps.position[1]} onChange={(e) => updateDecal({ position: [decalProps.position[0], parseFloat(e.target.value), decalProps.position[2]] })} />
          <label className="text-xs">Z</label>
          <input type="range" min="0.1" max="0.6" step="0.01" value={decalProps.position[2]} onChange={(e) => updateDecal({ position: [decalProps.position[0], decalProps.position[1], parseFloat(e.target.value)] })} />
          <label className="text-xs">Scale</label>
          <input type="range" min="0.05" max="1.5" step="0.01" value={decalProps.scale[0]} onChange={(e) => updateDecal({ scale: [parseFloat(e.target.value), parseFloat(e.target.value), parseFloat(e.target.value)] })} />
        </div>

        <label className="text-xs mt-2">Rotate Y</label>
        <input type="range" min="-3.14" max="3.14" step="0.01" value={decalProps.rotation[1]} onChange={(e) => updateDecal({ rotation: [decalProps.rotation[0], parseFloat(e.target.value), decalProps.rotation[2]] })} />
      </div>

      <div className="bg-gray-700 p-3 rounded">
        <label className="block text-sm font-medium">Static angles</label>
        <div className="flex gap-2 mt-2">
          {angleButtons.map((b) => (
            <button key={b.label} onClick={() => {
              // rotate the root group by setting a global CSS transform on canvas parent or better: send event — quick hack:
              const canvas = document.querySelector("canvas");
              if (canvas) {
                // we can't directly rotate scene from here; instead add an attribute for CSS rotation as a simple visual (This is a starter)
                canvas.style.transform = `rotateY(${b.angles[1]}rad)`;
                setTimeout(() => { canvas.style.transform = ""; }, 200);
              }
            }} className="px-3 py-1 border rounded bg-gray-600 hover:bg-gray-500">
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gray-700 p-3 rounded">
        <label className="block text-sm">Animation</label>
        <div className="flex items-center gap-2 mt-2">
          <input type="checkbox" checked={animate} onChange={(e) => setAnimate(e.target.checked)} />
          <span>Animate</span>
          <input type="checkbox" checked={reverse} onChange={(e) => setReverse(e.target.checked)} className="ml-3" />
          <span>Reverse</span>
        </div>
        <div className="mt-2">
          <label className="text-xs">Speed</label>
          <input type="range" min="0.1" max="3" step="0.1" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} />
        </div>
      </div>

      <div className="bg-gray-700 p-3 rounded space-y-2">
        <button onClick={snapshot} className="w-full py-2 bg-blue-600 rounded">Snapshot 3D scene</button>
      </div>
    </div>
  );
}
