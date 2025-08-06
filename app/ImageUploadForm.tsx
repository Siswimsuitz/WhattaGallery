"use client";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

interface Album {
  id: string;
  name: string;
}

export default function ImageUploadForm({ onUpload }: { onUpload?: () => void }) {
  const [imageUrl, setImageUrl] = useState("");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlbums() {
      const { data, error } = await supabase.from("albums").select();
      if (data) setAlbums(data);
    }
    fetchAlbums();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    let albumId = selectedAlbum;
    try {
      if (selectedAlbum === "new" && newAlbumName.trim()) {
        // Create new album
        const { data: albumData, error: albumError } = await supabase
          .from("albums")
          .insert([{ name: newAlbumName.trim() }])
          .select()
          .single();
        if (albumError) throw albumError;
        albumId = albumData.id;
        setAlbums((prev) => [...prev, albumData]);
        setSelectedAlbum(albumData.id);
      }
      // Insert image record
      const { error: imageError } = await supabase.from("images").insert([
        { url: imageUrl, album_id: albumId || null },
      ]);
      if (imageError) throw imageError;
      setSuccess("Image uploaded!");
      setImageUrl("");
      setNewAlbumName("");
      if (onUpload) onUpload();
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 32, maxWidth: 400 }}>
      <h3>Submit Image Link</h3>
      <input
        type="url"
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        required
        style={{ width: "100%", marginBottom: 8 }}
      />
      <select
        value={selectedAlbum || ""}
        onChange={(e) => setSelectedAlbum(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      >
        <option value="">No album</option>
        {albums.map((album) => (
          <option key={album.id} value={album.id}>
            {album.name}
          </option>
        ))}
        <option value="new">Create new album</option>
      </select>
      {selectedAlbum === "new" && (
        <input
          type="text"
          placeholder="New album name"
          value={newAlbumName}
          onChange={(e) => setNewAlbumName(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 8 }}
        />
      )}
      <button type="submit" disabled={loading} style={{ width: "100%" }}>
        {loading ? "Uploading..." : "Submit"}
      </button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      {success && <div style={{ color: "green", marginTop: 8 }}>{success}</div>}
    </form>
  );
}