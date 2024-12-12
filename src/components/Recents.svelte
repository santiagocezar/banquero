<script lang="ts">
import { type Recent, deleteRecent, getRecents } from "../lib/bxx.svelte";
import { TrucoGame, truco } from "./truco";
import RecentItem from "./RecentItem.svelte";

let recents = $state(getRecents())

function onDelete(id: string) {
    recents = deleteRecent(id)
}
</script>

<div class="recents">
    {#if recents.length}
        <h2>Partidas recientes</h2>
        {#each recents as recent (recent.id)}
            <RecentItem onDelete={onDelete} recent={recent} />
        {/each}
    {:else}
        <div class="nope">
            <img src="/dude.webp" alt="an sketch of a dude in a hoodie pointing up" />
            <small>No hay partidas recientes, haga click en el botón de "Nueva partida" para empezar a contar puntos</small>
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
</style>
