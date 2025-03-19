<script lang="ts">
    import Fosforos from "./Fosforos.svelte"
    import Icon from "$lib/components/Icon.svelte"
    import { TrucoTeam } from "./truco"
    import { range } from "$lib/utils.svelte"
    import { confetti } from "tsparticles-confetti"

    interface Props {
        team: TrucoTeam
        goal: number
        onwin: (team: TrucoTeam) => void
    }

    const { team = $bindable(), goal, onwin }: Props = $props()

    let elementRefForColors: HTMLDivElement | undefined = $state()

    console.log("aaa: " + JSON.stringify(team))

    function increase() {
        team.score++
    }
    function decrease() {
        team.score > 0 && team.score--
    }

    let prevScore = team.score
    $effect(() => {
        const score = team.score
        if (score == goal && score > prevScore) {
            const computed = getComputedStyle(elementRefForColors)

            console.log("🥳")
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                shapes: "star",
                scalar: 1.5,
                colors: computed.getPropertyValue("--c50"),
            })
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                shapes: "star",
                scalar: 1.5,
                colors: computed.getPropertyValue("--c50"),
            })
            onwin(team)
        }
        prevScore = score
    })
</script>

<div
    bind:this={elementRefForColors}
    class="team truco-background pal-{team.color}"
>
    <header>
        <h2>
            {team.name}
        </h2>
        <p class="number">{team.score}</p>
    </header>
    <div class="content">
        <Fosforos score={team.score} {goal} />
        <div class="goal">hasta {goal}</div>
    </div>
    <div class="actions even-row">
        <button aria-label="Sacar un punto a {team.name}" onclick={decrease}>
            <Icon use="ic-remove" />
        </button>
        <button aria-label="Agregar un punto a {team.name}" onclick={increase}>
            <Icon use="ic-add" />
        </button>
    </div>
</div>

<style lang="less">
    .team {
        user-select: none;

        header {
            z-index: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background-image: linear-gradient(
                to bottom,
                var(--c30),
                transparent
            );
            padding: 1rem;
            color: var(--c90);
            height: 4rem;
            flex-shrink: 0;
        }
        .content {
            display: flex;
            flex-direction: column;
            height: 100%;
            overflow: hidden;
        }

        h2 {
            font-weight: bold;
            padding: 1rem 0;
        }

        .number {
            font-weight: 900;
            font-size: 2rem;
            /*position: absolute;
        left: 1rem;
        bottom: -.05em;
        font-variant-numeric: tabular-nums;
        color: var(--c40);*/
        }

        .goal {
            text-align: right;
            font-weight: 400;
            font-variant-numeric: tabular-nums;
            font-size: 1.5rem;
            line-height: 1;
            padding: 1rem;
            color: var(--c40);
        }

        .actions {
            border-radius: 0;
            /*         gap: .5rem; */
            /*         width: 8rem; */

            button {
                border-radius: 0;
                background-color: transparent;
                /*             background-image: linear-gradient(to bottom, transparent, var(--c10)); */
                color: var(--c90);
                font-size: 16px;
                display: grid;
                place-items: center;

                &:last-child {
                    border-left: 1px solid var(--c50);
                }
            }
        }
    }
</style>
