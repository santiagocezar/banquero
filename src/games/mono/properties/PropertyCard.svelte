<script lang="ts">
    import Icon from "$lib/components/Icon.svelte"
    import * as mono from "$games/mono"
    import { contrast, range } from "$lib/utils.svelte"
    import { slide } from "svelte/transition"

    interface Props {
        id: number
        ownerships: mono.Ownerships
        enableFlow?: boolean
        onclick?: () => void
    }

    const {
        id,
        ownerships,
        enableFlow,
        onclick
    }: Props = $props()

    const prop = $derived(mono.properties[id])

    const rentPrice = $derived(mono.rent(ownerships, id))

    function flow(node: HTMLElement) {
        if (!enableFlow) return
        if (typeof ViewTimeline === "undefined") return
        
        const timeline = new ViewTimeline({
            subject: node,
            axis: 'x',    
        });

        // $li.animate({
        //     zIndex: [ 1, 100, 1 ],
        // }, {
        //     fill: 'both',
        //     timeline,
        // });

        node.animate({
            zIndex: [ 1, 100, 1 ],
        }, {
            fill: 'both',
            timeline,
        });

        const card = node.querySelector(':scope > button')!;

        card.animate([
            { transform: 'translateX(-25%) rotate(10deg) scale(0.8)', offset: 0.0 },
            { transform: '', offset: 0.35 },
            { transform: 'scale(1)', offset: 0.50 },
            { transform: '', offset: 0.65 },
            { transform: 'translateX(25%) rotate(-10deg) scale(0.8)', offset: 1.00 },
        ], {
            fill: 'both',
            timeline,
        });

    }
</script>

{#snippet houses(count: number, price: number)}
    <h3>Viviendas</h3>
    <div class="housing">
        <div class="amount">
            <Icon use="ic-house" />
            × {count}
        </div>
        <div class="legend">
            Compra: ${price} · Venta: ${price / 2}
        </div>
    </div>
{/snippet}

{#snippet row(text: string, value: number, icon?: string)}
    <tr>
        <td>
            <div
                class={{ selected: value === rentPrice }}
            >
                {#if icon}
                    <Icon use={icon} />
                {/if}
                {text}
            </div>
        </td>
        <td>${value}</td>
    </tr>
{/snippet}

<button {onclick} class="reset palette-dynamic card plastic surface-colors" style="--base: {prop.color}">
    <header class="plastic accent">
        {prop.name}
    </header>
    <main>
        <div class="value">
            <p>
                {prop.kind === "service" ? "Cuota" : "Alquiler"}
                $ {rentPrice}
            </p>
            {#if prop.kind === "service"}
                <p>
                    <small>multiplicado el valor de los dados</small>
                </p>    
            {/if}
        </div>
        {#if prop.kind == "lot"}
            <!-- {#if ownerships[id] !== null}
                {@render houses(ownerships[id].houses, prop.housing)}
            {/if} -->
            <table>
                <tbody>
                    {@render row("Alquiler base", prop.rent[0])}
                    {@render row("Con el grupo completo", prop.rent[0] * 2)}
                    {#each range(4) as i}
                        {@render row(`Con ${i + 1} casas`, prop.rent[i + 1], "ic-house")}
                    {/each}
                    {@render row("Con hotel", prop.rent[5], "ic-home-work")}
                </tbody>
            </table>
        {:else if prop.kind == "station"}
            <table>
                <tbody>
                    {#each prop.rent as val, i}
                        {@render row(`Con ${i + 1} ${i == 0 ? "estación" : "estaciones"}`, val, "ic-directions-railway")}
                    {/each}
                </tbody>
            </table>
        {:else}
            <table>
                <tbody>
                    {@render row("Solo este servicio", prop.rent[0])}
                    {@render row("Ambos servicios", prop.rent[1])}
                </tbody>
            </table>
        {/if}

    </main>
    <footer>
        <p>
            Valor de la hipoteca: $ {prop.price / 2}
        </p>
        {#if prop.kind == "lot"}
            <p>
                Cada casa y hotel cuesta: $ {prop.housing}
            </p>
        {/if}
    </footer>
</button>

<style>
    .card {
        display: grid;
        grid-template-rows: auto 1fr auto;
        width: 100%;
        height: 100%;
        transform-origin: bottom;
        height: calc(var(--card-width, 16rem) * 1.414);
        width: var(--card-width, 16rem);
        /* opacity: .5; */
    }

    header {
        display: grid;
        place-content: center;
        line-height: 1.1;
        height: 3rem;
        font-weight: bold;
        text-align: center;
        margin: .5rem;
    }

    .value {
        font-weight: bold;
        text-align: center;
        line-height: 1.2;
    }

    main {
        padding: 0 1rem;
        overflow: auto;
    }
    .housing {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 0.5rem;

        .legend {
            grid-column: span 2;
        }
        .amount {
            font-size: 2rem;
            & :global(svg) {
                width: 48px;
                height: 48px;
            }
        }

        .amount {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .actions {
            padding: 0;
            
            button {
                width: auto;
            }
        }
    }
    table {
        width: 100%;
        font-size: .75rem;
        margin: .75rem 0;

        & .selected {
            font-weight: bold;
        }
    }
    tr {
        height: 1.2rem;
        :global(.icon[data-icon="ic-house"]) {
            color: var(--c60);
        }
        :global(.icon[data-icon="ic-home-work"]) {
            color: var(--k60);
        }
    }
    td {
        vertical-align: middle;

        &:last-child {
            text-align: right;
            font-variant: tabular-nums;
        }

        & > div {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
    }

    footer {
        flex-grow: 1;
        font-size: 0.75rem;
        text-align: center;
        padding: .75rem;
    }
</style>
