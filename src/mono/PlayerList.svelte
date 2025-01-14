<script lang="ts">
    import { BANK, properties, type Player } from "."
    import Icon from "../components/Icon.svelte"
    import type { TransitionConfig } from "svelte/transition"

    interface Props {
        from: number | null
        to: number | null
        players: Player[]
        onclickadd: () => void
        onclick: (id: number) => void
        ondelete: (id: number) => void
    }

    const { from, to, players, onclick, onclickadd, ondelete }: Props = $props()

    function delay(node: Element, delay: number): TransitionConfig {
        return {
            duration: delay,
        }
    }

    let deletingPlayer: number | null = $state(null)

    // const deletingPlayerInfo = useMemo(() => {
    //     if (deletingPlayer != null) {
    //         const { name = '', palette = 0 } = board.get(deletingPlayer) ?? {};
    //         return { name, palette: palettes[palette] };
    //     } else {
    //         return { name: '', palette: palettes[0] };
    //     }
    // }, [deletingPlayer]);

    function doDelete() {
        ondelete(deletingPlayer!)
        deletingPlayer = null
    }

    function deletingDialogOpenChange() {
        deletingPlayer = null
    }

    function onDelete(id: number) {
        deletingPlayer = id
    }
</script>

{#snippet status(from: boolean, to: boolean)}
    <div class="status-icon" data-active={from || to}>
        {#if from || to}
            <div out:delay={200}>
                <Icon use={from ? "ic-upload" : "ic-download"} />
            </div>
        {/if}
    </div>
{/snippet}

<div class="player-list">
    <button
        class="reset bank-card plastic-pal pal--1"
        data-active={from === BANK || to === BANK}
        onclick={() => onclick(BANK)}
    >
        {@render status(from === BANK, to === BANK)}
        <p class="name">Banco</p>
        <Icon class="bank" use="ic-account-balance" />
    </button>
    {#each players as player, i (player.name)}
        <div class="player-wrapper">
            <div class="properties">
                {#if player.properties.length}
                    {#each player.properties as property}
                        <div style="--color: {properties[property.id].block}" />
                    {/each}
                {:else}
                    <p>Sin propiedades</p>
                {/if}
            </div>
            <button
                class="reset player-card pal-{player.color} plastic-pal"
                data-active={from === i || to === i}
                onclick={() => onclick(i)}
            >
                {@render status(from === i, to === i)}
                <p class="name">{player.name}</p>
                <p class="money">${player.money}</p>
            </button>
        </div>
    {/each}
    <div class="player-wrapper">
        <div></div>
        <button class="reset player-add plastic" onclick={onclickadd}>
            <div class="status-icon" data-active={true}>
                <Icon use="ic-add" />
            </div>
            <p class="name">Nuevo jugador</p>
        </button>
    </div>
</div>

<!--
<Dialog
    open={deletingPlayer !== null}
    palette={deletingPlayerInfo.palette}
    onOpenChange={deletingDialogOpenChange}
    titlebar={`Seguro que quiere borrar a ${deletingPlayerInfo.name}`}
>
    <ButtonGroup>
        <Button color="red" onClick={deletingDialogOpenChange}>No</Button>
        <Button color="green" onClick={doDelete}>Borrar</Button>
    </ButtonGroup>
</Dialog>
-->

<style>
    .player-list {
        display: grid;
        padding: 1rem;
        grid-auto-flow: row;
        grid-auto-rows: auto;
        grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
        place-content: start;
        justify-content: start;
        gap: 0.5rem 1rem;
    }

    .player-wrapper {
        display: grid;
        grid-template-rows: 1rem 1fr;
    }

    .properties {
        padding-left: 0.5rem;
        display: flex;
        height: 3rem;
        align-items: center;

        & > p {
            color: var(---p70);
            font-size: 0.75em;
            font-style: italic;
        }
        & > div {
            --height: 3rem;
            --width: calc(var(--height) * 0.707);
            --offset: 1rem;
            --color: red;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            width: var(--width);
            height: var(--height);
            padding: 1px;
            background-color: white;
            box-shadow: 0 0 0 1px var(--p70);
            margin-right: calc(var(--offset) - var(--width));

            translate: 0 -0.125rem;

            &:nth-child(3n) {
                translate: 0 0.125rem;
            }
            &:nth-child(3n + 1) {
                translate: 0 0;
            }
            &::before {
                content: "";
                background-color: var(--color);
                height: 0.5rem;
            }
        }
    }
    .player-card,
    .player-add {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        user-select: none;
        --height: 3.5rem;
        text-align: left;
    }
    .player-card {
        background-color: var(--p50);
        color: var(--contrast);

        z-index: 1;

        transition:
            translate 0.4s,
            box-shadow 0.4s;

        & .money {
            justify-self: end;
            white-space: nowrap;
            font-size: 1.2rem;
            font-variant: tabular-nums;
        }

        &[data-active="true"] {
            /*             box-shadow: 0 0.4rem 1rem var(--p40); */
            --elevation: 0.25rem;
            background-color: var(--p10);
            color: var(--p90);
            translate: 0 -0.25rem;
        }
    }

    .status-icon {
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        height: 2rem;
        width: 2rem;
        scale: 0;
        background-color: var(--p30);
        color: var(--p90);
        border-radius: 2rem;
        overflow: hidden;
        opacity: 0;
        transition:
            opacity 0.4s,
            scale 0.4s;

        &[data-active="true"] {
            opacity: 1;
            scale: 1;
        }

        & :global(svg) {
            width: 100%;
        }
    }

    .name {
        display: block;
        width: 100%;
        padding: 0 0.5rem;
        height: 2rem;
        line-height: 2rem;
        font-size: 1.5rem;
        font-weight: bold;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        translate: -2rem 0;
        transition: translate 0.4s;
    }
    .player-add .name,
    [data-active="true"] .name {
        translate: 0;
    }

    .bank-card {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        grid-column: 1 / -1;
        user-select: none;
        text-align: left;
        --height: 5rem;

        background-image: linear-gradient(0deg, var(--p50), var(--p70));
        --light: var(--p40);
        --dark: var(--p70);
        color: var(--p10);

        transition: transform 0.3s;

        & :global(.bank) {
            width: 72px;
            height: 72px;
            translate: 0 3.125%;
            opacity: 0.5;
        }
    }
</style>
