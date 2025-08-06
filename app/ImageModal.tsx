'use client';

import Image from 'next/image';
import SafeImage from './components/SafeImage';

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

          {/* Image Container */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden" style={{ minHeight: 0 }}>
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={photo.image_url}
                alt={photo.title}
                className="max-w-full max-h-full object-contain"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'flex items-center justify-center bg-gray-700 text-4xl text-gray-500 w-full h-full';
                  fallback.textContent = '📷';
                  target.parentNode?.appendChild(fallback);
                }}
              />
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