'use client';

import { useState } from 'react';
import Image from 'next/image';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
}

export default function SafeImage({ 
  src, 
  alt, 
  fill = false, 
  width, 
  height, 
  className = "", 
  fallback = "📷" 
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-700 ${className}`}>
        <span className="text-4xl text-gray-500">{fallback}</span>
      </div>
    );
  }

  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={width}
        height={height}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setLoading(false)}
        onError={() => setError(true)}
        unoptimized={true}
      />
      {loading && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-700 ${className}`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      )}
    </>
  );
}