<script lang="ts">
    import * as mono from "$game"
    import { sideEffect } from "$lib/utils.svelte"
    import { propertyItem } from "$game/Properties.svelte"
    import SelectProperties from "./SelectProperties.svelte"
    import Icon from "$lib/components/Icon.svelte"
    import { SvelteSet } from "svelte/reactivity"

    interface Props {
        ownerships: mono.Ownerships
        pays: mono.Player | null
        charges: mono.Player | null
        defaultAmount: number,
        defaultSell: number | null,
        onSwitchClick: (who: "pays" | "charges") => void
        onCancel: () => void
        onSubmit: (value: mono.Exchange) => void
    }

    const {
        ownerships,
        pays,
        charges,
        defaultAmount,
        defaultSell,
        onSwitchClick,
        onCancel,
        onSubmit,
    }: Props = $props()
    
    let amount = $state(defaultAmount)
    let payerSells = $state(new SvelteSet([]))
    let chargerSells = $state(new SvelteSet(defaultSell === null ? [] : [defaultSell]))
    
    sideEffect(() => pays, () => payerSells.clear())
    sideEffect(() => charges, () => chargerSells.clear())
    
    // const forced = $derived(exchange.houses != 0 || exchange.mortgage.length > 0)
    const forced = false
    
    $effect(() => {
        let newAmount = defaultAmount
        for (const p of chargerSells.values()) {
            newAmount += mono.properties[p].price
        }
        for (const p of payerSells.values()) {
            newAmount -= mono.properties[p].price
        }
        amount = Math.max(newAmount, 0)
    })

    $inspect(amount)
    
    function askConfirm(ev: Event) {
        if (pays === null || charges === null) {
            return
        }
        
        // TODO: actually ask
        onSubmit({
            pays: {
                id: pays.id,
                sells: Array.from(payerSells)
            },
            charges: {
                id: charges.id,
                sells: Array.from(chargerSells)
            },
            amount,
            buildings: 0,
            buildingsFor: 0,
            liftMortgage: [],
            mortgage: [],
        })
        ev.preventDefault()
    }

    function switchPaying() {
        onSwitchClick("pays")
    }
    function switchCharging() {
        onSwitchClick("charges")
    }
</script>

<section>
    <header class="plastic set-left pal-{pays?.color}">
        <nav>
            <button type="button" onclick={onCancel}>
                <Icon use="ic-close" />
            </button>
            <p>
                Transferir
            </p>
        </nav>
        <div class="gradient pal-{charges?.color}"></div>
        <form action="#" onsubmit={askConfirm}>
            <div class="value">
                <label class="big">
                    $
                    <!-- svelte-ignore a11y_autofocus -->
                    <input
                        type="number"
                        class="big"
                        inputMode="numeric"
                        bind:value={amount}
                        autofocus={true}
                        disabled={forced}
                        onfocus={(e) => (e.target as HTMLInputElement).select()}
                    />
                </label>
            </div>
            <div class="even-row">
                <button
                    type="button"
                    class="player pal-{pays?.color} plastic"
                    onclick={switchPaying}
                    disabled={forced}
                >
                    <p>{pays?.name ?? "···"}</p>
                    <Icon aria-label="Cambiar" use="ic-swap-horiz" />
                </button>
                <button
                    type="button"
                    class="player pal-{charges?.color} plastic"
                    onclick={switchCharging}
                    disabled={forced}
                >
                    <p>{charges?.name ?? "···"}</p>
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
    <!--    {#if exchange.houses != 0}
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
        {:else}-->
            {#if charges}
                <h3>
                    <span class="pal-{charges?.color}">{charges.name}</span>
                    entrega
                </h3>
                <SelectProperties
                    player={charges}
                    {ownerships}
                    bind:selected={chargerSells}
                />
            {/if}
            {#if pays}
                <h3>
                    <span class="pal-{pays?.color}">{pays.name}</span>
                    entrega
                </h3>
                <SelectProperties 
                    player={pays}
                    {ownerships} 
                    bind:selected={payerSells}
                />
            {/if}
<!--         {/if} -->
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
        background-image: linear-gradient(to bottom, var(--p90) 25%, transparent 100%);
        background-color: transparent !important;
        overflow: hidden;
        padding: 0.5rem;

        & .even-row {
            padding: .5rem;
            gap: .5rem;
        }
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
        --left-color: var(--p50, transparent);
        transition: --p50 .5s;
    }
    .gradient {
        position: absolute;
        inset: 0;
        z-index: -1;
        width: 100%;
        height: 100%;
        --right-color: var(--p50, transparent);
        background-image: radial-gradient(in oklch circle at 70%, var(--right-color) 25%, var(--left-color) 100%);
        transition: --p50 .5s;
    }
</style>
