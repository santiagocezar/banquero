<script lang="ts">
    import { OwnedProperty, properties } from "./index.svelte"

    interface Props {
        owns: OwnedProperty[]
    }

    const { owns }: Props = $props()

    let selected = $state(0)
</script>

<div class="properties">
    <div class="label">Nombre</div>
    <div class="label">Viviendas</div>
    <div class="label">Alquiler</div>
    {#each owns as p, i}
        <button
            class="reset item"
            onclick={() => (selected = i)}
            data-selected={selected == i}
        >
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
        gap: 0 0.5rem;

        & .label {
            font-size: 0.75rem;
            text-align: right;

            &:first-child {
                text-align: left;
            }
        }

        & .item {
            display: grid;
            grid-column: span 3;
            grid-template-columns: subgrid;
            padding: 0.5rem;
            border-radius: 0.5rem;
            align-items: center;

            & .actions {
                grid-column: span 3;
            }

            &[data-selected="true"] {
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
