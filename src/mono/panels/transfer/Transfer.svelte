<script lang="ts">
    import {
        BANK,
        OwnedProperty,
        properties,
        type Exchange,
        type Player,
    } from "$mono"
    import SelectProperties from "./SelectProperties.svelte"
    import Icon from "src/components/Icon.svelte"
    import { SvelteSet } from "svelte/reactivity"

    interface Props {
        players: Player[]
        bankProperties: number[]
        houses: number
        cancelExchange: () => void
        confirmExchange: (value: Exchange) => void
        exchange: Exchange
    }

    const {
        players,
        bankProperties,
        cancelExchange,
        confirmExchange,
        exchange = $bindable(),
    }: Props = $props()

    const bank: Player = $derived({
        name: "El banco",
        color: -1,
        money: 0,
        properties: bankProperties.map((id) => ({
            id,
            houses: 0,
            mortgaged: false,
        })),
    })
    const pays = $derived(
        exchange.pays !== null ? (players[exchange.pays] ?? bank) : null
    )
    const charges = $derived(
        exchange.charges !== null ? (players[exchange.charges] ?? bank) : null
    )

    let sell = $state(new SvelteSet(exchange.sell))
    let buy = $state(new SvelteSet(exchange.buy))

    function askConfirm(ev: Event) {
        // TODO: actually ask
        confirmExchange({
            ...exchange,
            sell: Array.from(sell),
            buy: Array.from(buy),
        })
        ev.preventDefault()
    }

    function switchCharging() {
        exchange.charges = null
    }
</script>

<form action="#" onsubmit={askConfirm} class="pal-{pays?.color}">
    <header class="plastic-pal">
        <nav>
            <button onclick={cancelExchange}>
                <Icon use="ic-arrow-back" />
            </button>
            <p>
                {#if pays}
                    <strong>{pays.name}</strong>
                    <small>le paga</small>
                {:else}
                    <strong>—</strong>
                {/if}
            </p>
        </nav>
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
                    onfocus={(e) => (e.target as HTMLInputElement).select()}
                />
            </label>
        </div>
        <button
            class="to pal-{charges?.color} plastic-pal"
            onclick={switchCharging}
        >
            {#if charges}
                <p>
                    {exchange.charges === BANK
                        ? "Al banco"
                        : "a " + charges.name}
                </p>
            {:else}
                <p>—</p>
            {/if}
            <Icon aria-label="Cambiar" use="ic-swap-horiz" />
        </button>
    </header>
    <main>
        {#if charges}
            <h3>
                <span class="pal-{charges?.color}">{charges.name}</span>
                entrega
            </h3>
            <SelectProperties player={charges} bind:selected={buy} />
        {/if}
        {#if pays}
            <h3>
                <span class="pal-{pays?.color}">{pays.name}</span>
                entrega
            </h3>
            <SelectProperties player={pays} bind:selected={sell} />
        {/if}
        {#if pays && charges}
            <button type="submit">
                <Icon use="ic-payments" />
                Aceptar
            </button>
        {/if}
    </main>
</form>

<style>
    @import "../../foreheader.css";

    header {
        --shadow-parent: var(--shadow);

        background-color: var(--p50);
        color: var(--contrast);
        padding: 0.5rem;

        & nav {
            font-size: 1.5rem;
            font-weight: normal;
        }
        & .value {
            width: 100%;
            text-align: left;
            justify-items: start;
            margin-top: 0;
            padding: 1rem;
        }
    }

    .to {
        display: grid;
        grid-template-columns: 1fr auto;
        background-color: var(--p50);

        color: var(--contrast);
        --height: 4rem;
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
            border-bottom: 0.125rem solid currentColor;
        }
    }
    span[class^="pal-"] {
        color: var(--p50);
    }
</style>
