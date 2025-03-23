<script lang="ts">
    import type { Snippet } from "svelte"

    interface Props {
        children?: Snippet
        sidebar?: Snippet
        activeSidebar?: boolean
    }

    const { children, sidebar, activeSidebar }: Props = $props()
</script>

<div class="panels">
    <main>
        {@render children?.()}
    </main>
    <aside
        data-active={activeSidebar}
    >
        {@render sidebar?.()}
    </aside>
</div>

<style>
    .panels {
        display: grid;
        grid-template: "sidebar" 1fr / 1fr;
        height: 100%;
        gap: 0.5rem;
        overflow: hidden;
        user-select: none;
    }
    aside {
        display: none;
        grid-area: sidebar;
        background-color: var(--bg2);
        z-index: 10;
        overflow: hidden;
        position: relative;

        & > :global(*) {
            position: absolute;
            inset: 0;
        }
        &[data-active="true"] {
            display: block;
        }
    }
    main {
        grid-area: sidebar;
    }
    @media screen and (min-width: 60rem) {
        .panels {
            grid-template: "main sidebar" 1fr / 1fr 30rem;
        }
        main {
            grid-area: main;
        }
        aside {
            border-radius: 0.5rem;
            border: 1px solid var(--bg0);
            box-shadow: 0 1px 4px var(--bg0);
            margin: 1rem;
            display: block;
        }
    }
</style>