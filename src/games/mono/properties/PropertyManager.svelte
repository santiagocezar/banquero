<script module>
    import { crossfade, fade } from "svelte/transition"
    import { expoOut } from "svelte/easing"

    export const [sendCard, receiveCard] = crossfade({
        duration: 400,
        easing: expoOut,
    });
</script>

<script lang="ts">
    import type { Snippet } from "svelte"
    import { slide } from "svelte/transition"
    import { Popover } from "melt/builders"
    
    import IconCheck from "~icons/hugeicons/tick-02"
    import IconAdd from "~icons/hugeicons/add-01"
    import IconRemove from "~icons/hugeicons/remove-01"
    import IconBack from "~icons/hugeicons/arrow-left-01"
    import IconKey from "~icons/hugeicons/key-01"
    import IconLoan from "~icons/hugeicons/save-money-dollar"
    import IconExchange from "~icons/hugeicons/agreement-01"
    import IconHouse from "~icons/hugeicons/house-03"
    import IconMenu from "~icons/hugeicons/menu-01"

    import * as mono from "$games/mono"
    import PropertyCard from "./PropertyCard.svelte"

    interface Props {
        id: number
        ownerships: mono.Ownerships
        onReturn: () => void
        sell: (owner: number, price: number) => void
        chargeRent: (owner: number, price: number) => void
        buyHouses: (owner: number, amount: number, price: number) => void
        mortgage: (owner: number, price: number) => void
        children?: Snippet
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

    const opsPopover = new Popover({
        computePositionOptions: {
            placement: "top",
        },
    })
    
    const buildsPopover = new Popover({
        computePositionOptions: {
            placement: "top",
        },
    })

    let houseCount = $state(ownerships[id]?.houses ?? 0)

    const rentPrice = $derived(mono.rent(ownerships, id))
    
    const houseInc = () => (houseCount = Math.min(5, houseCount + 1))
    const houseDec = () => (houseCount = Math.max(0, houseCount - 1))

    const onRentClick = () => chargeRent(mono.getOwner(ownerships, id), rentPrice)
    const onSellClick = () => sell(mono.getOwner(ownerships, id), prop.price)
    const onHouseConfirmClick = () => buyHouses(mono.getOwner(ownerships, id), houseCount - (ownerships[id]?.houses ?? 0), (prop as {housing: number}).housing)
    const onMortageClick = () => mortgage(mono.getOwner(ownerships, id), prop.price / 2)
</script>

{#snippet houses(count: number, price: number, diff: number)}
    <div class="housing">
        {#if diff != 0}
            <div
                class="confirm plastic-light"
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
                <button class="accent" onclick={onHouseConfirmClick}>
                    <IconCheck />
                </button>
            </div>
        {/if}
        <div class="amount">
            <IconHouse />
            × {count}
            {#if diff != 0}
                <strong>
                {diff < 0 ? "-" : "+"}
                {Math.abs(diff)}
                </strong>
            {/if}
        </div>
        <div class="actions even-row">
            <button onclick={houseDec}><IconRemove /></button>
            <button class="accent" onclick={houseInc}><IconAdd /></button>
        </div>
        <div class="legend">
            Compra: ${price} · Venta: ${price / 2}
        </div>
    </div>
{/snippet}

<section 
    class="palette-dynamic surface-colors"
    style="--base: {prop.color}"
    in:fade={{duration: 200}}
    out:fade={{duration: 100}}
>
    <header class="plastic-pal">
        <nav>
            <button onclick={onReturn} class="flat">
                <IconBack />
            </button>
        </nav>
    </header>

    <div
        class="card"
        in:receiveCard|global={{key: id}}
        out:sendCard|global={{key: id}}
    >
        <PropertyCard {ownerships} {id} />
    </div>

    <div class="op-bar even-row">
        {#if ownerships[id] !== null}
            {#if prop.kind == "lot"}
                <button {...opsPopover.trigger} class="flat vertical">
                    <IconMenu/>
                    <p>Operar</p>
                </button>
                <button {...buildsPopover.trigger} class="flat vertical">
                    <IconHouse/>
                    <p>Construir</p>
                </button>
            {:else}
                <button class="flat vertical" onclick={onSellClick}>
                    <IconExchange/>
                    <p>Vender</p>
                </button>
                <button class="flat vertical" onclick={onMortageClick}>
                    <IconLoan/>
                    <p>Hipotecar</p>
                </button>
            {/if}
            <button class="flat vertical accent" onclick={onRentClick}>
                <IconKey/>
                <p>Cobrar alquiler</p>
            </button>
        {:else}
            <button class="flat vertical" onclick={onSellClick}>
                <IconExchange/>
                <p>Vender</p>
            </button>
        {/if}
    </div>
    {#if prop.kind == "lot" && ownerships[id] !== null}
        <div {...buildsPopover.content} class="plastic menu">
            {@render houses(ownerships[id].houses, prop.housing, houseCount - ownerships[id].houses)}
        </div>
    {/if}
    <div {...opsPopover.content} class="plastic menu">
        <button class="flat" onclick={onSellClick}>
            <IconExchange/>
            <p>Vender</p>
        </button>
        <button class="flat" onclick={onMortageClick}>
            <IconLoan/>
            <p>Hipotecar</p>
        </button>
    </div>
</section>

<style>
    section {
        background-color: var(--bg3);
        
        display: grid;
        grid-template-rows: auto 1fr auto;
        height: 100%;
        position: absolute;
        inset: 0;
    }
    header {
        height: 3rem;
    }

    nav {
        display: flex;
    }

    .card {
        place-self: center;
        z-index: 100;
    }
    .menu {
        margin: .5rem;
    }

    .confirm {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        background-color: var(--bg0);
        border-radius: .25rem;

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
    .op-bar {
        background-image: linear-gradient(to bottom in oklch, var(--bg3), var(--c50));
    }
    .vertical {
        flex-direction: column;
        gap: 0;
        height: 4.5rem;
        padding: .5rem;
    }
    .vertical p {
        place-content: center;
        font-size: .75rem;
        flex-grow: 1;
    }
    .housing {
        display: flex;
        flex-direction: column;
        padding: 1rem;
        gap: 0.5rem;
        width: 20rem;

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
            display: flex;
            
            button {
                width: auto;
            }
        }
    }

    .legend {
        font-size: 0.85rem;
        text-align: center;
    }
</style>
