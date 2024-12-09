<script lang="ts">
import Fosforos from "./Fosforos.svelte" 
import { TrucoTeam } from "./truco" 
import { range } from "../lib/utils" 

interface Props {
    team: TrucoTeam
    goal: number
}

const { team, goal }: Props = $props()

let elementRefForColors: HTMLDivElement | undefined = $state()

console.log("aaa: " + JSON.stringify(team))

function increase() {
    team.score++
}
function decrease() {
    team.score > 0 && team.score--;
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
            colors: computed.getPropertyValue("--p50"),
        });
        confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            shapes: "star",
            scalar: 1.5,
            colors: computed.getPropertyValue("--p50"),
        });
    }
    prevScore = score
})
</script>

<div bind:this={elementRefForColors} class="team background pal-{team.color}">
    <header>
        <h2>
            {team.name}
        </h2>
        <div class="actions">
            <button aria-label="Sacar un punto a {team.name}" onclick={decrease}>-</button>
            <button aria-label="Agregar un punto a {team.name}" onclick={increase}>+</button>
        </div>
    </header>
    <div class="content">
        <p class="number">{team.score}</p>
        <div class="goal">primero<br>a {goal}</div>
        <Fosforos score={team.score} goal={goal} />
    </div>
</div>

<style lang="less">
.team {
    display: grid;
    grid-template: min-content 1fr / 1fr;

    header {
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: var(--p50);
        height: 2rem;
        padding: 1rem 0 0 1.25rem;
        color: var(--contrast);
        height: 2rem;
        flex-shrink: 0;
        box-shadow: 0 0 1rem 1rem var(--p50);
    }
    .content {
        position: relative;
        height: 100%;
        overflow: hidden;
    }

    h2 {
        font-weight: bold;
        padding: 1rem 0;
    }

    .number {
        position: absolute;
        left: 1rem;
        bottom: -.05em;
        font-weight: 900;
        font-variant-numeric: tabular-nums;
        font-size: 4rem;
        color: var(--p40);
    }

    .goal {
        position: absolute;
        right: .75rem;
        bottom: 1rem;
        text-align: right;
        font-weight: 400;
        font-variant-numeric: tabular-nums;
        font-size: 1.5rem;
        line-height: 1;
        color: var(--p40);
    }

    .actions {
        border-radius: 0;
/*         gap: .5rem; */
        width: 8rem;
        
        button {
            height: auto;
            box-sizing: border-box;
            padding: 0 1rem;
            background-color: transparent;
        }
    }
}
</style>
