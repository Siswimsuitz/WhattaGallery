'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '../utils/supabaseClient';
import ImageUploadForm from './ImageUploadForm';

interface Photo {
  id: number;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
}

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUploaded = () => {
    fetchPhotos();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading gallery...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📸 WhattaGallery
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload, store, and showcase your beautiful photos with our modern gallery platform
          </p>
        </div>
        
        <ImageUploadForm onPhotoUploaded={handlePhotoUploaded} />
        
        <div className="gallery-grid">
          {photos.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">📷</div>
                <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                  No photos yet
                </h3>
                <p className="text-gray-600">
                  Upload your first photo to get started! Your gallery will appear here once you add some images.
                </p>
              </div>
            </div>
          ) : (
            photos.map((photo) => (
              <div key={photo.id} className="photo-card group">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={photo.image_url}
                    alt={photo.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
                    {photo.title}
                  </h3>
                  {photo.description && (
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {photo.description}
                    </p>
                  )}
                  <p className="text-sm text-gray-500 flex items-center">
                    <span className="mr-2">📅</span>
                    {new Date(photo.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}