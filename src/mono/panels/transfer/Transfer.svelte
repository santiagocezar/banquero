<script lang="ts">
    import * as mono from "$mono"
    import { propertyItem } from "$mono/Properties.svelte"
    import SelectProperties from "./SelectProperties.svelte"
    import Icon from "src/components/Icon.svelte"
    import { SvelteSet } from "svelte/reactivity"

    interface Props {
        players: Map<number, mono.Player>
        ownerships: mono.Ownerships
        cancelExchange: () => void
        confirmExchange: (value: mono.Exchange) => void
        exchange: mono.Exchange
    }

    const {
        players,
        ownerships,
        cancelExchange,
        confirmExchange,
        exchange = $bindable(),
    }: Props = $props()
    
    const initialAmount = exchange.amount
    console.log(initialAmount)

    const pays = $derived(
        exchange.pays !== null
            ? (players.get(exchange.pays) ?? mono.BANK)
            : null
    )
    const charges = $derived(
        exchange.charges !== null
            ? (players.get(exchange.charges) ?? mono.BANK)
            : null
    )
    const forced = $derived(exchange.houses != 0 || exchange.mortgage.length > 0)
    
    let sell = $state(new SvelteSet(exchange.sell))
    let buy = $state(new SvelteSet(exchange.buy))

    $effect(() => {
        let amount = initialAmount
        for (const p of buy.values()) {
            amount += mono.properties[p].price
        }
        for (const p of sell.values()) {
            amount -= mono.properties[p].price
        }
        exchange.amount = Math.max(amount, 0)
    })

    function askConfirm(ev: Event) {
        // TODO: actually ask
        confirmExchange({
            ...exchange,
            sell: Array.from(sell),
            buy: Array.from(buy),
        })
        ev.preventDefault()
    }

    function switchPaying() {
        exchange.pays = null
    }
    function switchCharging() {
        exchange.charges = null
    }
</script>

<section>
    <header class="plastic">
        <nav>
            <button type="button" onclick={cancelExchange}>
                <Icon use="ic-close" />
            </button>
            <p>
                Transferir
            </p>
        </nav>
        <div class="set-left pal-{pays?.color}">
            <div class="gradient pal-{charges?.color}"></div>
        </div>
        <form action="#" onsubmit={askConfirm}>
            <div class="value">
                <label class="big">
                    $
                    <!-- svelte-ignore a11y_autofocus -->
                    <input
                        type="number"
                        class="big"
                        inputMode="numeric"
                        bind:value={exchange.amount}
                        autofocus={true}
                        disabled={forced}
                        onfocus={(e) => (e.target as HTMLInputElement).select()}
                    />
                </label>
            </div>
            <div class="actions">
                <button
                    type="button"
                    class="player pal-{pays?.color} plastic-pal"
                    onclick={switchPaying}
                    disabled={forced}
                >
                    <p>{pays?.name ?? "—"}</p>
                    <Icon aria-label="Cambiar" use="ic-swap-horiz" />
                </button>
                <button
                    type="button"
                    class="player pal-{charges?.color} plastic-pal"
                    onclick={switchCharging}
                    disabled={forced}
                >
                    <p>{charges?.name ?? "—"}</p>
                    <Icon aria-label="Cambiar" use="ic-swap-horiz" />
                </button>
            </div>
            <div class="actions">
                <button
                    disabled={!pays || !charges}
                    type="submit"
                    class="plastic"
                >
                    <Icon use="ic-payments" />
                    Aceptar
                </button>
            </div>
        </form>
    </header>
    <main>
        {#if exchange.houses != 0}
            <h3>
                <span class="pal-{charges!.color}">{charges?.name}</span>
                entrega
            </h3>
            <p class="extra">{Math.abs(exchange.houses)} casa{Math.abs(exchange.houses) === 1 ? "" : "s"} para</p>
            <div class="properties">
            <div class="property-item">
                {@render propertyItem(
                    mono.properties[exchange.housesFor].color,
                    mono.properties[exchange.housesFor].name, 
                    mono.properties[exchange.housesFor].price
                )}
            </div>
            </div>
        {:else}
            {#if charges}
                <h3>
                    <span class="pal-{charges?.color}">{charges.name}</span>
                    entrega
                </h3>
                <SelectProperties
                    player={charges}
                    {ownerships}
                    bind:selected={buy}
                />
            {/if}
            {#if pays}
                <h3>
                    <span class="pal-{pays?.color}">{pays.name}</span>
                    entrega
                </h3>
                <SelectProperties player={pays} {ownerships} bind:selected={sell} />
            {/if}
        {/if}
    </main>
</section>

<style>
    @import "../../foreheader.css";
    @import "../../property-item.css";

    form {
        display: contents;
    }
    header {
        --shadow-parent: var(--shadow);

        position: relative;
        background-image: linear-gradient(to top, transparent, var(--bg0) 75%);
        overflow: hidden;
        padding: 0.5rem;

        & nav {
            font-size: 1.5rem;
        }
        & .value {
            width: 100%;
            text-align: left;
            justify-items: start;
            margin-top: 0;
            padding: 1rem;
        }
    }

    .player {
        display: grid;
        grid-template-columns: 1fr auto;
        background-color: var(--p50);

        color: var(--contrast);
        --height: 3.5rem;
        --shadow: var(--shadow-parent);

        & p {
            align-self: center;
            justify-self: start;
            font-size: 1.5rem;
            font-weight: bold;
        }
    }
    main {
        padding: 0 1rem;
        overflow: auto;
    }
    .big {
        display: flex;
        align-items: center;

        & input {
            width: 100%;
            background: none;
            border-top: 0.125rem solid transparent;
            border-bottom: 0.125rem solid currentColor;
            
            &:disabled {
                border-color: transparent;
            }
        }
    }
    .extra {
        font-size: 1.5rem;
        margin-bottom: .25em;
    }
    .properties {
        margin: 0 -1rem;
    }
    span[class^="pal-"] {
        color: var(--p50);
    }
    @property --p50 {
        syntax: '<color>';
        initial-value: transparent;
        inherits: true;
    }

    .set-left {
        position: absolute;
        inset: 0;
        z-index: -1;
        --left-color: var(--p50, transparent);
        transition: --p50 .5s;
    }
    .gradient {
        width: 100%;
        height: 100%;
        --right-color: var(--p50, transparent);
        background-image: linear-gradient(in oklch to right, var(--left-color), var(--right-color));
        transition: --p50 .5s;
    }
</style>
