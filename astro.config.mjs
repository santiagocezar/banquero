import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

import astroPWA from "@vite-pwa/astro"

// https://astro.build/config
export default defineConfig({
  integrations: [
    svelte(),
    astroPWA({
      devOptions: {
        enabled: true
      },
      manifest: {
        includeAssets: [
          'favicon.svg',
          'apple180.png',
          'apple1024.png',
          'maskable_icon_x192.png',
          'maskable_icon_x512.png',
          'maskable_icon.png',
          'dude.webp',
          'logo.svg',
        ],
        short_name: "Trucomatic",
        name: "Trucomatic",
        description: "El contador del truco por excelencia.",
        theme_color: "#fe1e6e",
        display: "standalone",
        icons: [
          {
            src: 'maskable_icon_x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'maskable_icon_x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'apple1024.png',
            sizes: '1024x1024',
            type: 'image/png'
          },
          {
            src: 'maskable_icon.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'any maskable'
          },
        ]
      },
    })
  ]
});
