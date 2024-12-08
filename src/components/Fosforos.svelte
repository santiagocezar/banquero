<script lang="ts">
import { range } from "../lib/utils" 

interface Props {
    score: number
    goal: number
}

const { score, goal }: Props = $props()
let ref: HTMLDivElement | undefined = $state()

const matches = $derived(goal % 6 == 0 ? 6 : 5)
const goalBoxes = $derived(Math.floor(goal / matches))
const scoreBoxes = $derived(Math.ceil(score / matches))
const boxes = $derived(Math.max(goalBoxes, scoreBoxes))
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
            {#each range(Math.min(score - i * matches, matches)) as i}
                <div class="fosforo" />
            {/each}
        </div>
        {#if (i + 1) == goalBoxes}
            <hr />
        {/if}
    {/each}
</div>

<style lang="ts">
.boxes {
    /* fun fact!: this is important if you want to scroll elements into view */
    position: relative;
    padding: 2rem 0;
    display: flex;
    align-items: center;
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
    width: 7rem;
    flex-shrink: 0;
    height: 9rem;

    * {
        position: absolute;
    }

    :nth-child(1) {
        top: 2rem;
    }

    :nth-child(2) {
        left: 3.25rem;
        top: -1.25rem;
        transform: rotate(90deg);
    }

    :nth-child(3) {
        top: 2rem;
        right: 0;
        transform: rotate(180deg);
    }

    :nth-child(4) {
        left: 3.25rem;
        top: 5.25rem;
        transform: rotate(270deg);
    }

    :nth-child(5) {
        left: 3.25rem;
        top: 2rem;
        transform: rotate(45deg);
    }

    :nth-child(6) {
        left: 3.25rem;
        top: 2rem;
        transform: rotate(-45deg);
    }
}
.fosforo {
    display: block;
    width: .5rem;
    height: 5rem;
    background-color: var(--p90);

    &::before {
        content: "";
        display: block;
        background-color: var(--p50);
        height: 1.5rem;
        margin: -.125rem;
        width: .75rem;
        border-radius: .25rem;
    }
}
</style>
