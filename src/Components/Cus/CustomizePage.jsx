// src/Components/Cus/CustomizePage.jsx
import React, { useState, useRef, useCallback } from "react";
import { Rnd } from "react-rnd";
import Cropper from "react-easy-crop";
import { toPng } from "html-to-image";
import {
  FaImage, FaFont, FaPalette, FaTrash, FaUndo, FaRedo, FaCopy, FaArrowUp, FaArrowDown, FaCrop,
  FaSave, FaShoppingCart, FaEraser, FaInfoCircle, FaEye, FaDownload, FaTimes, FaMagic
} from "react-icons/fa";
import { MdFilterVintage, MdOutlineAutoFixHigh } from "react-icons/md";
import '@fontsource/inter';

/* ----------------- Helper: crop image ----------------- */
export const getCroppedImg = (imageSrc, pixelCrop) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(
        image,
        pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
        0, 0, pixelCrop.width, pixelCrop.height
      );

      resolve(canvas.toDataURL("image/png"));
    };

    image.onerror = (err) => reject(err);
  });
};

/* ----------------- Helper: autoRemoveBackground (simple) ----------------- */
function autoRemoveBackground(imgUrl, threshold = 30) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const r0 = data[0], g0 = data[1], b0 = data[2];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const diff = Math.sqrt((r - r0) ** 2 + (g - g0) ** 2 + (b - b0) ** 2);

        if (diff < threshold) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
  });
}

/* ----------------- Helper: removeBgViaAPI (remove.bg) ----------------- */
async function removeBgViaAPI(imageDataUrl) {
  const apiKey = process.env.REACT_APP_REMOVE_BG_KEY;
  if (!apiKey) throw new Error("REMOVE_BG API key not configured in REACT_APP_REMOVE_BG_KEY");

  const res = await fetch(imageDataUrl);
  const blob = await res.blob();

  const form = new FormData();
  form.append("image_file", blob);

  const r = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": apiKey },
    body: form,
  });

  if (!r.ok) {
    const text = await r.text();
    throw new Error("remove.bg failed: " + text);
  }

  const resultBlob = await r.blob();
  return URL.createObjectURL(resultBlob);
}

/* ------------------------- History Hook ------------------------- */
const useHistory = (initialState) => {
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setState = (action, overwrite = false) => {
    const newState = typeof action === "function" ? action(history[currentIndex]) : action;
    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[currentIndex] = newState;
      setHistory(historyCopy);
    } else {
      const updatedHistory = history.slice(0, currentIndex + 1);
      setHistory([...updatedHistory, newState]);
      setCurrentIndex(updatedHistory.length);
    }
  };

  const undo = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1);
  const redo = () => currentIndex < history.length - 1 && setCurrentIndex(currentIndex + 1);

  return [
    history[currentIndex],
    setState,
    undo,
    redo,
    currentIndex > 0,
    currentIndex < history.length - 1,
  ];
};

/* ------------------------- DesignItem ------------------------- */
const DesignItem = ({ design, onUpdate, isActive, onSelect }) => {
  const isText = design.type === "text";

  const handleStyle = {
    width: "12px",
    height: "12px",
    border: "2px solid #fff",
    borderRadius: "50%",
    background: "#4f46e5",
    boxShadow: "0 0 5px rgba(0,0,0,0.2)",
  };

  const imageFilterStyle = !isText
    ? {
        filter: `
      brightness(${design.brightness}%) 
      contrast(${design.contrast}%) 
      saturate(${design.saturate}%) 
      grayscale(${design.grayscale}%)
    `,
        opacity: design.opacity,
      }
    : {};

  return (
    <Rnd
      size={{ width: design.width, height: design.height }}
      position={{ x: design.x, y: design.y }}
      bounds="parent"
      onMouseDown={onSelect}
      onDragStop={(e, d) => onUpdate(design.id, { x: d.x, y: d.y })}
      onResizeStop={(e, direction, ref, delta, position) => {
        const w = parseFloat(ref.style.width);
        const h = parseFloat(ref.style.height);
        onUpdate(design.id, { width: w, height: h, ...position });
      }}
      style={{
        border: `2px solid ${isActive ? "#4f46e5" : "transparent"}`,
        transition: "border-color 0.2s",
        transform: `rotate(${design.rotate}deg)`,
        zIndex: design.zIndex,
      }}
      resizeHandleStyles={{
        bottomRight: handleStyle,
        bottomLeft: handleStyle,
        topLeft: handleStyle,
        topRight: handleStyle,
      }}
      minWidth={isText ? 50 : 20}
      minHeight={isText ? 20 : 20}
      disableDragging={!isActive}
      enableResizing={isActive}
    >
      {isText ? (
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) =>
            onUpdate(design.id, { text: e.currentTarget.innerText })
          }
          className="resize-none overflow-hidden w-full h-full"
          style={{
            fontFamily: design.fontFamily,
            fontSize: `${design.fontSize}px`,
            color: design.color,
            fontWeight: design.fontWeight,
            fontStyle: design.fontStyle,
            textAlign: design.textAlign,
            outline: "none",
            whiteSpace: "pre-wrap",
          }}
        >
          {design.text}
        </div>
      ) : (
        <img
          src={design.imageUrl}
          alt="Design"
          className="w-full h-full object-contain select-none pointer-events-none"
          style={imageFilterStyle}
        />
      )}
    </Rnd>
  );
};

