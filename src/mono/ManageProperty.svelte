<script lang="ts">
    import Icon from "../components/Icon.svelte"
    import { OwnedProperty, properties } from "./index.svelte"
    import { contrast, range } from "../lib/utils.svelte"

    interface Props {
        owned: OwnedProperty
    }

    const { owned }: Props = $props()

    const prop = $derived(properties[owned.id])
</script>

<section style="--c: {prop.block}" use:contrast={prop.block}>
    <header>
        <nav>
            <button>
                <Icon use="ic-arrow-back" />
            </button>
            {prop.name}
        </nav>
        <div class="value">
            <p>Alquiler</p>
            <p>${prop.rent?.[owned.houses]}</p>
        </div>
        <button class="stripe">
            <Icon use="ic-payments" />
            Cobrar alquiler
        </button>
    </header>
    <main>
        {#if prop.housing !== undefined}
            <h3>Viviendas</h3>
            <div class="housing">
                <div class="amount">
                    <Icon use="ic-house" />
                    × {owned.houses}
                </div>
                <div class="actions">
                    <button><Icon use="ic-remove" /></button>
                    <button><Icon use="ic-add" /></button>
                </div>
                <div class="legend">
                    Compra: ${prop.housing} · Venta: ${prop.housing / 2}
                </div>
                <div class="confirm">
                    <div>
                        <p>Compra 3 casas</p>
                        <p>${prop.housing * 3}</p>
                    </div>
                    <button>
                        <Icon use="ic-check" />
                    </button>
                </div>
                <table>
                    <tbody>
                        <tr>
                            <td>Alquiler base</td>
                            <td>${prop.rent![0]}</td>
                        </tr>
                        <tr>
                            <td>Con el grupo completo</td>
                            <td>${prop.rent![0] * 2}</td>
                        </tr>
                        {#each range(4) as i}
                            <tr>
                                <td>
                                    <div>
                                        <Icon class="house" use="ic-house" />
                                        Con {i + 1} casas
                                    </div>
                                </td>
                                <td>${prop.rent![i + 1]}</td>
                            </tr>
                        {/each}
                        <tr>
                            <td>
                                <div>
                                    <Icon class="hotel" use="ic-home-work" />
                                    Con hotel
                                </div>
                            </td>
                            <td>${prop.rent![5]}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        {/if}

        <h3>Operaciones</h3>
        <div class="actions">
            <button>Transferir</button>
            <button>Hipotecar</button>
        </div>
        <div class="legend">
            Valor de la hipoteca: ${prop.price / 2}
        </div>
    </main>
</section>

<style>
    section {
        display: grid;
        grid-template-rows: 2fr 3fr;
        height: 100%;
        overflow: hidden;
        & button {
            background-color: var(--c);
            color: var(--contrast);
        }
    }
    header {
        /*         background-color: color-mix(in hsl, white, var(--c) 25%); */
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr auto;
        gap: 0 0.5rem;
        text-align: center;

        & nav {
            display: flex;
            text-align: left;
            gap: 1rem;
            line-height: 1;
            align-items: center;
            font-weight: bold;
        }
        & .value {
            text-align: center;
            place-self: center;
            margin-top: -2rem;

            & p:last-child {
                font-variant: tabular-nums;
                font-weight: 300;
                font-size: 3.5rem;
                line-height: 1;
            }
        }
    }
    header,
    .confirm {
        background-color: var(--c);
        color: var(--contrast);
        padding: 0.5rem;
    }
    header .stripe,
    .confirm button {
        background-color: var(--contrast);
        color: var(--c);
    }
    .confirm {
        display: flex;
        align-items: center;
        border-radius: 0.5rem;

        & > div {
            padding-left: 0.25rem;
            flex-grow: 1;
            line-height: 1.1;

            font-size: 1.25rem;
            font-variant: tabular-nums;

            & p:first-child {
                font-size: 1rem;
                font-weight: bold;
            }
        }
    }
    h3 {
        font-size: 1.25rem;
        font-weight: bold;
        padding: 0.5rem 0.25rem;
    }
    main {
        padding: 0 0.5rem;
        overflow: auto;
    }
    .housing {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 0.5rem;

        table,
        .legend,
        .confirm {
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
            button {
                width: auto;
            }
        }
        tr {
            height: 2rem;
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
        :global(.house) {
            color: var(--red);
        }
        :global(.hotel) {
            color: var(--blue);
        }
    }
    .actions {
        display: flex;
        gap: 0.5rem;

        button {
            width: 0;
            flex: 1;
        }
    }
    .legend {
        font-size: 0.85rem;
        text-align: center;
    }
</style>
