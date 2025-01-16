<script module>
    export { propertyItem }
</script>

<script lang="ts">
    import * as mono from "$mono"

    interface Props {
        ownerships: mono.Ownerships
        owner: number
        onpropertyselected: (id: number) => void
    }

    const { ownerships, owner, onpropertyselected: selectProperty }: Props = $props()
    
    
</script>

{#snippet propertyItem(
    color: string,
    name: string,
    houses: number,
    value: number
)}
    <div class="name">
        <div style="--c: {color}"></div>
        <span>
            {name}
        </span>
    </div>
    <div class="houses">{houses}</div>
    <div class="rent">${value}</div>
{/snippet}

<div class="properties">
    <div class="labels">
        <span>Nombre</span>
        <span>Viviendas</span>
        <span>Alquiler</span>
    </div>
    {#each mono.filterOwner(ownerships, owner) as p}
        <button class="reset property-item" onclick={() => selectProperty(p.id)}>
            {@render propertyItem(
                mono.properties[p.id].color,
                mono.properties[p.id].name,
                p.houses,
                mono.rent(ownerships, p.id)
            )}
        </button>
    {/each}
</div>

<style>
    @import "./property-item.css";
</style>
