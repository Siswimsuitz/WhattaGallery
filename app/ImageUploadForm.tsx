'use client';

import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

interface ImageUploadFormProps {
  onPhotoUploaded: () => void;
  selectedAlbumzId?: number;
}

export default function ImageUploadForm({ onPhotoUploaded, selectedAlbumzId }: ImageUploadFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    
    if (url && isValidImageUrl(url)) {
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const isValidImageUrl = (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext)) || 
           url.includes('data:image/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (uploadMethod === 'file' && !file) {
      alert('Please select a file');
      return;
    }

    if (uploadMethod === 'url' && !imageUrl.trim()) {
      alert('Please enter an image URL');
      return;
    }

    setUploading(true);

    try {
      let finalImageUrl = '';

      if (uploadMethod === 'file' && file) {
        // Upload file to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `photos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('photos')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('photos')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      } else if (uploadMethod === 'url') {
        finalImageUrl = imageUrl.trim();
      }

      // Save photo metadata to database
      const { error: insertError } = await supabase
        .from('photos')
        .insert({
          title: title.trim(),
          description: description.trim(),
          image_url: finalImageUrl,
          albumz_id: selectedAlbumzId || null,
        });

      if (insertError) {
        console.error('Database error:', insertError);
        throw new Error(`Database error: ${insertError.message}`);
      }

      // Reset form
      setTitle('');
      setDescription('');
      setFile(null);
      setImageUrl('');
      setPreview(null);
      
      // Notify parent component
      onPhotoUploaded();
      
      alert('Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert(`Error uploading photo: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-200 mb-2">📤 Upload New Photo</h2>
        <p className="text-gray-400">Share your beautiful moments with the world</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="label">
            Photo Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a descriptive title for your photo"
            className="input-field"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Tell us about this photo (optional)"
            rows={3}
            className="input-field resize-none"
          />
        </div>

        <div>
          <label className="label">Upload Method</label>
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              onClick={() => setUploadMethod('file')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                uploadMethod === 'file' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              📁 Upload File
            </button>
            <button
              type="button"
              onClick={() => setUploadMethod('url')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                uploadMethod === 'url' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              🔗 Image URL
            </button>
          </div>

          {uploadMethod === 'file' ? (
            <div>
              <label htmlFor="file" className="label">
                Choose Photo *
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                  required={uploadMethod === 'file'}
                />
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Supported formats: JPG, PNG, GIF, WebP (Max 10MB)
              </p>
            </div>
          ) : (
            <div>
              <label htmlFor="imageUrl" className="label">
                Image URL *
              </label>
              <input
                type="url"
                id="imageUrl"
                value={imageUrl}
                onChange={handleUrlChange}
                placeholder="https://example.com/image.jpg"
                className="input-field"
                required={uploadMethod === 'url'}
              />
              <p className="text-sm text-gray-400 mt-1">
                Enter a direct link to an image (JPG, PNG, GIF, WebP)
              </p>
            </div>
          )}
        </div>

        {preview && (
          <div>
            <label className="label">Preview</label>
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg border-2 border-gray-600 shadow-sm"
              />
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Ready to upload
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="w-full btn text-lg py-4"
        >
          {uploading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            '🚀 Upload Photo'
          )}
        </button>
      </div>
    </form>
  );
}