"use client";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

export function FilePreview({ src, alt = "Preview", className = "h-48" }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
      >
        <ImageIcon className="w-10 h-10 text-gray-400" />
      </div>
    );
  }

  return (
    <div
      className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
}
