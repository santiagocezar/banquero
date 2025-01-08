<script lang="ts">
    import {
        BANK,
        properties,
        type MonopolyProperty,
        type Player,
    } from "./index.svelte"
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
        <div
            class="player-card pal-{player.color}"
            data-active={from === i || to === i}
            onclick={() => onclick(i)}
        >
            <header>
                {@render status(from === i, to === i)}
                <p>{player.name}</p>
            </header>
            <p class="money">$ {player.money}</p>
            <div class="properties">
                {#if player.properties.length}
                    {#each player.properties as property}
                        <div style="--color: {properties[property.id].block}" />
                    {/each}
                {:else}
                    <p>Sin propiedades</p>
                {/if}
            </div>
            <div class="actions">
                <div
                    class="status-icon"
                    data-active={from === i || to === i}
                    onclick={(ev) => {
                        onDelete(i)
                        ev.stopPropagation()
                    }}
                    aria-label="Borrar"
                >
                    <Icon use="ic-delete" />
                </div>
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
        grid-template-columns: 1fr;
        gap: 0.5rem;
        /*'@md': {
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
    },
    '@lg': {
        gridTemplateColumns: '1fr 1fr 1fr',
    },*/
    }

    .player-card {
        overflow: hidden;
        display: grid;
        grid-template:
            "name money" min-content
            "properties status" 2rem
            / 1fr min-content;
        align-items: start;
        padding: 0.5rem;
        border-radius: 1rem;
        background-color: var(--p30);
        background-image: linear-gradient(30deg, var(--p40), transparent);
        color: var(--p90);
        user-select: none;
        flex-shrink: 0;
        gap: 0.5rem;
        box-shadow: 0 0.15rem 0.5rem var(--p30);
        transition:
            transform 0.4s,
            color 0.2s,
            filter 0.2s,
            box-shadow 0.4s,
            background-color 0.2s;

        & header {
            display: flex;
            align-items: center;
            max-width: 100%;
            overflow: hidden;

            & p {
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
        }

        &[data-active="true"] header p {
            translate: 0;
        }

        & .money {
            justify-self: end;
            white-space: nowrap;
            font-size: 1.2rem;
        }
        & .properties {
            display: flex;
            align-items: center;
            align-content: flex-start;
            flex-wrap: wrap;

            & > p {
                color: var(---p70);
                font-size: 0.75em;
                font-style: italic;
            }
            & > div {
                --color: red;
                display: flex;
                flex-direction: column;
                align-items: stretch;
                width: 1rem;
                height: 1.5rem;
                padding: 0.125rem;
                background-color: var(--p10);
                box-shadow: 0 0 0 1px var(--p70);
                margin-top: -0.125rem;
                margin-right: -0.5rem;
                margin-bottom: -1.3rem;

                &:nth-child(3n) {
                    margin-top: 0.125rem;
                }
                &:nth-child(3n + 1) {
                    margin-top: 0;
                }
                &::before {
                    content: "";
                    background-color: var(--color);
                    height: 0.25rem;
                }
            }
        }
        & .actions {
            justify-self: end;
        }

        &[data-active="true"] {
            box-shadow: 0 0.4rem 1rem var(--p40);
            color: var(--contrast);
            background-color: var(--p50);
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
