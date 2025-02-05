import { resolve } from "node:path"

import { defineConfig } from "astro/config"

import svelte from "@astrojs/svelte"

import astroPWA from "@vite-pwa/astro"

const GAME = process.env.GAME ?? "truco"


const gameBase = "./src/games/" + GAME
/** @type {{default: GameMeta}} */
const { default: meta } = await import(gameBase + "/meta.js")
console.log(meta)

// https://astro.build/config
export default defineConfig({
    vite: {
        resolve: {
            alias: {
                "$game": resolve(gameBase),
                "$home": resolve(gameBase, meta.homeImportPath),
                "$view": resolve(gameBase, meta.viewImportPath),
            }
        }
    },
    integrations: [
        svelte(),
        astroPWA({
            includeAssets: ["*.svg", "*.png", "*.webp"],
            devOptions: {
                enabled: false,
            },
            workbox: {
                // globPatterns: ['**/*'],
                // navigateFallback: '/404',
                ignoreURLParametersMatching: [/./],
            },
            experimental: {
                directoryAndTrailingSlashHandler: true,
            },
            registerType: "autoUpdate",
            manifest: {
                short_name: meta.name,
                name: meta.name,
                description: meta.description,
                theme_color: "#2c37de",
                display: "standalone",
                icons: [
                    {
                        src: GAME + "/maskable_icon_x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: GAME + "/maskable_icon_x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                    {
                        src: GAME + "/apple1024.png",
                        sizes: "1024x1024",
                        type: "image/png",
                    },
                    {
                        src: GAME + "/maskable_icon.png",
                        sizes: "1024x1024",
                        type: "image/png",
                        purpose: "any maskable",
                    },
                ],
            },
        }),
    ],
})
