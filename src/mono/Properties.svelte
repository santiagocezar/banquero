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
    <div class="labels">
        <span>Nombre</span>
        <span>Alquiler</span>
    </div>
    {#each mono.filterOwnerIDs(ownerships, owner) as id}
        <button class="reset property-item" onclick={() => selectProperty(id)}>
            {@render propertyItem(
                mono.properties[id].color,
                mono.properties[id].name,
                mono.rent(ownerships, id)
            )}
        </button>
    {/each}
</div>

<style>
    @import "./property-item.css";
</style>
