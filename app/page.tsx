"use client";

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Home() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      // List all images in the 'photos' bucket
      const { data, error } = await supabase.storage.from("photos").list("", { limit: 100 });
      if (error) {
        setLoading(false);
        return;
      }
      if (data) {
        // Get public URLs for each image
        const urls = data
          .filter((item) => item.name.match(/\.(jpg|jpeg|png|webp)$/i))
          .map((item) =>
            supabase.storage.from("photos").getPublicUrl(item.name).data.publicUrl
          );
        setPhotos(urls);
      }
      setLoading(false);
    }
    fetchPhotos();
  }, []);

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
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>Loading photos...</div>
        ) : (
          <div className={styles.galleryGrid}>
            {photos.length === 0 ? (
              <div style={{ gridColumn: "1/-1", textAlign: "center" }}>No photos found.</div>
            ) : (
              photos.map((src, i) => (
                <div className={styles.galleryItem} key={i}>
                  <Image
                    src={src}
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
