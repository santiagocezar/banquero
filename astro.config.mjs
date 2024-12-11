import { defineConfig } from 'astro/config';

import solidJs from "@astrojs/solid-js";
import svelte from '@astrojs/svelte';

// its kinda funny honestly


// import astroPWA from "@vite-pwa/astro"

// https://astro.build/config
export default defineConfig({
  vite: {
    build: {
      sourcemap: "inline",
    }
  },
  integrations: [
    solidJs(),
    svelte(),
    // astroPWA({
    //   devOptions: {
    //     enabled: true
    //   },
    //   manifest: {
    //     includeAssets: ['favicon.svg', 'apple180.png', 'apple1024.png', 'mask-icon.svg', 'dude.webp', 'logo.svg'],
    //     short_name: "Truco",
    //     name: "Score Truco",
    //     description: "El contador del truco por excelencia.",
    //     theme_color: "#fe1e6e",
    //     icons: [
    //       {
    //         src: 'pwa192.png',
    //         sizes: '192x192',
    //         type: 'image/png'
    //       },
    //       {
    //         src: 'pwa512.png',
    //         sizes: '512x512',
    //         type: 'image/png'
    //       },
    //       {
    //         src: 'apple1024.png',
    //         sizes: '1024x1024',
    //         type: 'image/png'
    //       },
    //       {
    //         src: 'pwa512.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //         purpose: 'any maskable'
    //       },
    //     ]
    //   },
    // })
  ]
});
