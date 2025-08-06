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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          📸 Photo Gallery
        </h1>
        
        <ImageUploadForm onPhotoUploaded={handlePhotoUploaded} />
        
        <div className="gallery-grid">
          {photos.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">
                No photos yet. Upload your first photo to get started!
              </p>
            </div>
          ) : (
            photos.map((photo) => (
              <div key={photo.id} className="photo-card">
                <div className="relative h-64">
                  <Image
                    src={photo.image_url}
                    alt={photo.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2">{photo.title}</h3>
                  <p className="text-gray-600 mb-2">{photo.description}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(photo.created_at).toLocaleDateString()}
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