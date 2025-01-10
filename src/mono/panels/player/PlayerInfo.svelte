<script lang="ts">
    import Properties from "./Properties.svelte"
    import Icon from "src/components/Icon.svelte"
    import { createTabs, melt } from "@melt-ui/svelte"
    import { Player, properties } from "$mono"

    interface Props {
        player: Player
        onpropertyselected: (id: number) => void
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

    const { player, onpropertyselected }: Props = $props()
</script>

<section class="pal-{player.color}">
    <header>
        <nav>
            <button>
                <Icon use="ic-arrow-back" />
            </button>
            {player.name}
        </nav>
        <div class="value">
            <p>Balance</p>
            <p class="big">${player.money}</p>
        </div>
        <button class="action">
            <Icon use="ic-upload" />
            Pagar</button
        >
        <button class="action">
            <Icon use="ic-download" />
            Cobrar</button
        >
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
        grid-template-columns: 1fr 1fr;
        padding: 0.5rem;

        & nav {
            font-size: 1.5rem;
            grid-column: span 2;
        }
        & .value {
            grid-column: span 2;
        }
        & .action {
            background-color: var(--p10);
            color: var(--p90);
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
