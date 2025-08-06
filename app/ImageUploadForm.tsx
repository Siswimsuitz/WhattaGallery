'use client';

import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

interface ImageUploadFormProps {
  onPhotoUploaded: () => void;
}

export default function ImageUploadForm({ onPhotoUploaded }: ImageUploadFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title.trim()) {
      alert('Please select a file and enter a title');
      return;
    }

    setUploading(true);

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      // Save photo metadata to database
      const { error: insertError } = await supabase
        .from('photos')
        .insert({
          title: title.trim(),
          description: description.trim(),
          image_url: publicUrl,
        });

      if (insertError) throw insertError;

      // Reset form
      setTitle('');
      setDescription('');
      setFile(null);
      setPreview(null);
      
      // Notify parent component
      onPhotoUploaded();
      
      alert('Photo uploaded successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error uploading photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">📤 Upload New Photo</h2>
        <p className="text-gray-600">Share your beautiful moments with the world</p>
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
          <label htmlFor="file" className="label">
            Choose Photo *
          </label>
          <div className="relative">
            <input
              type="file"
              id="file"
              accept="image/*"
              onChange={handleFileChange}
              className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Supported formats: JPG, PNG, GIF, WebP (Max 10MB)
          </p>
        </div>

        {preview && (
          <div>
            <label className="label">Preview</label>
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
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