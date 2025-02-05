<script lang="ts">
    import Icon from "src/components/Icon.svelte"
    import * as mono from "$mono"
    import { contrast, range } from "$lib/utils.svelte"
    import { slide } from "svelte/transition"

    interface Props {
        id: number
        ownerships: mono.Ownerships
        onReturn: (player: number) => void
        sell: (owner: number, price: number) => void
        chargeRent: (owner: number, price: number) => void
        buyHouses: (owner: number, amount: number, price: number, housesFor: number) => void
        mortgage: (owner: number, price: number) => void
    }

    const {
        id,
        ownerships,
        onReturn,
        chargeRent,
        sell,
        buyHouses,
        mortgage,
    }: Props = $props()

    const prop = $derived(mono.properties[id])

    let houseCount = $state(ownerships[id]?.houses ?? 0)

    const rentPrice = $derived(mono.rent(ownerships, id))
    
    const houseInc = () => (houseCount = Math.min(5, houseCount + 1))
    const houseDec = () => (houseCount = Math.max(0, houseCount - 1))

    const onRentClick = () => chargeRent(rentPrice)
    const onSellClick = () => sell(mono.getOwner(ownerships, id), prop.price)
    const onHouseConfirmClick = () => buyHouses(houseCount - (ownerships[id]?.houses ?? 0), (prop as {housing: number}).housing, id)
    const onMortageClick = () => mortgage(prop.price / 2)
    
    const goBack = () => onReturn(mono.getOwner(ownerships, id))
</script>

{#snippet houses(count: number, price: number, diff: number)}
    <h3>Viviendas</h3>
    <div class="housing">
        <div class="amount">
            <Icon use="ic-house" />
            × {count}
            {#if diff != 0}
                <strong>
                {diff < 0 ? "-" : "+"}
                {Math.abs(diff)}
                </strong>
            {/if}
        </div>
        <div class="actions plastic-pal">
            <button onclick={houseDec}><Icon use="ic-remove" /></button>
            <button class="plastic-pal" onclick={houseInc}><Icon use="ic-add" /></button>
        </div>
        <div class="legend">
            Compra: ${price} · Venta: ${price / 2}
        </div>
        {#if diff != 0}
            <div
            class="confirm"
                out:slide={{duration: 100}}
                in:slide={{duration: 100}}
                >
                <div>
                    <p>
                        {diff < 0 ? "Vender" : "Comprar"}
                        {Math.abs(diff)} casa{Math.abs(
                            diff
                        ) == 1
                            ? ""
                            : "s"}
                    </p>
                    <p>
                        ${(price * Math.abs(diff)) /
                            (diff < 0 ? 2 : 1)}
                    </p>
                </div>
                <button class="plastic-pal" onclick={onHouseConfirmClick}>
                    <Icon use="ic-check" />
                </button>
            </div>
        {/if}
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

<section class="pal-gen" style="--pal-gen-color: {prop.color}">
    <header class="plastic-pal">
        <nav>
            <button onclick={goBack}>
                <Icon use="ic-arrow-back" />
            </button>
            {prop.name}
        </nav>
        <div class="value">
            <p>{prop.kind === "service" ? "Cuota" : "Alquiler"}</p>
            <p class="big">${rentPrice}</p>
            {#if prop.kind === "service"}
                <p>multiplicado el valor de los dados</p>
            {/if}
        </div>
        <div class="actions">
            <button class="plastic" onclick={onRentClick}>
                <Icon use="ic-payments" />
                Cobrar alquiler
            </button>
        </div>
    </header>
    <main>
        {#if prop.kind == "lot"}
            {#if ownerships[id] !== null}
                {@render houses(houseCount, prop.housing, houseCount - ownerships[id].houses)}
            {/if}
            <h3>Valores</h3>
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
            <h3>Valores</h3>
            <table>
                <tbody>
                    {#each prop.rent as val, i}
                        {@render row(`Con ${i + 1} ${i == 0 ? "estación" : "estaciones"}`, val, "ic-directions-railway")}
                    {/each}
                </tbody>
            </table>
        {:else}
            <h3>Valores</h3>
            <table>
                <tbody>
                    {@render row("Solo este servicio", prop.rent[0])}
                    {@render row("Ambos servicios", prop.rent[1])}
                </tbody>
            </table>
        {/if}

        <h3>Operaciones</h3>
        <div class="actions">
            <button class="plastic-pal" onclick={onSellClick}>
                <Icon use="ic-sell" />
                Vender
            </button>
            <button class="plastic-pal" onclick={onMortageClick}
                ><Icon use="ic-real-estate-agent" />
                Hipotecar
            </button>
        </div>
        <div class="legend">
            Valor de la hipoteca: ${prop.price / 2}
        </div>
    </main>
</section>

<style>
    @import "../../foreheader.css";

    section {
        & button {
            background-color: var(--p50);
            color: white;
        }
    }
    header {
        background-color: var(--p50);
        color: white;
    }

    .confirm button {
        background-color: var(--contrast);
        color: var(--c);
    }
    .confirm {
        display: flex;
        align-items: center;
        border-radius: 0.5rem;
        padding: 0.5rem;
        background-color: color-mix(in srgb, var(--p50), transparent 75%);

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
        & button {
            background-color: var(--p50); /* FIXME: seems redundant */
        }
    }
    main {
        padding: 0 1rem;
        overflow: auto;
    }
    .housing {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 0.5rem;

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
            gap: 0;
            padding: 0;
            background-color: var(--p70);
            --dark: var(--p80);
            
            button {
                &:last-child {
                    border-right: inherit;
                    background-color: var(--p50);
                }

                background: none;
                color: inherit;
                width: auto;
            }
        }
    }
    table {
        width: 100%;

        & .selected {
            font-weight: bold;
        }
    }
    tr {
        height: 2rem;
        :global(.icon[data-icon="ic-house"]) {
            color: var(--red);
        }
        :global(.icon[data-icon="ic-home-work"]) {
            color: var(--blue);
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

    .legend {
        font-size: 0.85rem;
        text-align: center;
    }
</style>
