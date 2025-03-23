<script module>
    export { propertyListItem as propertyItem }
</script>

<script lang="ts">
    import * as mono from "$games/mono"
    import PropertyCard from "./PropertyCard.svelte"
    import { receiveCard, sendCard } from "./PropertyManager.svelte"

    interface Props {
        ownerships: mono.Ownerships
        owner: number
        onPropertyClick: (id: number) => void
        displayPrice: boolean
        selected?: number
        cards?: boolean
    }

    const { ownerships, owner, onPropertyClick: selectProperty, displayPrice, selected, cards }: Props = $props()
</script>

{#snippet propertyListItem(
    color: string,
    name: string,
    value: number
)}
    <div class="name">
        <div class="plastic accent" style="--c: {color}"></div>
        <span>
            {name}
        </span>
    </div>
    <div class="rent">${value}</div>
{/snippet}

<div class={["properties", {cards}]}>
    {#if !cards}
        <div class="labels">
            <span>Nombre</span>
            <span>{displayPrice ? "Costo" : "Alquiler"}</span>
        </div>
    {/if}
    {#each mono.filterOwnerIDs(ownerships, owner) as id}
        {#if selected !== id}
            {#if cards}
                <div
                    class="card"
                    in:receiveCard|global={{key: id}}
                    out:sendCard|global={{key: id}}
                >
                    <PropertyCard {ownerships} {id} onclick={() => selectProperty(id)} />
                </div>
            {:else}
                <button 
                    class="property-item palette-dynamic surface-colors" style="--base: {mono.properties[id].color}"
                    onclick={() => selectProperty(id)}
                    in:receiveCard|global={{key: id}}
                    out:sendCard|global={{key: id}}
                >
                    {@render propertyListItem(
                        mono.properties[id].color,
                        mono.properties[id].name,
                        displayPrice ? mono.properties[id].price : mono.rent(ownerships, id)
                    )}
                </button>
            {/if}
        {/if}
    {/each}
</div>

<style>
    @import './property-item.css';

    .cards {
        --card-width: 16rem;
        --gap: 1rem;

        width: 100%;
        overflow-x: scroll;
        scroll-snap-type: x mandatory;
        display: flex;
        align-items: center;
        height: 100%;
        gap: var(--gap);

        &::before, &::after {
            content: "";
            width: calc(50% - var(--card-width) / 2 - var(--gap));
            flex-shrink: 0;
            height: 1rem;
        }
    }

    .card {
        flex-shrink: 0;
        place-self: center;
        scroll-snap-align: center;
        scroll-snap-stop: always;
    }
</style>
