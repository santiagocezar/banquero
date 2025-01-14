<script lang="ts">
    import Properties from "$mono/Properties.svelte"
    import Icon from "src/components/Icon.svelte"
    import { createTabs, melt } from "@melt-ui/svelte"
    import { Player, properties } from "$mono"

    interface Props {
        player: Player
        onpropertyselected: (id: number) => void
        onreturn: () => void
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

    const { player, onpropertyselected, onreturn, pay, charge }: Props = $props()
</script>

<section class="pal-{player.color}">
    <header class="plastic-pal">
        <nav>
            <button onclick={onreturn}>
                <Icon use="ic-arrow-back" />
            </button>
            {player.name}
        </nav>
        <div class="value">
            <p>Balance</p>
            <p class="big">${player.money}</p>
        </div>
        <div class="actions">
            <button onclick={() => pay()} class="plastic">
                <Icon use="ic-upload" />
                Pagar</button
            >
            <button onclick={() => charge()} class="plastic">
                <Icon use="ic-download" />
                Cobrar</button
            >
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
            <Properties owns={player.properties} {onpropertyselected} />
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
