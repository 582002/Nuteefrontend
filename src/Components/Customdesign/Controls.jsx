import { useRef } from 'react';

const Controls = ({ setDesignImage, designProps, setDesignProps }) => {
  const fileInputRef = useRef();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setDesignImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePropertyChange = (prop, value) => {
    setDesignProps((prev) => {
      // For position, we need to update a specific index in the array
      if (prop === 'positionX' || prop === 'positionY') {
        const newPosition = [...prev.position];
        const index = prop === 'positionX' ? 0 : 1;
        newPosition[index] = value;
        return { ...prev, position: newPosition };
      }
      // For scale and rotation
      return { ...prev, [prop]: value };
    });
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <h1 className="text-3xl font-bold text-center text-gray-800">Customize Your Tee</h1>
      
      <div>
        <label className="font-medium text-gray-700">Upload Your Design</label>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageUpload}
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="w-full mt-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
        >
          Choose Image
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2 text-gray-700">Adjust Design</h2>
        
        {/* Position X Slider */}
        <div className="flex flex-col">
          <label htmlFor="posX" className="text-sm font-medium text-gray-600">Horizontal Position (X)</label>
          <input
            id="posX"
            type="range"
            min="-0.2"
            max="0.2"
            step="0.01"
            value={designProps.position[0]}
            onChange={(e) => handlePropertyChange('positionX', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Position Y Slider */}
        <div className="flex flex-col">
          <label htmlFor="posY" className="text-sm font-medium text-gray-600">Vertical Position (Y)</label>
          <input
            id="posY"
            type="range"
            min="-0.1"
            max="0.25"
            step="0.01"
            value={designProps.position[1]}
            onChange={(e) => handlePropertyChange('positionY', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Scale Slider */}
        <div className="flex flex-col">
          <label htmlFor="scale" className="text-sm font-medium text-gray-600">Size</label>
          <input
            id="scale"
            type="range"
            min="0.05"
            max="0.3"
            step="0.01"
            value={designProps.scale}
            onChange={(e) => handlePropertyChange('scale', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default Controls;