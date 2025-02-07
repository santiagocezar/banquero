import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { gameBase, meta } from './auto-game';

const _PWA_CONFIG = {
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
				src: gameBase + "/assets/maskable_icon_x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: gameBase + "/assets/maskable_icon_x512.png",
				sizes: "512x512",
				type: "image/png",
			},
			{
				src: gameBase + "/assets/apple1024.png",
				sizes: "1024x1024",
				type: "image/png",
			},
			{
				src: gameBase + "/assets/maskable_icon.png",
				sizes: "1024x1024",
				type: "image/png",
				purpose: "any maskable",
			},
		],
	},
}

export default defineConfig({
	plugins: [sveltekit()]
});
