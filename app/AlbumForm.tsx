'use client';

import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

interface AlbumFormProps {
  onAlbumCreated: () => void;
  onCancel: () => void;
}

export default function AlbumForm({ onAlbumCreated, onCancel }: AlbumFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Please enter an album name');
      return;
    }

    setCreating(true);

    try {
      const { error } = await supabase
        .from('albums')
        .insert({
          name: name.trim(),
          description: description.trim(),
        });

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      // Reset form
      setName('');
      setDescription('');
      
      // Notify parent component
      onAlbumCreated();
      
      alert('Album created successfully!');
    } catch (error) {
      console.error('Error creating album:', error);
      alert(`Error creating album: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-200 mb-2">📁 Create New Album</h2>
            <p className="text-gray-400">Organize your photos into beautiful collections</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="albumName" className="label">
                Album Name *
              </label>
              <input
                type="text"
                id="albumName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter album name"
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="albumDescription" className="label">
                Description
              </label>
              <textarea
                id="albumDescription"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your album (optional)"
                rows={3}
                className="input-field resize-none"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="flex-1 btn"
              >
                {creating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  '📁 Create Album'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}