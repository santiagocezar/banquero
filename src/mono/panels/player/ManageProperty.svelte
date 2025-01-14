<script lang="ts">
    import Icon from "src/components/Icon.svelte"
    import { OwnedProperty, properties, rent } from "$mono"
    import { contrast, range } from "$lib/utils.svelte"

    interface Props {
        owned: OwnedProperty
        sameBlock: number
        onreturn: () => void
        chargeRent: (price: number) => void
        sell: (price: number) => void
        buyHouses: (amount: number, price: number) => void
        mortgage: (price: number) => void
    }

    const {
        owned,
        onreturn: goBack,
        sameBlock,
        chargeRent,
        sell,
        buyHouses,
        mortgage,
    }: Props = $props()

    const prop = $derived(properties[owned.id])

    let houses = $state(owned.houses)

    const houseInc = () => (houses = Math.min(5, houses + 1))
    const houseDec = () => (houses = Math.max(0, houses - 1))

    const houseDiff = $derived(houses - owned.houses)
    const rentPrice = $derived(rent(owned, sameBlock))

    const onRentClick = () => chargeRent(rentPrice)
    const onSellClick = () => sell(prop.price)
    const onHouseConfirmClick = () => buyHouses(houseDiff, (prop as {housing: number}).housing)
    const onMortageClick = () => mortgage(prop.price / 2)
</script>

<section class="pal-gen" style="--pal-gen-color: {prop.block}">
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
            <h3>Viviendas</h3>
            <div class="housing">
                <div class="amount">
                    <Icon use="ic-house" />
                    × {owned.houses}
                    {#if houseDiff != 0}
                        {houseDiff < 0 ? "-" : "+"}
                        {Math.abs(houseDiff)}
                    {/if}
                </div>
                <div class="actions">
                    <button onclick={houseDec}><Icon use="ic-remove" /></button>
                    <button onclick={houseInc}><Icon use="ic-add" /></button>
                </div>
                <div class="legend">
                    Compra: ${prop.housing} · Venta: ${prop.housing / 2}
                </div>
                {#if houseDiff != 0}
                    <div class="confirm">
                        <div>
                            <p>
                                {houseDiff < 0 ? "Vender" : "Comprar"}
                                {Math.abs(houseDiff)} casa{Math.abs(
                                    houseDiff
                                ) == 1
                                    ? ""
                                    : "s"}
                            </p>
                            <p>
                                ${(prop.housing * Math.abs(houseDiff)) /
                                    (houseDiff < 0 ? 2 : 1)}
                            </p>
                        </div>
                        <button onclick={onHouseConfirmClick}>
                            <Icon use="ic-check" />
                        </button>
                    </div>
                {/if}
            </div>
            <h3>Valores</h3>
            <table>
                <tbody>
                    <tr>
                        <td
                            class={{
                                selected:
                                    owned.houses === 0 &&
                                    prop.count !== sameBlock,
                            }}>Alquiler base</td
                        >
                        <td>${prop.rent![0]}</td>
                    </tr>
                    <tr>
                        <td
                            class={{
                                selected:
                                    owned.houses === 0 &&
                                    prop.count === sameBlock,
                            }}>Con el grupo completo</td
                        >
                        <td>${prop.rent![0] * 2}</td>
                    </tr>
                    {#each range(4) as i}
                        <tr>
                            <td>
                                <div
                                    class={{ selected: i + 1 === owned.houses }}
                                >
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
        {:else if prop.kind == "station"}
            <h3>Valores</h3>
            <table>
                <tbody>
                    {#each prop.rent as val, i}
                        <tr>
                            <td>
                                <div class={{ selected: i == sameBlock - 1 }}>
                                    <Icon use="ic-directions-railway" />
                                    Con {i + 1}
                                    {i == 0 ? "estación" : "estaciones"}
                                </div>
                            </td>
                            <td>${val}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {:else}
            <h3>Valores</h3>
            <table>
                <tbody>
                    <tr>
                        <td class={{ selected: sameBlock === 1 }}>
                            Solo este servicio
                        </td>
                        <td>${prop.rent[0]}</td>
                    </tr>
                    <tr>
                        <td class={{ selected: sameBlock === 2 }}>
                            Ambos servicios
                        </td>
                        <td>${prop.rent[1]}</td>
                    </tr>
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
        background-color: var(--c);
        color: var(--contrast);

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
            button {
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

    .legend {
        font-size: 0.85rem;
        text-align: center;
    }
</style>
