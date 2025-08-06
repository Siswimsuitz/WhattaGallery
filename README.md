# 📸 Photo Gallery

A beautiful and modern photo gallery built with Next.js 14, TypeScript, and Supabase. Upload, store, and display your photos with a clean and responsive interface.

## ✨ Features

- **Modern UI/UX**: Clean, responsive design with smooth animations
- **Image Upload**: Drag and drop or click to upload photos
- **Real-time Updates**: Photos appear instantly after upload
- **Image Storage**: Secure cloud storage with Supabase
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **TypeScript**: Full type safety for better development experience

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: CSS with custom utility classes
- **Backend**: Supabase (Database & Storage)
- **Deployment**: Vercel (recommended)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Siswimsuitz/WhattaGallery.git
   cd WhattaGallery
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Create the required tables with the following schema:
     ```sql
     -- Photos table
     CREATE TABLE photos (
       id SERIAL PRIMARY KEY,
       title TEXT NOT NULL,
       description TEXT,
       image_url TEXT NOT NULL,
       albumz_id INTEGER REFERENCES albumz(id) ON DELETE SET NULL,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
     );

     -- Albumz table
     CREATE TABLE albumz (
       id SERIAL PRIMARY KEY,
       name TEXT NOT NULL,
       description TEXT,
       cover_image_url TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
     );
     ```
   - Create a `photos` storage bucket:
     - Go to Storage in Supabase dashboard
     - Create a new bucket named `photos`
     - Set it to **Public** (not private)
     - Enable RLS (Row Level Security)
   - Set up Row Level Security (RLS) policies:
     ```sql
     -- Database policies
     -- Allow public read access to photos
     CREATE POLICY "Allow public read access" ON photos
     FOR SELECT USING (true);

     -- Allow public insert access to photos
     CREATE POLICY "Allow public insert access" ON photos
     FOR INSERT WITH CHECK (true);

     -- Allow public read access to albumz
     CREATE POLICY "Allow public read access" ON albumz
     FOR SELECT USING (true);

     -- Allow public insert access to albumz
     CREATE POLICY "Allow public insert access" ON albumz
     FOR INSERT WITH CHECK (true);

     -- Storage policies (IMPORTANT!)
     -- Allow public read access to storage
     CREATE POLICY "Allow public read access" ON storage.objects
     FOR SELECT USING (bucket_id = 'photos');

     -- Allow public insert access to storage
     CREATE POLICY "Allow public insert access" ON storage.objects
     FOR INSERT WITH CHECK (bucket_id = 'photos');

     -- Allow public update access to storage
     CREATE POLICY "Allow public update access" ON storage.objects
     FOR UPDATE USING (bucket_id = 'photos');

     -- Allow public delete access to storage
     CREATE POLICY "Allow public delete access" ON storage.objects
     FOR DELETE USING (bucket_id = 'photos');
     ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

1. **Upload Photos**: Use the upload form to add new photos with titles and descriptions
2. **Create Albumz**: Organize your photos into collections called "albumz"
3. **View Gallery**: Browse all uploaded photos in a responsive grid layout
4. **View Albumz**: Click on albumz to see photos organized by collection
5. **Full-size View**: Click any photo to view it in full size
6. **Real-time Updates**: New photos appear immediately after upload

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

```bash
npm run build
npm start
```

## 📁 Project Structure

```
photo-gallery/
├── app/
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx            # Main gallery page
│   ├── ImageUploadForm.tsx # Photo upload component
│   └── globals.css         # Global styles
├── utils/
│   └── supabaseClient.ts   # Supabase configuration
├── public/                 # Static assets
├── package.json
├── next.config.ts
└── tsconfig.json
```

## 🔧 Configuration

### Supabase Setup

1. **Database Table**:
   ```sql
   CREATE TABLE photos (
     id SERIAL PRIMARY KEY,
     title TEXT NOT NULL,
     description TEXT,
     image_url TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

2. **Storage Bucket**:
   - Create a bucket named `photos`
   - Set it to public
   - Configure CORS if needed

3. **RLS Policies**:
   ```sql
   -- Allow public read access
   CREATE POLICY "Allow public read access" ON photos
   FOR SELECT USING (true);

   -- Allow public insert access
   CREATE POLICY "Allow public insert access" ON photos
   FOR INSERT WITH CHECK (true);
   ```

## 🚨 Troubleshooting

### File Upload Issues
If you get "row-level security policy" errors when uploading files:
1. **Check storage bucket** - Make sure it's set to "Public" (not private)
2. **Verify RLS policies** - Run the storage policies above
3. **Check bucket name** - Must be exactly `photos`
4. **Enable RLS** - Storage bucket must have RLS enabled

### Image Display Issues
If images don't display properly:
1. **Check image URLs** - Verify they're accessible
2. **Check CORS settings** - May need to configure CORS for external domains
3. **Verify storage policies** - Read access must be enabled

### Modal Image Sizing
If images in the modal are too large:
1. **Check browser console** for any errors
2. **Verify image dimensions** - Very large images may need optimization
3. **Test with different image sizes** to confirm scaling works

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- Deployed on [Vercel](https://vercel.com/)

---

Made with ❤️ by [Your Name]