/* ------------------------- ControlSection ------------------------- */
const ControlSection = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl shadow-sm border border-[#e3dbcf] p-5">
    <h3 className="font-bold text-lg mb-4 flex items-center gap-3 text-[#2f261b]">
      {icon} {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const ControlSlider = ({ label, value, onChange, min = 0, max = 100, step = 1 }) => (
  <div>
    <label className="block text-sm font-medium text-[#7b6a58] mb-2">
      {label}
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-[#e3dbcf] accent-indigo-600"
    />
  </div>
);

const ActionButton = ({ icon, label, onClick, className = "" }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg text-[#7b6a58] hover:bg-[#e3dbcf] hover:text-indigo-600 transition-all duration-200 ${className}`}
  >
    {icon}
    <span className="text-xs font-semibold">{label}</span>
  </button>
);

/* ------------------------- Main Component ------------------------- */
export default function CustomizePage() {
  const [designs, setDesigns, undo, redo, canUndo, canRedo] = useHistory([]);
  const [activeDesignId, setActiveDesignId] = useState(null);
  const [tshirtColor, setTshirtColor] = useState("#ffffff");
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("add");

  // crop modal state
  const [isCropModalOpen, setCropModalOpen] = useState(false);
  const [croppingDesign, setCroppingDesign] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // preview
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [finalDesignUrl, setFinalDesignUrl] = useState("");

  const canvasRef = useRef(null);
  const uploadInputRef = useRef(null);

  const activeDesign = designs.find((d) => d.id === activeDesignId);

  const updateDesign = (id, newProps) => {
    setDesigns(
      designs.map((d) => (d.id === id ? { ...d, ...newProps } : d)),
      true
    );
  };

  const handleSelect = (id) => {
    setActiveDesignId(id);
    if (activeTab !== "edit") setActiveTab("edit");
  };

  const handleDeselect = (e) => {
    if (e.target === e.currentTarget) setActiveDesignId(null);
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const newDesign = {
        id: Date.now(),
        type: "image",
        imageUrl: reader.result,
        x: 25,
        y: 50,
        width: 150,
        height: 150,
        rotate: 0,
        opacity: 1,
        zIndex: designs.length,
        brightness: 100,
        contrast: 100,
        saturate: 100,
        grayscale: 0,
      };
      setDesigns([...designs, newDesign]);
      handleSelect(newDesign.id);
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const addText = () => {
    const newText = {
      id: Date.now(),
      type: "text",
      text: "Your Text",
      x: 50,
      y: 50,
      width: 150,
      height: 40,
      rotate: 0,
      fontFamily: "Inter",
      fontSize: 24,
      fontWeight: "bold",
      fontStyle: "normal",
      textAlign: "center",
      color: "#000000",
      zIndex: designs.length,
    };
    setDesigns([...designs, newText]);
    handleSelect(newText.id);
  };

  const addClipart = (url) => {
    const newClipart = {
      id: Date.now(),
      type: "image",
      imageUrl: url,
      x: 25,
      y: 50,
      width: 150,
      height: 150,
      rotate: 0,
      opacity: 1,
      zIndex: designs.length,
      brightness: 100,
      contrast: 100,
      saturate: 100,
      grayscale: 0,
    };
    setDesigns([...designs, newClipart]);
    handleSelect(newClipart.id);
  };

  const deleteDesign = (id) => {
    setDesigns(designs.filter((d) => d.id !== id));
    setActiveDesignId(null);
  };

  const duplicateDesign = () => {
    if (!activeDesign) return;
    const newDesign = {
      ...activeDesign,
      id: Date.now(),
      x: activeDesign.x + 15,
      y: activeDesign.y + 15,
      zIndex: designs.length,
    };
    setDesigns([...designs, newDesign]);
    handleSelect(newDesign.id);
  };

  const moveLayer = (direction) => {
    const sorted = [...designs].sort((a, b) => a.zIndex - b.zIndex);
    const idx = sorted.findIndex((d) => d.id === activeDesignId);
    if (idx === -1) return;

    if (direction === "up" && idx < sorted.length - 1) {
      [sorted[idx].zIndex, sorted[idx + 1].zIndex] = [
        sorted[idx + 1].zIndex,
        sorted[idx].zIndex,
      ];
    } else if (direction === "down" && idx > 0) {
      [sorted[idx].zIndex, sorted[idx - 1].zIndex] = [
        sorted[idx - 1].zIndex,
        sorted[idx].zIndex,
      ];
    }
    setDesigns(sorted, true);
  };

  /* ------------------------- Crop Modal flow ------------------------- */
  const openCropModal = () => {
    if (activeDesign && activeDesign.type === "image") {
      setCroppingDesign(activeDesign);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setAspect(null);
      setCropModalOpen(true);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPx) => {
    setCroppedAreaPixels(croppedAreaPx);
  }, []);

  const applyCrop = async () => {
    if (!croppingDesign || !croppedAreaPixels) {
      setCropModalOpen(false);
      setCroppingDesign(null);
      return;
    }

    try {
      const croppedUrl = await getCroppedImg(
        croppingDesign.imageUrl,
        croppedAreaPixels
      );
      updateDesign(croppingDesign.id, { imageUrl: croppedUrl });
    } catch (e) {
      console.error("Crop failed:", e);
    } finally {
      setCropModalOpen(false);
      setCroppingDesign(null);
    }
  };

  /* ------------------------- Generate / Save / Preview ------------------------- */
  const generateDesignImage = useCallback(
    (callback) => {
      const node = canvasRef.current;
      if (!node) return;
      setActiveDesignId(null);
      setTimeout(() => {
        toPng(node, { cacheBust: true, pixelRatio: 2.5, quality: 1.0 })
          .then(callback)
          .catch((err) => console.error("Oops, something went wrong!", err));
      }, 150);
    },
    [canvasRef]
  );

  const saveDesign = useCallback(() => {
    generateDesignImage((dataUrl) => {
      const newCartItem = {
        id: Date.now(),
        image: dataUrl,
        color: tshirtColor,
        date: new Date().toLocaleString(),
      };
      setCart((prevCart) => [...prevCart, newCartItem]);
      alert(`Design saved! You have ${cart.length + 1} items in your cart.`);
    });
  }, [generateDesignImage, tshirtColor, cart]);

  const handlePreview = useCallback(() => {
    generateDesignImage((dataUrl) => {
      setFinalDesignUrl(dataUrl);
      setIsPreviewModalOpen(true);
    });
  }, [generateDesignImage]);

  const handleDownload = () => {
    if (!finalDesignUrl) return;
    const a = document.createElement("a");
    a.href = finalDesignUrl;
    a.download = "my-custom-tshirt.png";
    a.click();
  };

  const FONT_FAMILIES = [
    "Inter",
    "Arial",
    "Verdana",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Impact",
    "Comic Sans MS",
  ];

  const CLIPART_IMAGES = [
    "/clipart/star.svg",
    "/clipart/heart.svg",
    "/clipart/cool.svg",
    "/clipart/rocket.svg",
  ];

  /* ------------------------- Render ------------------------- */
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen bg-[#eeeae5] font-inter text-[#2f261b]">
      {/* Left: Canvas */}
      <div
        className="flex-1 flex items-center justify-center px-4 py-6 sm:px-6 lg:px-10 lg:py-10"
        id="canvas-area"
        onClick={handleDeselect}
      >
        <div className="w-full flex flex-col items-center gap-3">
          <p className="text-xs tracking-[0.2em] uppercase text-[#7b6a58]">
            Front View
          </p>
          <div className="relative w-full max-w-[360px] h-[420px] sm:max-w-[420px] sm:h-[500px] lg:w-[500px] lg:h-[600px] bg-white rounded-2xl shadow-xl border border-[#e3dbcf]">
            <div
              id="capture-area"
              ref={canvasRef}
              className="relative w-full h-full rounded-2xl overflow-hidden"
            >
              <img
                src="/tshirt.png"
                alt="T-shirt template"
                className="w-full h-full object-contain absolute top-0 left-0 pointer-events-none"
              />
              <div
                className="absolute w-full h-full top-0 left-0"
                style={{
                  backgroundColor: tshirtColor,
                  mixBlendMode: "multiply",
                }}
              ></div>

              <div
                id="print-area"
                className="absolute"
                style={{
                  top: "100px",
                  left: "150px",
                  width: "200px",
                  height: "300px",
                }}
              >
                {[...designs]
                  .sort((a, b) => a.zIndex - b.zIndex)
                  .map((design) => (
                    <DesignItem
                      key={design.id}
                      design={design}
                      isActive={design.id === activeDesignId}
                      onSelect={() => handleSelect(design.id)}
                      onUpdate={updateDesign}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="w-full lg:w-96 bg-[#f7f2eb] border-t lg:border-t-0 lg:border-l border-[#e3dbcf] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#e3dbcf] bg-white">
          <h1 className="text-2xl font-bold text-[#2f261b] tracking-tight">
            T-Shirt Customizer
          </h1>
          <p className="text-xs text-[#7b6a58] mt-1">
            Upload, add text, tweak colors & preview instantly.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="p-2.5 rounded-lg bg-[#f7f2eb] border border-[#e3dbcf] hover:bg-[#eeeae5] transition-colors duration-200 disabled:opacity-40"
              title="Undo"
            >
              <FaUndo />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="p-2.5 rounded-lg bg-[#f7f2eb] border border-[#e3dbcf] hover:bg-[#eeeae5] transition-colors duration-200 disabled:opacity-40"
              title="Redo"
            >
              <FaRedo />
            </button>
            <button
              onClick={() => setDesigns([])}
              className="p-2.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors duration-200 ml-auto"
              title="Clear Canvas"
            >
              <FaEraser />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-[#eeeae5] border-b border-[#e3dbcf] p-2 sticky top-0 z-10 lg:static">
          {["add", "edit", "t-shirt", "layers"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              disabled={tab === "edit" && !activeDesign}
              className={`flex-1 p-2.5 text-xs sm:text-sm font-semibold capitalize transition-all duration-300 rounded-lg disabled:text-[#c1b5a4] disabled:cursor-not-allowed ${
                activeTab === tab
                  ? "bg-white shadow-sm text-indigo-600 ring-1 ring-[#e3dbcf]"
                  : "text-[#7b6a58] hover:bg-[#e3dbcf]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Panel Content */}
        <div className="flex-1 p-5 overflow-y-auto space-y-6">
          {/* Add tab */}
          {activeTab === "add" && (
            <div className="space-y-6">
              <ControlSection
                title="Add Image"
                icon={<FaImage className="text-indigo-500" />}
              >
                <input
                  type="file"
                  ref={uploadInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleUpload}
                />
                <button
                  onClick={() => uploadInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-[#2f261b] text-white rounded-lg font-semibold shadow-sm hover:bg-black transition-colors duration-200 text-sm"
                >
                  Upload Image
                </button>
              </ControlSection>

              <ControlSection
                title="Add Text"
                icon={<FaFont className="text-green-500" />}
              >
                <button
                  onClick={addText}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-green-500 text-white rounded-lg font-semibold shadow-sm hover:bg-green-600 transition-colors duration-200 text-sm"
                >
                  Add Text Box
                </button>
              </ControlSection>

              <ControlSection
                title="Clipart"
                icon={<FaPalette className="text-yellow-500" />}
              >
                <div className="grid grid-cols-4 gap-3">
                  {CLIPART_IMAGES.map((clip) => (
                    <div
                      key={clip}
                      onClick={() => addClipart(clip)}
                      className="p-2 bg-[#f7f2eb] rounded-lg cursor-pointer hover:bg-[#eeeae5] transition-colors duration-200 aspect-square flex items-center justify-center border border-[#e3dbcf]"
                    >
                      <img
                        src={clip}
                        alt="clipart"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              </ControlSection>
            </div>
          )}

          {/* Edit tab */}
          {activeTab === "edit" && activeDesign && (
            <div className="space-y-6">
              {activeDesign.type === "text" && (
                <ControlSection title="Text Properties">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-[#7b6a58]">
                      Font Family
                    </label>
                    <select
                      value={activeDesign.fontFamily}
                      onChange={(e) =>
                        updateDesign(activeDesignId, {
                          fontFamily: e.target.value,
                        })
                      }
                      className="w-full p-2.5 border border-[#e3dbcf] rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    >
                      {FONT_FAMILIES.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1 text-[#7b6a58]">
                        Size
                      </label>
                      <input
                        type="number"
                        value={activeDesign.fontSize}
                        onChange={(e) =>
                          updateDesign(activeDesignId, {
                            fontSize: parseInt(e.target.value || "1", 10),
                          })
                        }
                        className="w-full p-2 border border-[#e3dbcf] rounded-lg text-sm"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1 text-[#7b6a58]">
                        Color
                      </label>
                      <input
                        type="color"
                        value={activeDesign.color}
                        onChange={(e) =>
                          updateDesign(activeDesignId, {
                            color: e.target.value,
                          })
                        }
                        className="w-full h-10 border border-[#e3dbcf] cursor-pointer rounded-lg overflow-hidden p-0"
                      />
                    </div>
                  </div>
                </ControlSection>
              )}

              {activeDesign.type === "image" && (
                <ControlSection
                  title="Image Filters"
                  icon={<MdFilterVintage className="text-[#7b6a58]" />}
                >
                  <ControlSlider
                    label={`Brightness: ${activeDesign.brightness}%`}
                    value={activeDesign.brightness}
                    onChange={(e) =>
                      updateDesign(activeDesignId, {
                        brightness: Number(e.target.value),
                      })
                    }
                    min="0"
                    max="200"
                    step="1"
                  />
                  <ControlSlider
                    label={`Contrast: ${activeDesign.contrast}%`}
                    value={activeDesign.contrast}
                    onChange={(e) =>
                      updateDesign(activeDesignId, {
                        contrast: Number(e.target.value),
                      })
                    }
                    min="0"
                    max="200"
                    step="1"
                  />
                  <ControlSlider
                    label={`Saturate: ${activeDesign.saturate}%`}
                    value={activeDesign.saturate}
                    onChange={(e) =>
                      updateDesign(activeDesignId, {
                        saturate: Number(e.target.value),
                      })
                    }
                    min="0"
                    max="200"
                    step="1"
                  />
                  <ControlSlider
                    label={`Grayscale: ${activeDesign.grayscale}%`}
                    value={activeDesign.grayscale}
                    onChange={(e) =>
                      updateDesign(activeDesignId, {
                        grayscale: Number(e.target.value),
                      })
                    }
                    min="0"
                    max="100"
                    step="1"
                  />
                </ControlSection>
              )}

              <ControlSection title="Transform & Actions">
                <ControlSlider
                  label={`Rotation: ${activeDesign.rotate}°`}
                  value={activeDesign.rotate}
                  onChange={(e) =>
                    updateDesign(activeDesignId, {
                      rotate: Number(e.target.value),
                    })
                  }
                  min="-180"
                  max="180"
                />
                {activeDesign.type === "image" && (
                  <ControlSlider
                    label={`Opacity: ${activeDesign.opacity}`}
                    value={activeDesign.opacity}
                    onChange={(e) =>
                      updateDesign(activeDesignId, {
                        opacity: parseFloat(e.target.value),
                      })
                    }
                    min="0.1"
                    max="1"
                    step="0.05"
                  />
                )}

                <div className="grid grid-cols-3 gap-2 pt-2">
                  {activeDesign.type === "image" && (
                    <>
                      <ActionButton
                        icon={<FaCrop size={18} />}
                        label="Crop"
                        onClick={openCropModal}
                      />
                      <ActionButton
                        icon={<MdOutlineAutoFixHigh size={18} />}
                        label="BG Auto"
                        onClick={async () =>
                          updateDesign(activeDesign.id, {
                            imageUrl: await autoRemoveBackground(
                              activeDesign.imageUrl,
                              35
                            ),
                          })
                        }
                      />
                      <ActionButton
                        icon={<FaMagic size={18} />}
                        label="BG AI"
                        onClick={async () =>
                          updateDesign(activeDesign.id, {
                            imageUrl: await removeBgViaAPI(
                              activeDesign.imageUrl
                            ),
                          })
                        }
                      />
                    </>
                  )}
                  <ActionButton
                    icon={<FaCopy size={18} />}
                    label="Duplicate"
                    onClick={duplicateDesign}
                  />
                  <ActionButton
                    icon={<FaTrash size={18} />}
                    label="Delete"
                    onClick={() => deleteDesign(activeDesign.id)} // ✅ FIXED: pass id
                    className="text-red-500 hover:bg-red-100 hover:text-red-600"
                  />
                </div>
              </ControlSection>
            </div>
          )}

          {activeTab === "edit" && !activeDesign && (
            <div className="text-center text-[#7b6a58] p-8 border-2 border-dashed border-[#e3dbcf] rounded-2xl flex flex-col items-center justify-center h-full bg-[#fdfbf7]">
              <FaInfoCircle className="text-4xl mb-3 text-[#c1b5a4]" />
              <p className="font-medium text-sm">
                Select an image or text on the T-shirt to edit.
              </p>
            </div>
          )}

          {/* T-shirt colors */}
          {activeTab === "t-shirt" && (
            <ControlSection title="T-Shirt Color">
              <div className="flex flex-wrap gap-4">
                {[
                  "#ffffff",
                  "#1f2937",
                  "#ef4444",
                  "#f97316",
                  "#eab308",
                  "#22c55e",
                  "#0ea5e9",
                  "#6366f1",
                  "#a855f7",
                ].map((color) => (
                  <div
                    key={color}
                    onClick={() => setTshirtColor(color)}
                    className={`w-9 h-9 rounded-full cursor-pointer transition-all duration-200 ring-offset-2 ring-offset-[#f7f2eb] ${
                      tshirtColor === color
                        ? "ring-4 ring-indigo-500 scale-110"
                        : "ring-2 ring-[#e3dbcf] hover:ring-indigo-300"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
                <input
                  type="color"
                  value={tshirtColor}
                  onChange={(e) => setTshirtColor(e.target.value)}
                  className="w-9 h-9 border-none cursor-pointer rounded-full overflow-hidden p-0"
                />
              </div>
            </ControlSection>
          )}

          {/* Layers */}
          {activeTab === "layers" && (
            <ControlSection title="Layer Order">
              <div className="space-y-3">
                {[...designs]
                  .sort((a, b) => b.zIndex - a.zIndex)
                  .map((d) => (
                    <div
                      key={d.id}
                      onClick={() => handleSelect(d.id)}
                      className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-all duration-200 ring-2 ${
                        d.id === activeDesignId
                          ? "bg-indigo-50 ring-indigo-500"
                          : "bg-[#f7f2eb] ring-transparent hover:ring-[#e3dbcf]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {d.type === "text" ? (
                          <FaFont className="text-[#7b6a58]" />
                        ) : (
                          <FaImage className="text-[#7b6a58]" />
                        )}
                        <span className="truncate text-sm font-medium">
                          {d.type === "text"
                            ? d.text.substring(0, 25) || "Text Layer"
                            : "Image Layer"}
                        </span>
                      </div>
                      {d.id === activeDesignId && (
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveLayer("up");
                            }}
                            className="p-2 rounded-full hover:bg-[#e3dbcf]"
                          >
                            <FaArrowUp size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveLayer("down");
                            }}
                            className="p-2 rounded-full hover:bg-[#e3dbcf]"
                          >
                            <FaArrowDown size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                {designs.length === 0 && (
                  <p className="text-[#7b6a58] text-sm p-4 text-center border-2 border-dashed border-[#e3dbcf] rounded-xl bg-[#fdfbf7]">
                    No layers yet. Add text or images to get started.
                  </p>
                )}
              </div>
            </ControlSection>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-auto p-5 border-t border-[#e3dbcf] bg-white space-y-3">
          <div className="flex gap-3">
            <button
              onClick={handlePreview}
              className="w-full flex items-center justify-center p-3 bg-[#f7f2eb] border border-[#e3dbcf] text-[#2f261b] rounded-lg font-bold hover:bg-[#eeeae5] transition-all duration-300 text-sm"
            >
              <FaEye className="mr-2" /> Preview
            </button>
            <button
              onClick={saveDesign}
              className="w-full flex items-center justify-center p-3 bg-indigo-600 text-white rounded-lg font-bold shadow-sm hover:bg-indigo-700 transition-all duration-300 text-sm"
            >
              <FaSave className="mr-2" /> Add to Cart
            </button>
          </div>
          {cart.length > 0 && (
            <p className="text-center text-xs text-indigo-600 font-semibold">
              {cart.length} item(s) in cart{" "}
              <FaShoppingCart className="inline ml-1" />
            </p>
          )}
        </div>
      </div>

      {/* Crop Modal */}
      {isCropModalOpen && croppingDesign && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-2xl flex flex-col">
            <h2 className="text-lg font-semibold mb-4 text-[#2f261b]">
              Crop Image
            </h2>

            <div className="relative w-full h-[400px] bg-black rounded-lg overflow-hidden">
              <Cropper
                image={croppingDesign.imageUrl}
                crop={crop}
                zoom={zoom}
                aspect={aspect || undefined}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="flex gap-2 mt-4 text-xs sm:text-sm">
              <button
                onClick={() => setAspect(null)}
                className="px-3 py-1 bg-[#f7f2eb] rounded border border-[#e3dbcf]"
              >
                Free
              </button>
              <button
                onClick={() => setAspect(1 / 1)}
                className="px-3 py-1 bg-[#f7f2eb] rounded border border-[#e3dbcf]"
              >
                1:1
              </button>
              <button
                onClick={() => setAspect(16 / 9)}
                className="px-3 py-1 bg-[#f7f2eb] rounded border border-[#e3dbcf]"
              >
                16:9
              </button>
              <button
                onClick={() => setAspect(4 / 3)}
                className="px-3 py-1 bg-[#f7f2eb] rounded border border-[#e3dbcf]"
              >
                4:3
              </button>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setCropModalOpen(false)}
                className="px-4 py-2 bg-[#f7f2eb] rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                onClick={applyCrop}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
              >
                Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl flex flex-col p-6 shadow-2xl relative max-h-[90vh]">
            <button
              onClick={() => setIsPreviewModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#f7f2eb] hover:bg-[#eeeae5] z-10"
            >
              <FaTimes />
            </button>
            <h3 className="text-2xl font-bold mb-4 text-[#2f261b]">
              Final Design Preview
            </h3>

            <div className="flex-grow overflow-y-auto bg-[#f7f2eb] rounded-lg p-4 border border-[#e3dbcf] min-h-0 flex items-center justify-center">
              {finalDesignUrl ? (
                <img
                  src={finalDesignUrl}
                  alt="Final T-shirt Design"
                  className="max-w-full max-h-[80vh] rounded-lg shadow"
                />
              ) : (
                <p className="text-[#7b6a58] text-sm">
                  Generating preview...
                </p>
              )}
            </div>

            <div className="flex-shrink-0 flex justify-end gap-3 mt-6">
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold shadow-md hover:bg-green-600 transition-colors duration-200 flex items-center gap-2 text-sm"
              >
                <FaDownload /> Download
              </button>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition-colors duration-200 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
