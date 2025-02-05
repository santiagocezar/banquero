<script lang="ts">
    import * as mono from "$mono"
    import handURL from "$lib/assets/hand.svg?url"
    import Icon from "../components/Icon.svelte"
    import type { TransitionConfig } from "svelte/transition"

    interface Props {
        players: mono.Player[]
        ownerships: mono.Ownerships
        from: number | null
        to: number | null
        onAddClick: () => void
        onClick: (id: number) => void
        onDelete: (id: number) => void
    }

    const {
        players,
        ownerships,
        from,
        to,
        onClick,
        onAddClick,
        onDelete,
    }: Props = $props()

    function delay(_node: Element, delay: number): TransitionConfig {
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
        onDelete(deletingPlayer!)
        deletingPlayer = null
    }

    function deletingDialogOpenChange() {
        deletingPlayer = null
    }
/*
    function onDelete(id: number) {
        deletingPlayer = id
    }*/
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

{#snippet properties(owned: number[])}
    <div class="properties">
        {#if owned.length}
            {#each owned as property}
                <div
                    class="prop"
                    style="--color: {mono.properties[property].color}"
                >
                    <div></div>
                </div>
            {/each}
        {:else}
            <p>Sin propiedades</p>
        {/if}
    </div>
{/snippet}

<div class="player-list">
    <div class="player-wrapper">
        {@render properties(mono.filterOwnerIDs(ownerships, mono.BANK.id))}
        <button
            class="reset bank-card plastic pal--1"
            data-active={from === mono.BANK.id || to === mono.BANK.id}
            onclick={() => onClick(mono.BANK.id)}
        >
            {@render status(from === mono.BANK.id, to === mono.BANK.id)}
            <p class="name">Banco</p>
            <Icon class="bank" use="ic-account-balance" />
        </button>
    </div>
    {#each players as player (player.id)}
        <div class="player-wrapper">
            {@render properties(mono.filterOwnerIDs(ownerships, player.id))}
            <button
                class="reset player-card pal-{player.color} plastic"
                data-active={from === player.id || to === player.id}
                onclick={() => onClick(player.id)}
            >
                {@render status(from === player.id, to === player.id)}
                <p class="name">{player.name}</p>
                <p class="money">${player.money}</p>
            </button>
        </div>
    {/each}
    <div class="player-wrapper">
        <div></div>
        <button class="reset player-add plastic" onclick={onAddClick}>
            <div class="status-icon" data-active={true}>
                <Icon use="ic-add" />
            </div>
            <p class="name">Nuevo jugador</p>
        </button>
    </div>
    {#if players.length === 0}
        <div class="help">
            <div class="hand" style={`mask-image: url("${handURL}");`}></div>
            <p>Empiece agregando un jugador y intente hacer transferencias</p>
        </div>
    {/if}
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
    .player-wrapper:has(.bank-card) {
        grid-column: 1 / -1;
    }


    .properties {
        --height: 3rem;
        --width: calc(var(--height) * 0.707);
        --color: red;
        display: flex;
        height: var(--height);
        max-width: 100%;
        padding-left: 0.5rem;
        padding-right: calc(0.5rem + var(--width));

        & > p {
            color: var(---p70);
            font-size: 0.75em;
            font-style: italic;
        }
        & .prop {
            flex-grow: 1;
            flex-shrink: 1;
            min-width: 0.47rem;
            max-width: calc(var(--width) / 2);
            position: relative;

            translate: 0 -0.125rem;

            &:nth-child(3n) {
                translate: 0 0.125rem;
            }
            &:nth-child(3n + 1) {
                translate: 0 0;
            }

            & > div {
                position: absolute;
                width: var(--width);
                height: var(--height);
                padding: 1px;
                background-color: white;
                box-shadow: 0 0 0 1px var(--p70);

                &::before {
                    content: "";
                    display: block;
                    background-color: var(--color);
                    height: 0.5rem;
                    width: 100%;
                }
            }
        }
    }
    .bank-card,
    .player-card,
    .player-add {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        user-select: none;
        --height: 3.5rem;
        text-align: left;
        z-index: 1;

        transition:
            translate 0.4s,
            box-shadow 0.4s,
            border-color 0.4s,
            background-color 0.4s;
        
        &[data-active="true"] {
            /*             box-shadow: 0 0.4rem 1rem var(--p40); */
            --elevation: 0.25rem;
            background-color: var(--p40);
            border-color: var(--p10);
            translate: 0 -0.25rem;
        }
    }
    .bank-card {
        --height: 5rem;

        background-image: linear-gradient(0deg, var(--p50), var(--p70));
        --light: var(--p40);
        --dark: var(--p70);
        color: var(--p10);

        & :global(.bank) {
            width: 72px;
            height: 72px;
            translate: 0 3.125%;
            opacity: 0.5;
        }
    }
    .player-card {
        background-color: var(--p50);
        box-shadow: var(--plastic-box-shadow), 0 0 2rem .5rem inset var(--p50);
        color: var(--contrast);


        & .money {
            justify-self: end;
            white-space: nowrap;
            font-size: 1.2rem;
            font-variant: tabular-nums;
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
    .help {
        position: relative;
        margin-top: 2rem;
        margin-left: 2rem;
        grid-column: 1 / -1;
        width: fit-content;

        & .hand {
            --w: 6rem;
            width: var(--w);
            height: calc(105 / 66 * var(--w));
            mask-size: contain;
            background-color: currentColor;
        }
        p {
            position: absolute;
            top: 80%;
            left: 50%;
            border-radius: 0.5rem;
            width: 20rem;
            max-width: 50vw;
            font-size: 0.8rem;
            padding: 0.25rem 0.5rem;
            background-color: var(--bg0);
        }
    }
</style>
