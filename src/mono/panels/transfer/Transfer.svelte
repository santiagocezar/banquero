<script lang="ts">
    import * as mono from "$mono"
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
    
    const pays = $derived(
        exchange.pays !== null ? (players.get(exchange.pays) ?? mono.BANK) : null
    )
    const charges = $derived(
        exchange.charges !== null ? (players.get(exchange.charges) ?? mono.BANK) : null
    )

    let sell = $state(new SvelteSet(exchange.sell))
    let buy = $state(new SvelteSet(exchange.buy))

    $inspect({sell, buy})
    
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

<section class="pal-{pays?.color}">
    <header class="plastic-pal">
        <nav>
            <button type="button" onclick={cancelExchange}>
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
                        onfocus={(e) => (e.target as HTMLInputElement).select()}
                    />
                </label>
            </div>
            <button
                type="button"
                class="to pal-{charges?.color} plastic-pal"
                onclick={switchCharging}
            >
                {#if charges}
                    <p>
                        {charges === mono.BANK
                            ? "Al banco"
                            : "a " + charges.name}
                    </p>
                {:else}
                    <p>—</p>
                {/if}
                <Icon aria-label="Cambiar" use="ic-swap-horiz" />
            </button>
            <div class="actions">
                <button disabled={!pays || !charges} type="submit" class="plastic-pal">
                    <Icon use="ic-payments" />
                    Aceptar
                </button>
            </div>
        </form>
    </header>
    <main>
        {#if charges}
            <h3>
                <span class="pal-{charges?.color}">{charges.name}</span>
                entrega
            </h3>
            <SelectProperties player={charges} {ownerships} bind:selected={buy} />
        {/if}
        {#if pays}
            <h3>
                <span class="pal-{pays?.color}">{pays.name}</span>
                entrega
            </h3>
            <SelectProperties player={pays} {ownerships} bind:selected={sell} />
        {/if}
    </main>
</section>

<style>
    @import "../../foreheader.css";

    form {
        display: contents;
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
