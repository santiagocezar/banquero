<script lang="ts">
    import FancyDialog from "src/components/FancyDialog.svelte"
    import { useGame } from "$lib/bxx.svelte"
    import * as bingo from "./index.ts"

    import Icon from "src/components/Icon.svelte"
    import { SvelteSet } from "svelte/reactivity"
    import { fly, scale } from "svelte/transition"
    import { bounceOut } from "svelte/easing"

    const { data } = useGame(bingo.game, (data) => data.played.length > 0)
    const NUMBERS = Array.from(Array(90), (_, i) => i + 1)

    let played = $state(new SvelteSet(data.played))

    let lastPlayed = $state(-1)
    let confirmOpen = $state(false)

    $effect(() => {
        data.played = Array.from(played)
    })

    $effect(() => {
        lastPlayed

        const timeout = setTimeout(() => {
            lastPlayed = -1
        }, 2000)

        return () => {
            clearTimeout(timeout)
        }
    })

    function onKeyPress(e: KeyboardEvent) {
        if (e.code == "Space") {
            random()
            e.preventDefault()
        }
    }

    function reset() {
        played.clear()
        confirmOpen = false
        lastPlayed = -1
    }

    function random() {
        if (NUMBERS.length !== played.size) {
            const available = NUMBERS.filter((n) => !played.has(n))
            const n = available[Math.floor(Math.random() * available.length)]
            played.add(n)
            lastPlayed = n
        }
    }
</script>

<svelte:document onkeypress={onKeyPress} />

<main>
    <FancyDialog bind:open={confirmOpen}>
        <div class="dialog">
            <h1>¿Seguro que desea reiniciar?</h1>
            <div class="even-row">
                <button onclick={() => (confirmOpen = false)}>
                    Cancelar
                </button>
                <button class="bad" onclick={reset}> Reiniciar </button>
            </div>
        </div>
    </FancyDialog>
    {#each lastPlayed !== -1 ? [lastPlayed] : [] as n (n)}
        <div
            in:fly={{ y: -500, duration: 1000, easing: bounceOut }}
            out:scale
            class="ball"
        >
            <p>{("0" + n).slice(-2)}</p>
        </div>
    {/each}
    <div class="grid">
        {#each NUMBERS as n}
            <span class={{ last: lastPlayed === n, played: played.has(n) }}>
                {("0" + n).slice(-2)}
            </span>
        {/each}
    </div>
    <div class="even-row">
        <button
            class="bad"
            onclick={(e) => {
                confirmOpen = true
                ;(e.target as HTMLButtonElement).blur()
            }}>Reiniciar</button
        >
        <button onclick={random}>Sacar un número</button>
    </div>
    <p class="disclaimer">
        Desarrollo de carácter educativo. No se permite el uso para fines
        lucrativos. Sin ninguna garantía para un propósito en particular.
    </p>
</main>

<!--
            </MainView>
        )}
    >
        <Panel icon={(<MdHistory />)} name="Historial">
-->

<!--
        </Panel>
        <Panel icon={(<MdLeaderboard />)} name="Rankings">
            <Leaderboard hooks={mono} calculate={calculatePlayerValue} />
        </Panel>
        <Panel icon={(<MdBusiness />)} name="Propiedades">
            <MPProperties {properties} />
        </Panel>
        {useAddPlayerPanel(onPlayerAdded)}
    </Paneled>
</SelectionProvider>
-->

<style>
    main {
        display: grid;
        grid-template-rows: 1fr auto auto;
        height: 100%;
        gap: 0.5rem;
        padding: 1rem;
        overflow: hidden;
        user-select: none;
    }
    .grid {
        display: grid;
        grid-template-columns: repeat(10, 1fr);
        flex-grow: 1;
        gap: 0.25rem;
        align-self: stretch;

        & span {
            display: flex;
            align-items: center;
            justify-content: center;
            font-variant: tabular-nums;
            font-size: 1.5rem;
            border-radius: 0.5rem;
            border: 0.125rem solid transparent;
            background-color: var(--bg0);
            transition:
                color 0.4s,
                border-color 0.4s,
                background-color 0.4s,
                transform 0.4s;

            &.played {
                background-color: var(--bluel);
                border-color: var(--blue);
                color: var(--blued);
                transform: rotateY(360deg);
            }
            &.last {
                background-color: var(--yellowl);
                border-color: var(--yellow);
                color: var(--yellowd);
                transform: rotateY(360deg);
            }
        }
    }
    .ball {
        color: black;
        display: block;
        width: 8rem;
        height: 8rem;
        font-size: 40px;
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 99;
        border-radius: 8rem;
        translate: -50% -50%;
        text-decoration: underline;
        box-shadow: 0px 0px 32px #0008;
        background-color: white;
        border: 1rem solid var(--red);
        padding: 0.25rem;
        & > p {
            display: flex;
            width: 100%;
            height: 100%;
            border-radius: 100%;
            align-items: center;
            justify-content: center;
            border: 0.25rem solid var(--red);
        }
    }
    .bad {
        background-color: var(--red);
    }
    .dialog {
        background-color: white;
        padding: 2rem;
        border-radius: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        text-align: center;
        width: calc(100vw - 2rem);
        max-width: 30rem;

        h1 {
            font: bold 1.5rem "Poppins";
            margin-bottom: 0.5em;
        }
    }
    @media screen and (max-width: 60rem) {
        .grid {
            grid-template-columns: repeat(5, 1fr);
        }
        .grid span {
            font-size: 1rem;
        }
    }
    .disclaimer {
        line-height: 1;
        font-size: 0.8rem;
    }
</style>
