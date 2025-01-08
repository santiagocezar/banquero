<script lang="ts">
    import { BANK, properties, type Player } from "./index.svelte"

    interface Props {
        from: number
        to: number
        players: Player[]
    }
    
    const { from, to, players }: Props = $props()
    let value = $state(0)
    
    const ownedProperties = $derived(new Set(players.flatMap(p => p.properties.map(p => p.id))))
    
    function askConfirm(ev: Event) {
        ev.preventDefault()
    }
</script>

<header>
    <p>{from === BANK ? "El banco" : players[from]} le transfiere {from === BANK ? "al banco" : "a " + players[to]}</p>
    <p class="amount">${value}</p> 
    <p>y las siguientes propiedades:</p>
    <ul>
        
    </ul>
    <p>{from === BANK ? "El banco" : players[from]} recibe:</p>
    <ul>
        
    </ul>
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
            onfocus={e => (e.target as HTMLInputElement).select()}
        />
    </label>
    <fieldset>
        <legend></legend>
    </fieldset>
    
    <button type="submit">Aceptar</button>
</form>
