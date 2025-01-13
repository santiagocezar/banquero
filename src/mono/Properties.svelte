<script module>
    export { propertyItem }
</script>

<script lang="ts">
    import { OwnedProperty, properties } from "$mono"

    interface Props {
        owns: OwnedProperty[]
        onpropertyselected: (id: number) => void
    }

    const { owns, onpropertyselected: selectProperty }: Props = $props()
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
    {#each owns as p}
        <button
            class="reset property-item"
            onclick={() => selectProperty(p.id)}
        >
            {@render propertyItem(
                properties[p.id].block,
                properties[p.id].name,
                p.houses,
                properties[p.id].rent?.[p.houses]
            )}
        </button>
    {/each}
</div>

<style>
    @import "./property-item.css";
</style>
