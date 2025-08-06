'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase, Albumz, Photo } from '../utils/supabaseClient';
import ImageUploadForm from './ImageUploadForm';
import AlbumForm from './AlbumForm';
import ImageModal from './ImageModal';
import SafeImage from './components/SafeImage';

type ViewMode = 'gallery' | 'albums';

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albumz, setAlbumz] = useState<Albumz[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('gallery');
  const [selectedAlbumzId, setSelectedAlbumzId] = useState<number | null>(null);
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch photos
      const { data: photosData, error: photosError } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (photosError) throw photosError;

      // Fetch albumz
      const { data: albumzData, error: albumzError } = await supabase
        .from('albumz')
        .select('*')
        .order('created_at', { ascending: false });

      if (albumzError) throw albumzError;

      setPhotos(photosData || []);
      setAlbumz(albumzData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUploaded = () => {
    fetchData();
  };

  const handleAlbumCreated = () => {
    fetchData();
    setShowAlbumForm(false);
  };

  const handleAlbumzClick = (albumzId: number) => {
    setSelectedAlbumzId(albumzId);
    setViewMode('gallery');
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const getFilteredPhotos = () => {
    if (selectedAlbumzId) {
      const filtered = photos.filter(photo => photo.albumz_id === selectedAlbumzId);
      console.log('Filtered photos for albumz:', selectedAlbumzId, filtered);
      return filtered;
    }
    return photos;
  };

  const getCurrentAlbumz = () => {
    return albumz.find(album => album.id === selectedAlbumzId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-200 mb-2">Loading Gallery</h2>
          <p className="text-gray-400">Please wait while we fetch your photos...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                📸 WhattaGallery
              </h1>
              
              <div className="flex space-x-4">
                                 <button
                   onClick={() => {
                     setViewMode('gallery');
                     setSelectedAlbumzId(null);
                   }}
                   className={`nav-link ${viewMode === 'gallery' && !selectedAlbumzId ? 'nav-link-active' : ''}`}
                 >
                   📷 All Photos
                 </button>
                 <button
                   onClick={() => setViewMode('albums')}
                   className={`nav-link ${viewMode === 'albums' ? 'nav-link-active' : ''}`}
                 >
                   📁 Albumz
                 </button>
                 {selectedAlbumzId && (
                   <button
                     onClick={() => setSelectedAlbumzId(null)}
                     className="nav-link"
                   >
                     ← Back to All
                   </button>
                 )}
              </div>
            </div>

                         <div className="flex space-x-4">
               <button
                 onClick={() => setShowAlbumForm(true)}
                 className="btn-secondary"
               >
                 📁 New Albumz
               </button>
             </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
                 {/* Albumz Header */}
         {selectedAlbumzId && getCurrentAlbumz() && (
           <div className="text-center mb-8">
             <h2 className="text-4xl font-bold text-gray-200 mb-2">
               📁 {getCurrentAlbumz()?.name}
             </h2>
             {getCurrentAlbumz()?.description && (
               <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                 {getCurrentAlbumz()?.description}
               </p>
             )}
           </div>
         )}

                 {/* Upload Form */}
         {viewMode === 'gallery' && (
           <ImageUploadForm 
             onPhotoUploaded={handlePhotoUploaded} 
             selectedAlbumzId={selectedAlbumzId || undefined}
           />
         )}

                 {/* Content */}
         {viewMode === 'albums' ? (
           // Albumz View
           <div className="album-grid">
             {albumz.length === 0 ? (
               <div className="col-span-full text-center py-16">
                 <div className="max-w-md mx-auto">
                   <div className="text-6xl mb-4">📁</div>
                   <h3 className="text-2xl font-semibold text-gray-200 mb-2">
                     No albumz yet
                   </h3>
                   <p className="text-gray-400 mb-6">
                     Create your first albumz to organize your photos!
                   </p>
                   <button
                     onClick={() => setShowAlbumForm(true)}
                     className="btn"
                   >
                     📁 Create Albumz
                   </button>
                 </div>
               </div>
             ) : (
               albumz.map((album) => {
                 const albumPhotos = photos.filter(photo => photo.albumz_id === album.id);
                 const coverPhoto = albumPhotos[0];
                 console.log('Album:', album.name, 'Photos:', albumPhotos, 'Cover:', coverPhoto);
                
                return (
                                     <div 
                     key={album.id} 
                     className="album-card group"
                     onClick={() => handleAlbumzClick(album.id)}
                   >
                    <div className="relative h-48 overflow-hidden">
                      {coverPhoto ? (
                        <SafeImage
                          src={coverPhoto.image_url}
                          alt={album.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          fallback="📁"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <span className="text-4xl text-gray-500">📁</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-gray-200 group-hover:text-purple-400 transition-colors">
                        {album.name}
                      </h3>
                      {album.description && (
                        <p className="text-gray-400 mb-3 line-clamp-2">
                          {album.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 flex items-center">
                        <span className="mr-2">📷</span>
                        {albumPhotos.length} photo{albumPhotos.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
                     // Gallery View
           <div className="gallery-grid">
             {getFilteredPhotos().length === 0 ? (
               <div className="col-span-full text-center py-16">
                 <div className="max-w-md mx-auto">
                   <div className="text-6xl mb-4">📷</div>
                   <h3 className="text-2xl font-semibold text-gray-200 mb-2">
                     {selectedAlbumzId ? 'No photos in this albumz' : 'No photos yet'}
                   </h3>
                   <p className="text-gray-400">
                     {selectedAlbumzId 
                       ? 'Upload photos to this albumz to get started!' 
                       : 'Upload your first photo to get started! Your gallery will appear here once you add some images.'
                     }
                   </p>
                 </div>
               </div>
            ) : (
              getFilteredPhotos().map((photo) => (
                <div 
                  key={photo.id} 
                  className="photo-card group cursor-pointer"
                  onClick={() => handlePhotoClick(photo)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <SafeImage
                      src={photo.image_url}
                      alt={photo.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      fallback="📷"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-200 group-hover:text-purple-400 transition-colors">
                      {photo.title}
                    </h3>
                    {photo.description && (
                      <p className="text-gray-400 mb-3 line-clamp-2">
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
        )}
      </div>

      {/* Modals */}
      {showAlbumForm && (
        <AlbumForm 
          onAlbumCreated={handleAlbumCreated}
          onCancel={() => setShowAlbumForm(false)}
        />
      )}

      {selectedPhoto && (
        <ImageModal 
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </main>
  );
}