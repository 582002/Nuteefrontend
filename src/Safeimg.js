import React, { useState, useEffect } from 'react';

function SafeImg({ src, alt = "", className = "", style = {}, ...rest }) {
  /**
   * Helper to determine the correct source format.
   * If it's a binary string from Postgres, it won't start with 'http' or 'data:'.
   */
  const formatSource = (source) => {
    if (!source) return "";
    
    // Check if source is raw Base64 (missing the data:image prefix)
    // Most Base64 strings from Postgres/Spring start with '/' or 'iVBOR...'
    const isRawBase64 = 
      typeof source === 'string' && 
      !source.startsWith('http') && 
      !source.startsWith('data:');

    if (isRawBase64) {
      return `data:image/jpeg;base64,${source}`;
    }
    
    return source;
  };

  const [current, setCurrent] = useState(formatSource(src));
  const [triedFallback, setTriedFallback] = useState(false);

  // Sync state if the src prop changes
  useEffect(() => {
    setCurrent(formatSource(src));
    setTriedFallback(false);
  }, [src]);

  const cloudinaryFallback = (url) => {
    try {
      if (!url || typeof url !== 'string') return url;
      const idx = url.indexOf("/upload/");
      if (idx === -1) return url;
      
      // Don't apply if transformations already exist
      if (url.includes("/upload/f_") || url.includes("/upload/fl_")) {
        return url;
      }
      return url.replace("/upload/", "/upload/f_auto,q_auto/");
    } catch {
      return url;
    }
  };

  const handleError = (e) => {
    const original = src || "";
    
    // 1. Try Cloudinary fallback if applicable
    if (!triedFallback && typeof original === 'string' && original.includes("res.cloudinary.com")) {
      const fallback = cloudinaryFallback(original);
      if (fallback && fallback !== current) {
        setTriedFallback(true);
        setCurrent(fallback);
        return;
      }
    }

    // 2. If everything fails, use a clean SVG placeholder
    e.currentTarget.onerror = null; // Prevent infinite loops
    setCurrent("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23eeeae5'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%237b6a58' font-size='20'%3EImage not available%3C/text%3E%3C/svg%3E");
  };

  return (
    <img
      src={current || ""}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      {...rest}
    />
  );
}

export default SafeImg;