<script lang="ts">
import { range, delayEffect } from "../lib/utils.svelte" 

interface Props {
    score: number
    goal: number
}

const { score, goal }: Props = $props()
let ref: HTMLDivElement | undefined = $state()

let prevScore = $state(score)

delayEffect(() => {
    score;
    return () => {
        prevScore = score
    }
}, 1000)

const matches = $derived(goal % 6 == 0 ? 6 : 5)
const goalBoxes = $derived(Math.floor(goal / matches))
const scoreBoxes = $derived(Math.ceil(score / matches))
const boxes = $derived(Math.max(goalBoxes, scoreBoxes))

function forBox(boxN: number) {
    return Math.min(Math.max(score, prevScore) - boxN * matches, matches)
}
function isNew(boxN: number, matchN: number) {
    const displayScore = boxN * matches + matchN;
    return score >= prevScore
        ? displayScore >= prevScore
        : displayScore >= score
}
/*
$effect(() => {
    if (ref && count == 1) {
        ref!.scrollIntoView({
            behavior: "smooth",
            block: "end",
        })
    }
})*/
</script>

<div class="boxes">
    {#each range(boxes) as i}
        <div bind:this={ref} class="fosforo-box">
            {#each range(forBox(i)) as j}
                <div class="fosforo" data-new={isNew(i, j)} />
            {/each}
        </div>
      <!--  {#if (i + 1) == goalBoxes}
            <hr />
        {/if}-->
    {/each}
</div>

<style lang="ts">
.boxes {
    /* fun fact!: this is important if you want to scroll elements into view */
    position: relative;
    display: grid;
    grid-template-columns: auto auto;
    place-items: center;
    place-content: space-evenly;
    gap: 1rem 0;
    overflow-y: auto;
    flex-direction: column;
    flex-grow: 1;

    hr {
        width: 75%;
        border: none;
        border-top: 1px solid var(--p50);
    }
}

.fosforo-box {
    position: relative;
    width: 7em;
    font-size: .55rem;
    flex-shrink: 0;
    height: 7em;

    * {
        position: absolute;
    }

    :nth-child(1) {
        top: 2em;
    }

    :nth-child(2) {
        left: 3.25em;
        top: -1.25em;
        transform: rotate(90deg);
    }

    :nth-child(3) {
        top: 2em;
        right: 0;
        transform: rotate(180deg);
    }

    :nth-child(4) {
        left: 3.25em;
        top: 5.25em;
        transform: rotate(270deg);
    }

    :nth-child(5) {
        left: 3.25em;
        top: 2em;
        transform: rotate(45deg);
    }

    :nth-child(6) {
        left: 3.25em;
        top: 2em;
        transform: rotate(-45deg);
    }
}
.fosforo {
    display: block;
    width: .5em;
    height: 5em;
    background-color: var(--p90);
    transition: background-color .2s;
    box-sizing: border-box;

    &[data-new="true"] {
/*         opacity: .25; */
        background-color: var(--p40);
        &::before {
            background-color: var(--p40);
        }
    }
    
    &::before {
        content: "";
        display: block;
        background-color: var(--p50);
        transition: background-color .2s;
        height: 1.5em;
        margin: -.125em;
        width: .75em;
        border-radius: .25em;
    }
}
</style>
