<script lang="ts">
    import { deleteRecent, getRecents } from "../lib/bxx.svelte"
    import RecentItem from "./RecentItem.svelte"

    let recents = $state(getRecents())

    function onDelete(id: string) {
        recents = deleteRecent(id)
    }
</script>

<div class="recents">
    {#if recents === null}
        <div class="loading"></div>
    {:else if recents.length}
        <h2>Partidas recientes</h2>
        {#each recents as recent (recent.id)}
            <RecentItem {onDelete} {recent} />
        {/each}
    {:else}
        <div class="nope">
            <img
                src="/dude.webp"
                alt="an sketch of a dude in a hoodie pointing up"
            />
            <small
                >No hay partidas recientes, haga click en el botón de "Nueva
                partida" para empezar a contar puntos</small
            >
        </div>
    {/if}
</div>

<style lang="less">
    .nope {
        flex-direction: column;
        justify-content: center;
        gap: 1rem;
        display: flex;
        align-items: center;

        img {
            max-width: 20rem;
            width: 70%;
        }

        align-self: center;
        flex-grow: 1;
        text-align: center;
    }

    .recents {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;

        h2 {
            text-align: center;
            font-weight: bold;
            font-size: 1.5rem;
        }
    }

    @keyframes rotate {
        0% {
            rotate: 0deg;
        }
        100% {
            rotate: 360deg;
        }
    }

    .loading {
        width: 6rem;
        height: 6rem;
        border-radius: 6rem;
        border: 0.25rem solid currentColor;
        border-bottom-color: transparent;
        will-change: rotate;
        animation: rotate 0.4s infinite linear;
        margin: 4rem auto;
    }
</style>
