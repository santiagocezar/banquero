<script lang="ts">
    import { BANK, OwnedProperty, properties, type Player } from "$mono"
    import SelectProperties from "./SelectProperties.svelte"
    import Icon from "src/components/Icon.svelte"
    import { SvelteSet } from "svelte/reactivity"

    interface Props {
        from: number
        to: number
        players: Player[]
        gives: number[]
        recieves: number[]
        bankProperties: number[]
        houses: number
        changeSeller: () => void
        cancelExchange: () => void
        exchange: (gives: number[], recieves: number[]) => void
    }

    const {
        from: fromID = $bindable(),
        to: toID = $bindable(),
        players,
        gives: givesInitial,
        recieves: recievesInitial,
        houses,
        bankProperties,
        changeSeller,
        cancelExchange,
        exchange,
    }: Props = $props()

    let value = $state(0)

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
    const from = $derived(players[fromID] ?? bank)
    const to = $derived(players[toID] ?? bank)

    let gives = $state(new SvelteSet(givesInitial))
    let recieves = $state(new SvelteSet(recievesInitial))

    function askConfirm(ev: Event) {
        // TODO: actually ask
        exchange(Array.from(gives), Array.from(recieves))
        ev.preventDefault()
    }
</script>

<form action="#" onsubmit={askConfirm} class="pal-{from.color}">
    <header class="plastic auto-pal">
        <nav>
            <button onclick={cancelExchange}>
                <Icon use="ic-arrow-back" />
            </button>
            <p>
                <strong>{from.name}</strong>
                <small>le transfiere</small>
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
                    bind:value
                    autofocus={true}
                    onfocus={(e) => (e.target as HTMLInputElement).select()}
                />
            </label>
        </div>
        <button
            class="to pal-{to.color} plastic auto-pal"
            onclick={changeSeller}
        >
            <p>{toID === BANK ? "Al banco" : "a " + to.name}</p>
            <Icon aria-label="Cambiar" use="ic-swap-horiz" />
        </button>
    </header>
    <main>
        <h3>
            <span class="pal-{from.color}">{from.name}</span>
            transfiere
        </h3>
        <SelectProperties player={from} bind:selected={gives} />
        <h3>
            <span class="pal-{to.color}">{to.name}</span>
            transfiere
        </h3>
        <SelectProperties player={to} bind:selected={recieves} />
        <button type="submit">
            <Icon use="ic-payments" />
            Aceptar
        </button>
    </main>
</form>

<style>
    @import "../../foreheader.css";

    .pal--1 {
        /* TODO: dark mode */

        --p10: #efeffb;
        --p30: #8e92bb;
        --p40: #55598f;
        --p50: #2f3150;
        --p70: #080a15;
        --p90: #efeffb;
        --contrast: "white";
    }
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
