<script lang="ts">
    import * as mono from "$mono"
    import { propertyItem } from "$mono/Properties.svelte"
    import Icon from "src/components/Icon.svelte"
    import { slide } from "svelte/transition"

    interface Props {
        player: mono.Player
        ownerships: mono.Ownerships
        selected: Set<number>
    }

    let { player, ownerships, selected = $bindable() }: Props = $props()

    const deselect = (id: number) => (e: Event) => {
        selected.delete(id)
        e.preventDefault()
        // selected[i] = selected[selected.length - 1]
        // selected.length--
    }
    const select = (id: number) => (e: Event) => {
        selected.add(id)
        e.preventDefault()
        // selected.push(id)
    }
    const owned = $derived(mono.filterOwner(ownerships, player.id))
    const filtered = $derived(
        owned.reduce(
            (arr, p) => (arr[+selected.has(p.id)].push(p), arr),
            [[], []] as [mono.Ownership[], mono.Ownership[]]
        )
    )
</script>

{#snippet checkItem(p: mono.Ownership, selected: boolean)}
    <button
        out:slide
        in:slide
        onclick={selected ? deselect(p.id) : select(p.id)}
        class={["reset", "property-item", { selected }]}
    >
        {@render propertyItem(
            mono.properties[p.id].color,
            mono.properties[p.id].name,
            p.houses,
            mono.properties[p.id].price
        )}
        <div class="checkbox">
            <Icon use="ic-check" />
        </div>
    </button>
{/snippet}

<div class="properties pal-{player.color}">
    <div class="labels">
        <span>Nombre</span>
        <span>Viviendas</span>
        <span>Costo</span>
        <span>Check</span>
    </div>
    {#if owned.length}
        {#each filtered[1] as p (p.id)}
            {@render checkItem(p, true)}
        {/each}
        {#each filtered[0] as p (p.id)}
            {@render checkItem(p, false)}
        {/each}
    {:else}
        <p class="empty">No tiene propiedades</p>
    {/if}
</div>

<style>
    @import "../../property-item.css";

    .properties {
        display: grid;
        grid-template-columns: 1fr auto auto auto;
        gap: 0 1rem;
        margin: 0 -1rem;
    }
    .checkbox {
        place-self: center;
        display: grid;
        place-items: center;
        width: 2rem;
        height: 2rem;
        border-radius: 0.5rem;
        border: 1px solid var(--p70);
        color: var(--p10);

        & :global(svg) {
            visibility: hidden;
        }
    }
    .selected .checkbox {
        border: 1px solid var(--p50);
        background-color: var(--p50);

        & :global(svg) {
            visibility: visible;
        }
    }
</style>
