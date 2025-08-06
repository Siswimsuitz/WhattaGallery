'use client';

import Image from 'next/image';
import SafeImage from './components/SafeImage';
import FittedImage from './components/FittedImage';

interface ImageModalProps {
  photo: {
    id: number;
    title: string;
    description: string;
    image_url: string;
    created_at: string;
  } | null;
  onClose: () => void;
}

export default function ImageModal({ photo, onClose }: ImageModalProps) {
  if (!photo) return null;

  console.log('ImageModal rendering with photo:', {
    id: photo.id,
    title: photo.title,
    image_url: photo.image_url
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-[95vw] max-h-[95vh]" onClick={(e) => e.stopPropagation()}>
        <div className="relative flex flex-col h-full">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Debug Info */}
          <div className="absolute top-4 left-4 z-20 bg-red-500 text-white p-2 rounded text-xs">
            Modal Active - Photo ID: {photo.id}
          </div>

          {/* Image Container */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden bg-gray-900" style={{ minHeight: 0 }}>
            <div className="text-center text-white">
              <div className="text-2xl mb-4">🖼️ Image Modal</div>
              <div className="mb-2">Title: {photo.title}</div>
              <div className="mb-4">URL: {photo.image_url}</div>
              
              <img
                src={photo.image_url}
                alt={photo.title}
                className="max-w-full max-h-full object-contain border-2 border-red-500"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  console.error('Image failed to load:', photo.image_url);
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', photo.image_url);
                }}
              />
              
              <div className="mt-4 text-sm text-gray-400">
                If you see this text, the modal is working but the image might not be loading.
              </div>
            </div>
          </div>

          {/* Photo details */}
          <div className="p-6 bg-gray-800 border-t border-gray-700 flex-shrink-0">
            <h3 className="text-2xl font-bold text-gray-200 mb-2">{photo.title}</h3>
            {photo.description && (
              <p className="text-gray-400 mb-3">{photo.description}</p>
            )}
            <p className="text-sm text-gray-500 flex items-center">
              <span className="mr-2">📅</span>
              {new Date(photo.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}