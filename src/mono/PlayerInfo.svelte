<script lang="ts">
    import Properties from "./Properties.svelte"
    import Icon from "../components/Icon.svelte"
    import { createTabs, melt } from "@melt-ui/svelte"
    import { Player, properties } from "./index.svelte"

    interface Props {
        player: Player
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

    const { player }: Props = $props()
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
            <p>${player.money}</p>
        </div>
        <button>
            <Icon use="ic-upload" />
            Pagar</button
        >
        <button>
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
            <Properties owns={player.properties} />
        </div>
        <div class="tabview" use:melt={$content("history")}></div>
    </main>
</section>

<style>
    section {
        display: grid;
        grid-template-rows: 2fr 3fr;
        height: 100%;
        overflow: hidden;
    }
    main {
        display: grid;
        grid-template-rows: auto 1fr;
        overflow: hidden;
        max-height: 100%;
    }
    header {
        background-color: var(--p50);
        color: var(--contrast);
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: auto 1fr auto;
        gap: 1rem 0.5rem;
        padding: 0.5rem;

        & nav {
            display: flex;
            text-align: left;
            gap: 1rem;
            line-height: 1;
            align-items: center;
            font-weight: bold;
            font-size: 1.5rem;
            grid-column: span 2;
        }
        & .value {
            text-align: center;
            place-self: center;
            margin-top: -2rem;

            & p:last-child {
                font-variant: tabular-nums;
                font-weight: 300;
                font-size: 3.5rem;
                line-height: 1;
            }
            grid-column: span 2;
        }
        & button {
            background-color: var(--p10);
            color: var(--p90);
        }
    }
    .tablist {
        display: flex;
        gap: 0.5rem;
        padding: 0.5rem;
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
