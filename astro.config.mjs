import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

import astroPWA from "@vite-pwa/astro"

// https://astro.build/config
export default defineConfig({
  integrations: [
    svelte(),
    astroPWA({
      includeAssets: [
        '*.svg',
        '*.png',
        '*.webp',
      ],
      devOptions: {
        enabled: false
      },
      workbox: {
        // globPatterns: ['**/*'],
        // navigateFallback: '/404',
        ignoreURLParametersMatching: [/./],
      },
      experimental: {
        directoryAndTrailingSlashHandler: true,
      },
      registerType: 'autoUpdate',
      manifest: {
        short_name: "Trucomatic",
        name: "Trucomatic",
        description: "El contador del truco por excelencia.",
        theme_color: "#2c37de",
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
