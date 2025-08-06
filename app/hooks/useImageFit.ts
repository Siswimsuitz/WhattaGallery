'use client';

import { useState, useEffect } from 'react';

interface ImageDimensions {
  width: number;
  height: number;
}

interface FitDimensions {
  width: number;
  height: number;
  scale: number;
}

export function useImageFit(imageUrl: string, containerWidth: number, containerHeight: number): FitDimensions | null {
  const [imageDimensions, setImageDimensions] = useState<ImageDimensions | null>(null);
  const [fitDimensions, setFitDimensions] = useState<FitDimensions | null>(null);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      setImageDimensions({ width, height });
      
      // Calculate how to fit the image in the container
      const containerAspectRatio = containerWidth / containerHeight;
      const imageAspectRatio = width / height;
      
      let fitWidth: number;
      let fitHeight: number;
      let scale: number;
      
      if (imageAspectRatio > containerAspectRatio) {
        // Image is wider than container - fit to width
        fitWidth = containerWidth;
        fitHeight = containerWidth / imageAspectRatio;
        scale = containerWidth / width;
      } else {
        // Image is taller than container - fit to height
        fitHeight = containerHeight;
        fitWidth = containerHeight * imageAspectRatio;
        scale = containerHeight / height;
      }
      
      setFitDimensions({
        width: Math.round(fitWidth),
        height: Math.round(fitHeight),
        scale: Math.min(scale, 1) // Don't scale up, only down
      });
    };
    
    img.onerror = () => {
      console.error('Failed to load image for dimension calculation:', imageUrl);
    };
    
    img.src = imageUrl;
  }, [imageUrl, containerWidth, containerHeight]);

  return fitDimensions;
}