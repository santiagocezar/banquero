<script lang="ts">
import Fosforos from "./Fosforos.svelte"
import MdiAdd from "~icons/mdi/add"
import MdiRemove from "~icons/mdi/minus"
import { TrucoTeam } from "./truco" 
import { range } from "../lib/utils" 
import { confetti } from 'tsparticles-confetti'

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
        <p class="number">{team.score}</p>
    </header>
    <div class="content">
        <Fosforos score={team.score} goal={goal} />
        <div class="goal">primero<br>a {goal}</div>
    </div>
    <div class="actions">
        <button aria-label="Sacar un punto a {team.name}" onclick={decrease}>
            <MdiRemove />
        </button>
        <button aria-label="Agregar un punto a {team.name}" onclick={increase}>
            <MdiAdd />
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
        background-image: linear-gradient(to bottom, var(--p50), transparent);
        padding: 1rem;
        color: var(--p90);
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
        color: var(--p40);*/
    }

    .goal {
        text-align: right;
        font-weight: 400;
        font-variant-numeric: tabular-nums;
        font-size: 1.5rem;
        line-height: 1;
        padding: 1rem;
        color: var(--p40);
    }

    .actions {
        border-radius: 0;
/*         gap: .5rem; */
/*         width: 8rem; */

        button {
            font-size: 16px;
            display: grid;
            place-items: center;
        }
    }
}
</style>
