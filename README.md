# Ana Dias Photography Gallery

A modern, elegant photo gallery website inspired by [anadiasphotography.com](https://www.anadiasphotography.com/), built with Next.js (App Router, TypeScript) and Supabase for backend image storage and management.

## Features
- Clean, minimal, and responsive design
- Gallery grid with hover effects
- About and Contact sections
- Supabase backend integration (coming soon)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) to view the site.

## Supabase Setup
- Add your Supabase project URL and anon key to a `.env.local` file (see below).
- Images will be loaded from Supabase Storage (integration in progress).

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## License
MIT
