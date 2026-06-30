// @ts-check
import { defineConfig } from 'astro/config';

// Static output. No UI framework, no Tailwind — plain CSS + one enhancement script.
export default defineConfig({
  site: 'https://example.com', // TODO(user): your real domain
  // For a GitHub Pages *project* site, also set:
  // base: '/REPO_NAME', // TODO(user): uncomment + set if deploying to a GH Pages project site
});
