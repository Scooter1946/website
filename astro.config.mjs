// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Astro + React island + Tailwind v4 (via the Vite plugin).
export default defineConfig({
  site: 'https://justinchen.dev',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
