import { preprocessMeltUI, sequence } from '@melt-ui/pp'
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { gameBase, meta } from './auto-game.js';
import { resolve } from "node:path"

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: sequence([
		vitePreprocess(),
		preprocessMeltUI(),
	]),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			"$games/*": "src/games/*",
            "$game/*": resolve(gameBase),
            "$home": resolve(gameBase, meta.homeImportPath),
            "$view": resolve(gameBase, meta.viewImportPath),
		}
	}
};

export default config;
