/// <reference types="astro/client" />
/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/svelte" />

declare module "$game/meta.js" {
    const meta: GameMeta
    export default meta
}
declare module "$game/assets/*" {
    const whatever: any
    export default whatever
}
declare module "$home" {
    const comp: import("astro/runtime/server/index.js").AstroComponentFactory
    export default comp
}
declare module "$view" {
    const comp: import("astro/runtime/server/index.js").AstroComponentFactory
    export default comp
}

declare module "scroll-timeline-polyfill/dist/scroll-timeline.js";

declare class ViewTimeline extends AnimationTimeline {
    constructor(options: any)
}
