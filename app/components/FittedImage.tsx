'use client';

import { useState, useRef, useEffect } from 'react';
import { useImageFit } from '../hooks/useImageFit';

interface FittedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function FittedImage({ 
  src, 
  alt, 
  className = "", 
  fallback = "📷",
  onLoad,
  onError 
}: FittedImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const fitDimensions = useImageFit(src, containerDimensions.width, containerDimensions.height);

  // Debug logging
  useEffect(() => {
    if (fitDimensions) {
      console.log('Image fit calculation:', {
        original: { width: containerDimensions.width, height: containerDimensions.height },
        fitted: fitDimensions,
        scale: `${(fitDimensions.scale * 100).toFixed(1)}%`
      });
    }
  }, [fitDimensions, containerDimensions]);

  // Update container dimensions when ref is available
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setImageError(true);
    onError?.();
  };

  if (imageError) {
    return (
      <div className={`flex items-center justify-center bg-gray-700 text-4xl text-gray-500 ${className}`}>
        {fallback}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`flex items-center justify-center ${className}`}
    >
      {fitDimensions && (
        <img
          src={src}
          alt={alt}
          style={{
            width: `${fitDimensions.width}px`,
            height: `${fitDimensions.height}px`,
            objectFit: 'contain',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      )}
    </div>
  );
}