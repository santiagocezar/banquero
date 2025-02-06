<script lang="ts">
    import { deleteRecent, getRecents } from "$lib/bxx.svelte"
    import Icon from "$lib/components/Icon.svelte"

    let recents = $state(getRecents())

    function onDelete(id: string) {
        recents = deleteRecent(id)
    }
</script>

<div class="recents">
    {#if recents === null}
        <div class="loading"></div>
    {:else if recents.length}
        <a class="continue" href="/game#{recents[0].id}">
            Continuar partida
            <Icon use="ic-chevron-right" />
        </a>
        <div class="nope">
            <img
                src="/dude.webp"
                alt="an sketch of a dude in a hoodie pointing up"
            />
        </div>
        <h2>Partidas recientes</h2>
        {#each recents as recent (recent.id)}
            <div class="recent">
                <a href="/game#{recent.id}">
                    {recent.date.toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                    })}
                </a>
                <button onclick={() => onDelete(recent.id)}>
                    <Icon use="ic-delete" />
                </button>
            </div>
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
    .continue {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        background-color: var(--bg0);
        margin: 0 1rem;
        padding: 1rem;
        font-size: 1.5rem;
        border-radius: 2rem;
        font-weight: bold;
        flex-shrink: 0;
    }
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
        gap: 1rem;

        h2 {
            text-align: center;
            font-weight: bold;
            font-size: 1.5rem;
        }
    }

    .recent {
        display: grid;
        grid-template-columns: 1fr auto;
        background-color: var(--bg0);
        border-radius: 1rem;

        button {
            margin: 0.5rem;
            background-color: var(--red);
        }
        a {
            display: flex;
            align-items: center;
            padding: 0 1rem;
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
