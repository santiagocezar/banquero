<script lang="ts">
    import Icon from "$lib/components/Icon.svelte"
    
    import meta from "$game/meta.js"
    import logo from "$game/assets/icon.svg?url"
    
    import View from "$view"
    
    import { shareGameData } from "$lib/bxx.svelte"

    async function share(btn) {
        const url = new URL(location.href)
        const id = url.searchParams.get("id")!
        await shareGameData(id)
    }
</script>

{#if meta.headerInGame}
    <header id="header">
        <button onclick={() => history.back()} class="button back">
            <Icon use="ic-arrow-back" />
        </button>
        <a href="/" class="logo">
            <img src={logo} alt={meta.name} />
            <span>{meta.name}</span>
        </a>
        <button class="button" onclick={share}>
            <Icon use="ic-share" />
        </button>
    </header>
{/if}

<View />

<style lang="less">
    #header {
        display: flex;
        align-items: center;
        padding: 0 0.5rem;
        height: 4rem;
        flex-shrink: 0;
        border-bottom: 1px solid var(--c30);
        justify-content: space-between;

        .logo {
            display: flex;
            flex-direction: row;
            gap: 0.5em;
            justify-content: center;
            align-items: center;
            height: 6rem;
            text-align: center;
            font-family: "Poppins";
            font-size: 1rem;
            flex-shrink: 0;
            user-select: none;
            img {
                height: 1.375em;
            }
        }
        .button {
            display: flex;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            gap: 0.5rem;
            align-items: center;

            svg {
                width: 1.5rem;
                height: 1.5rem;
            }
        }
        .back {
            background: none;
            color: inherit;
        }
        #share {
            background-color: var(--blue);
            color: white;
        }
    }
</style>
