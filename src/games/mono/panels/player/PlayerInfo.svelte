<script lang="ts">
    import Properties from "$game/Properties.svelte"
    import Icon from "$lib/components/Icon.svelte"
    import { createTabs, melt } from "@melt-ui/svelte"
    import * as mono from "$game"

    interface Props {
        player: mono.Player
        ownerships: mono.Ownerships
        onPropertyClick: (id: number) => void
        onRemoveClick: () => void
        onReturn: () => void
        pay: () => void
        charge: () => void
    }

    const {
        elements: { root, list, content, trigger },
        states: { value },
    } = createTabs({
        defaultValue: "properties",
    })

    const tabs = [
        { id: "properties", title: "Propiedades" },
        { id: "history", title: "Movimientos" },
    ]

    const {
        player,
        ownerships,
        onPropertyClick,
        onRemoveClick,
        onReturn,
        pay,
        charge
    }: Props = $props()
</script>

<section class="pal-{player.color}">
    <header class="plastic">
        <nav>
            <button onclick={onReturn}>
                <Icon use="ic-arrow-back" />
            </button>
            <h2>{player.name}</h2>
            <button onclick={onRemoveClick}>
                <Icon use="ic-delete" />
            </button>
        </nav>
        {#if player === mono.BANK}
                <Icon class="bank" use="ic-account-balance" />
        {:else}
        <div class="value">
            <p>Balance</p>
            <p class="big">${player.money}</p>
        </div>
        {/if}
                
        <div class="actions">
            <button onclick={() => pay()} class="plastic">
                <Icon use="ic-upload" />
                Pagar
            </button>
            <button onclick={() => charge()} class="plastic">
                <Icon use="ic-download" />
                Cobrar
            </button>
        </div>
    </header>
    <main use:melt={$root}>
        <div
            use:melt={$list}
            class="tablist"
            aria-label="Información del jugador"
        >
            {#each tabs as tab}
                <button use:melt={$trigger(tab.id)}>
                    {tab.title}
                </button>
            {/each}
        </div>

        <div class="tabview" use:melt={$content("properties")}>
            <Properties {ownerships} owner={player.id} onpropertyselected={onPropertyClick} displayPrice={player === mono.BANK} />
        </div>
        <div class="tabview" use:melt={$content("history")}></div>
    </main>
</section>

<style>
    @import "../../foreheader.css";

    main {
        display: grid;
        grid-template-rows: auto 1fr;
        overflow: hidden;
        max-height: 100%;
    }
    header {
        background-color: var(--p50);
        color: var(--contrast);
        padding: 0.5rem;

        --border: var(--p90);
        --bevel: var(--p70);

        & nav {
            font-size: 1.5rem;
        }
        & :global(.bank) {
            width: 5rem;
            height: 5rem;
            place-self: center;
        }
    }
    .tablist {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        & button {
            background-color: var(--p10);
            color: var(--p70);
            width: 0;
            flex: 1;

            &[data-state="active"] {
                background-color: var(--p50);
                color: var(--contrast);
            }
        }
    }
    .tabview {
        overflow: auto;
        height: 100%;
    }
</style>
