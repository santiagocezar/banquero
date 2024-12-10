<script lang="ts">
import { range, delayEffect } from "../lib/utils.svelte" 
import Box from "./Box.svelte" 

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

const MAX_ROWS = 6

const matches = $derived(goal % 6 == 0 ? 6 : 5)
const goalBoxes = $derived(Math.floor(goal / matches))
const scoreBoxes = $derived(Math.ceil(Math.max(score, prevScore) / matches))
const boxes = $derived(Math.max(goalBoxes, scoreBoxes))
const size = $derived(Math.min(1 / Math.floor((scoreBoxes - 1) / MAX_ROWS + 1), (1 / scoreBoxes + 1) / 2))

function forBox(score, boxN: number) {
    return Math.min(score - boxN * matches, matches)
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


<div class="boxes" style="font-size: {size}rem">
    {#each range(boxes) as i}
        <div class="goal-box" data-goal={(i + 1) == goalBoxes}>
            <div bind:this={ref} class="fosforo-box" data-goal={(i + 1) == goalBoxes}>
                <Box
                    minCount={forBox(Math.min(score, prevScore), i)}
                    maxCount={forBox(Math.max(score, prevScore), i)}
                />
            </div>
        </div>
      <!--  {#if }
            <hr />
        {/if}-->
    {/each}
</div>

<style lang="ts">
.boxes {
    /* fun fact!: this is important if you want to scroll elements into view */
    position: relative;
    display: grid;
    grid-template-rows: repeat(6, auto);
    grid-auto-columns: auto auto;
    grid-auto-flow: column;
    place-items: center;
    place-content: start space-evenly;
    gap: .25em 0;
    overflow: hidden;
    height: 100%;
    transition: .2s ease font-size, .2s ease grid-template-columns;

    hr {
        width: 75%;
        border: none;
        border-top: 1px solid var(--p50);
    }
}
.goal-box {
    padding: 1em;

    &[data-goal="true"] {
        border-bottom: 1px solid var(--p50);
    }   
}
.fosforo-box {
    position: relative;
    width: 7em;
    flex-shrink: 0;
    height: 7em;
    
   /* * {
        position: absolute;
    }

    :nth-child(1) {
        top: 1em;
    }

    :nth-child(2) {
        left: 3.25em;
        top: -2.25em;
        transform: rotate(90deg);
    }

    :nth-child(3) {
        top: 1em;
        right: 0;
        transform: rotate(180deg);
    }

    :nth-child(4) {
        left: 3.25em;
        top: 4.25em;
        transform: rotate(270deg);
    }

    :nth-child(5) {
        left: 3.25em;
        top: 1em;
        transform: rotate(45deg);
    }

    :nth-child(6) {
        left: 3.25em;
        top: 1em;
        transform: rotate(-45deg);
    }*/
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
