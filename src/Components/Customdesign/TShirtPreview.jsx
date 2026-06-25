const TShirtPreview = ({ design }) => {
  return (
    <div className="relative w-72 h-96">
      {/* Base T-shirt image */}
      <img
        src="https://i.ibb.co/Vj1F7S9/plain-tshirt.png"
        alt="T-shirt"
        className="w-full h-full object-contain"
      />

      {/* Overlay design */}
      {design && (
        <img
          src={design}
          alt="Design"
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-32 h-32 object-contain"
        />
      )}
    </div>
  );
};

export default TShirtPreview;
