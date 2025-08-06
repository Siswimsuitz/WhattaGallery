"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import ImageUploadForm from "./ImageUploadForm";

export default function Home() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImagesAndAlbums() {
      setLoading(true);
      // Fetch albums
      const { data: albumData } = await supabase.from("albums").select();
      setAlbums(albumData || []);
      // Fetch images
      const { data: imageData } = await supabase.from("images").select();
      setPhotos(imageData || []);
      setLoading(false);
    }
    fetchImagesAndAlbums();
  }, []);

  // For refresh after upload
  const handleUpload = async () => {
    setLoading(true);
    const { data: albumData } = await supabase.from("albums").select();
    setAlbums(albumData || []);
    const { data: imageData } = await supabase.from("images").select();
    setPhotos(imageData || []);
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.siteTitle}>Ana Dias Photography</h1>
        <nav className={styles.nav}>
          <a href="#gallery">Gallery</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>
      <section className={styles.hero}>
        <h2 className={styles.heroTitle}>Capturing Moments, Creating Memories</h2>
        <p className={styles.heroSubtitle}>
          Elegant, timeless photography for every occasion.
        </p>
      </section>
      <section id="gallery" className={styles.gallerySection}>
        <h3 className={styles.sectionTitle}>Gallery</h3>
        <ImageUploadForm onUpload={handleUpload} />
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>Loading photos...</div>
        ) : (
          <div>
            {/* Group by album */}
            {albums.length > 0 && (
              <div>
                {albums.map((album) => (
                  <div key={album.id} style={{ marginBottom: 32 }}>
                    <h4>{album.name}</h4>
                    <div className={styles.galleryGrid}>
                      {photos.filter((img) => img.album_id === album.id).length === 0 ? (
                        <div style={{ gridColumn: "1/-1", textAlign: "center" }}>No photos in this album.</div>
                      ) : (
                        photos
                          .filter((img) => img.album_id === album.id)
                          .map((img, i) => (
                            <div className={styles.galleryItem} key={img.id || i}>
                              <Image
                                src={img.url}
                                alt={`Gallery photo ${i + 1}`}
                                width={400}
                                height={500}
                                className={styles.galleryImage}
                                placeholder="blur"
                                blurDataURL="/placeholder.png"
                              />
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Photos without album */}
            <div>
              <h4>Unsorted</h4>
              <div className={styles.galleryGrid}>
                {photos.filter((img) => !img.album_id).length === 0 ? (
                  <div style={{ gridColumn: "1/-1", textAlign: "center" }}>No unsorted photos.</div>
                ) : (
                  photos
                    .filter((img) => !img.album_id)
                    .map((img, i) => (
                      <div className={styles.galleryItem} key={img.id || i}>
                        <Image
                          src={img.url}
                          alt={`Gallery photo ${i + 1}`}
                          width={400}
                          height={500}
                          className={styles.galleryImage}
                          placeholder="blur"
                          blurDataURL="/placeholder.png"
                        />
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        )}
      </section>
      <section id="about" className={styles.aboutSection}>
        <h3 className={styles.sectionTitle}>About</h3>
        <p className={styles.aboutText}>
          Ana Dias is a professional photographer specializing in portrait, event, and lifestyle photography. Her work is known for its natural light, candid moments, and artistic composition.
        </p>
      </section>
      <section id="contact" className={styles.contactSection}>
        <h3 className={styles.sectionTitle}>Contact</h3>
        <p className={styles.contactText}>
          For bookings and inquiries, please email <a href="mailto:info@anadiasphotography.com">info@anadiasphotography.com</a>
        </p>
      </section>
      <footer className={styles.footer}>
        &copy; {new Date().getFullYear()} Ana Dias Photography. All rights reserved.
      </footer>
    </div>
  );
}
