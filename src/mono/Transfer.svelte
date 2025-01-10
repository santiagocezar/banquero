<script lang="ts">
    import { BANK, properties, type Player } from "."

    interface Props {
        from: number
        to: number
        players: Player[]
        gives: number[]
        recieves: number[]
        houses: number
    }

    const { from, to, players, gives, recieves, houses }: Props = $props()
    let value = $state(0)

    const ownedProperties = $derived(
        new Set(players.flatMap((p) => p.properties.map((p) => p.id)))
    )

    function askConfirm(ev: Event) {
        ev.preventDefault()
    }
</script>

<header>
    <p>
        {from === BANK ? "El banco" : players[from]} le transfiere {from ===
        BANK
            ? "al banco"
            : "a " + players[to]}
    </p>
    <p class="amount">${value}</p>
    {#if gives.length}
        <p>y las siguientes propiedades:</p>
        <ul>
            {#each gives as prop}
                <li>{properties[prop]}</li>
            {/each}
        </ul>
    {/if}

    {#if gives.length}
        <p>A cambio, {from === BANK ? "El banco" : players[from]} recibe:</p>
        <ul>
            {#each recieves as prop}
                <li>{properties[prop]}</li>
            {/each}
        </ul>
    {/if}
</header>
<form action="#" onsubmit={askConfirm} class="options">
    <label>
        Monto $
        <!-- svelte-ignore a11y_autofocus -->
        <input
            class="money"
            type="number"
            inputMode="numeric"
            bind:value
            autofocus={true}
            onfocus={(e) => (e.target as HTMLInputElement).select()}
        />
    </label>
    <fieldset>
        <legend></legend>
    </fieldset>

    <button type="submit">Aceptar</button>
</form>
