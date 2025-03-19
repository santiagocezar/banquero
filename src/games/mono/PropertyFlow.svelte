<script module>
    export { propertyItem }
</script>

<script lang="ts">
    import * as mono from "$games/mono"
    import { receiveCard, sendCard } from "./panels/player/ManageProperty.svelte"
    import PropertyCard from "./PropertyCard.svelte"

    interface Props {
        ownerships: mono.Ownerships
        owner: number
        displayPrice: boolean
        onpropertyselected: (id: number) => void
    }

    const { ownerships, owner, onpropertyselected: selectProperty, displayPrice }: Props = $props()
    
    
</script>

{#snippet propertyItem(
    color: string,
    name: string,
    value: number
)}
    <div class="name">
        <div style="--c: {color}"></div>
        <span>
            {name}
        </span>
    </div>
    <div class="rent">${value}</div>
{/snippet}

<div class="properties">
    {#each mono.filterOwnerIDs(ownerships, owner) as id}
        <div
            class="wrapper"
            in:receiveCard|global={{key: id}}
            out:sendCard|global={{key: id}}
        >
            <PropertyCard {ownerships} {id} onclick={() => selectProperty(id)} />
        </div>
    {/each}
</div>

<style>
    .wrapper {
        flex-shrink: 0;
        place-self: center;
        scroll-snap-align: center;
        scroll-snap-stop: always;
    }
    .properties {
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
        /* padding-left: calc(50% - var(--card-width) / 2); */
        /* padding-right: calc(50% - var(--card-width) / 2); */
    }
</style>
