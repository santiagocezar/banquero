<script lang="ts">
    import "$lib/styles/reset.css"
    import "$lib/styles/global.scss"
    import "$lib/styles/palette.scss"
    import "$lib/theme-color.ts"
    
    // import { pwaInfo } from "virtual:pwa-info"
    // import Reload from "$lib/components/Reload.svelte"
    import type { LayoutProps } from "./$types"
    
    import meta from "$game/meta.js"
    import favicon from "$game/assets/favicon.svg?url"
    import logo from "$game/assets/icon.svg?url"
    
    // // Polyfill for scroll animations
    // // Quite clunky in firefox mobile, disabled it for now
    
    // import { onMount } from "svelte"
    // import { browser } from "$app/environment"
    
    // onMount(async () => {
    //     if (browser) await import('scroll-timeline-polyfill/dist/scroll-timeline.js')
    // })

    const { data, children }: LayoutProps = $props()
</script>

<svelte:head>
    <link rel="icon" type="image/svg+xml" href={favicon} />
    <meta name="description" content={meta.description} />
    <meta
        id="theme-color"
        name="theme-color"
        content="#fe1e6e"
    />
    <title>{meta.name}</title>
    <!-- {pwaInfo && <Fragment set:html={pwaInfo.webManifest.linkTag} />}-->
</svelte:head>

<!-- <Reload /> -->
<svg style="display: none;">
    <defs>
        {@html data.defs}
    </defs>
</svg>
{@render children?.()}
