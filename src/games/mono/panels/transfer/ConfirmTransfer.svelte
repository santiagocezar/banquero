<script lang="ts">
    import * as mono from "$games/mono"

    interface Props {
        pays: mono.Player
        charges: mono.Player
        value: mono.Exchange
        onConfirm: () => void
    }

    const { pays, charges, value, onConfirm }: Props = $props()
</script>

<p>{pays.name} a {charges.name}</p>
<p>Monto: {value.amount}</p>
{#if value.buildings != 0}
    <p>
        {value.buildings < 0 ? "Vende" : "Compra"} {Math.abs(value.buildings)} casa{
            Math.abs(value.buildings) == 1 ? "" : "s"
        }
        para {mono.properties[value.buildingsFor].name}
    </p>
{/if}
{#if value.charges.sells.length}
    <p>Compra las siguientes propiedades:</p>
    <ul>
        {#each value.charges.sells as id}
            <li>{mono.properties[id].name}</li>
        {/each}
    </ul>
{/if}
{#if value.pays.sells.length}
    <p>Vende las siguientes propiedades:</p>
    <ul>
        {#each value.pays.sells as id}
            <li>{mono.properties[id].name}</li>
        {/each}
    </ul>
{/if}
{#if value.mortgage.length}
    <p>Hipoteca las siguientes propiedades:</p>
    <ul>
        {#each value.mortgage as id}
            <li>{mono.properties[id].name}</li>
        {/each}
    </ul>
{/if}
{#if value.liftMortgage.length}
    <p>Levanta la hipoteca de las siguientes propiedades:</p>
    <ul>
        {#each value.liftMortgage as id}
            <li>{mono.properties[id].name}</li>
        {/each}
    </ul>
{/if}

<button onclick={onConfirm}>Confirmar</button>