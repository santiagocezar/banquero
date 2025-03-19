<script lang="ts">
    import * as mono from "$games/mono"
    import { propertyItem } from "$games/mono/PropertyList.svelte"
    import Icon from "$lib/components/Icon.svelte"
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
    const owned = $derived(mono.filterOwnerIDs(ownerships, player.id))
    const filtered = $derived(
        owned.reduce(
            (arr, id) => (
                // coerces the boolean into an array index, 0 if false, 1 if true
                // esentially partitioning the list of player properties in two:
                // selected and unselected.
                arr[+selected.has(id)].push(id), arr
            ), 
            [ [], [] ] as [number[], number[]])
    )
</script>

{#snippet checkItem(id: number, selected: boolean)}
    <button
        out:slide
        in:slide
        onclick={selected ? deselect(id) : select(id)}
        class={["reset", "property-item", { selected }]}
    >
        {@render propertyItem(
            mono.properties[id].color,
            mono.properties[id].name,
            mono.properties[id].price
        )}
        <div class={["checkbox plastic", { "accent": selected }]}>
            <Icon use="ic-check" />
        </div>
    </button>
{/snippet}

<div class="properties pal-{player.color}">
    <div class="labels">
        <span>Nombre</span>
        <span>Costo</span>
        <span>Check</span>
    </div>
    {#if owned.length}
        {#each filtered[1] as id (id)}
            {@render checkItem(id, true)}
        {/each}
        {#each filtered[0] as id (id)}
            {@render checkItem(id, false)}
        {/each}
    {:else}
        <p class="empty">No tiene propiedades</p>
    {/if}
</div>

<style>
    @import "../../property-item.css";

    .properties {
        display: grid;
        grid-template-columns: 1fr auto auto;
        margin: 0 -1rem;
    }
    .checkbox {
        place-self: center;
        display: grid;
        place-items: center;
        width: 2rem;
        height: 2rem;
        /* border-radius: 0.5rem; */
        /* border: 1px solid var(--c70); */
        /* color: var(--c10); */

        & :global(svg) {
            visibility: hidden;
        }
    }
    .selected .checkbox {
        /* border: 1px solid var(--c50);
        background-color: var(--c50); */

        & :global(svg) {
            visibility: visible;
        }
    }
</style>
