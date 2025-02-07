import meta from "$game/meta.js"
import { generateSymbols } from "$lib/icons"
import type { LayoutServerLoad } from "./$types"

export const load: LayoutServerLoad = async () => {
	return {
		defs: await generateSymbols(
            meta.icons.pack,
            meta.icons.use,
            meta.icons.prefix
        )
	};
};
