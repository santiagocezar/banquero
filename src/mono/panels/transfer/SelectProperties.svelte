<script lang="ts">
    import { type Player, type OwnedProperty, properties } from "$mono"
    import { propertyItem } from "$mono/Properties.svelte"
    import Icon from "src/components/Icon.svelte"
    import { slide } from "svelte/transition"

    interface Props {
        player: Player
        selected: Set<number>
    }

    let { player, selected = $bindable() }: Props = $props()

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
    const filtered = $derived(
        player.properties.reduce(
            (arr, p) => (arr[+selected.has(p.id)].push(p), arr),
            [[], []] as [OwnedProperty[], OwnedProperty[]]
        )
    )
</script>

{#snippet checkItem(p: OwnedProperty, selected: boolean)}
    <button
        out:slide
        in:slide
        onclick={selected ? deselect(p.id) : select(p.id)}
        class={["reset", "property-item", { selected }]}
    >
        {@render propertyItem(
            properties[p.id].block,
            properties[p.id].name,
            p.houses,
            properties[p.id].price
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
    {#if player.properties.length}
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
