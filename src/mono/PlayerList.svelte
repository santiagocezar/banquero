<script lang="ts">
    import { BANK, properties, type Player } from "."
    import Icon from "../components/Icon.svelte"
    import type { TransitionConfig } from "svelte/transition"

    interface Props {
        from: number | null
        to: number | null
        players: Player[]
        onclick: (id: number) => void
        ondelete: (id: number) => void
    }

    const {
        from = $bindable(),
        to = $bindable(),
        players,
        onclick,
        ondelete,
    }: Props = $props()

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
    <div class="bank-card" onclick={() => onclick(BANK)}>
        <Icon use="ic-account-balance" />
        <header>Banco</header>
        {@render status(from === BANK, to === BANK)}
    </div>
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
            <div
                class="player-card pal-{player.color} plastic auto-pal"
                data-active={from === i || to === i}
                onclick={() => onclick(i)}
            >
                {@render status(from === i, to === i)}
                <p class="name">{player.name}</p>
                <p class="money">$ {player.money}</p>
            </div>
        </div>
    {/each}
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
        grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
        height: auto;
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

    .player-card {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        background-color: var(--p50);
        color: var(--contrast);
        user-select: none;
        height: 3.5rem;

        z-index: 1;

        transition:
            transform 0.4s,
            color 0.2s,
            filter 0.2s,
            box-shadow 0.4s,
            background-color 0.2s;

        & .name {
            display: block;
            width: 100%;
            max-width: 100%;
            padding: 0 0.5rem;
            height: 2rem;
            line-height: 2rem;
            font-size: 1.5rem;
            /*                 font-family: "Poppins"; */
            font-weight: bold;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            translate: -2rem 0;
            transition: translate 0.4s;
        }
        & .money {
            justify-self: end;
            white-space: nowrap;
            font-size: 1.2rem;
        }

        &[data-active="true"] .name {
            translate: 0;
        }

        &[data-active="true"] {
            /*             box-shadow: 0 0.4rem 1rem var(--p40); */
            --elevation: 0.25rem;
            background-color: var(--p10);
            color: var(--p90);
            transform: translateY(-0.25rem);
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

    .bank-card {
        display: grid;
        grid-template-columns: min-content 1fr min-content;
        align-items: center;
        grid-column: 1 / -1;
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        background-color: var(--p50);
        color: var(--p90);
        user-select: none;
        gap: 0.5rem;
        transition: transform 0.3s;

        --p10: #efeffb;
        --p30: #8e92bb;
        --p40: #55598f;
        --p50: #2f3150;
        --p70: #080a15;
        --p90: #efeffb;
        --contrast: "white";

        & header {
            font-size: 1.5rem;
            /*             font-family: Poppins; */
            font-weight: bold;
            white-space: nowrap;
        }
    }
</style>
