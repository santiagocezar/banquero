<script lang="ts">
    import { OwnedProperty, properties } from "$mono"

    interface Props {
        owns: OwnedProperty[]
        onpropertyselected: (id: number) => void
    }

    const { owns, onpropertyselected: selectProperty }: Props = $props()
</script>

<div class="properties">
    <div class="labels">
        <span>Nombre</span>
        <span>Viviendas</span>
        <span>Alquiler</span>
    </div>
    {#each owns as p}
        <button class="reset item" onclick={() => selectProperty(p.id)}>
            <div class="name">
                <div style="--c: {properties[p.id].block}"></div>
                <span>
                    {properties[p.id].name}
                </span>
            </div>
            <div class="houses">{p.houses}</div>
            <div class="rent">${properties[p.id].rent?.[p.houses]}</div>
        </button>
    {/each}
</div>

<style>
    .properties {
        display: grid;
        grid-template-columns: 1fr auto auto;
        gap: 0 1rem;

        & .labels {
            font-size: 0.8rem;
            font-weight: bold;
            text-align: right;
            padding: 1rem;
            display: grid;
            grid-template-columns: subgrid;
            grid-column: span 3;

            &:first-child {
                text-align: left;
            }
        }

        & .item {
            display: grid;
            grid-column: span 3;
            grid-template-columns: subgrid;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            align-items: center;

            &:hover {
                background-color: var(--p10);
            }
        }

        & .name {
            display: flex;
            height: 2.5rem;
            gap: 0.5rem;
            align-items: center;

            & div {
                background-color: var(--c);
                width: 0.25rem;
                height: 100%;
                border-radius: 0.125rem;
                flex-shrink: 0;
            }
            & span {
                font-size: 0.75rem;
            }
        }
        & .houses {
            text-align: right;
        }
        & .rent {
            text-align: right;
            font-variant: tabular-nums;
        }
    }
</style>
