<script lang="ts">
    import { range, delayEffect, sizeObserver } from "$lib/utils.svelte"
    import Box, { BOX_SIZE, BOX_MARGIN } from "./Box.svelte"

    interface Props {
        score: number
        goal: number
    }

    const { score, goal }: Props = $props()
    let ref: SVGElement | undefined = $state()

    const contentSize = sizeObserver(() => ref)

    let prevScore = $state(score)

    delayEffect(() => {
        score
        return () => {
            prevScore = score
        }
    }, 1000)

    const MAX_ROWS = 6

    const matches = $derived(goal % 6 == 0 ? 6 : 5)
    const goalBoxes = $derived(Math.floor(goal / matches))
    const scoreBoxes = $derived(Math.ceil(Math.max(score, prevScore) / matches))
    const boxes = $derived(Math.max(goalBoxes, scoreBoxes))

    const size = $derived(
        Math.min(
            1 / Math.floor((scoreBoxes - 1) / MAX_ROWS + 1),
            (1 / scoreBoxes + 1) / 2
        )
    )

    $inspect({ boxes, h: contentSize.height })
    const boxScale = $derived(
        Math.min(
            contentSize.width - BOX_MARGIN * 2,
            contentSize.height / scoreBoxes
        ) /
            (BOX_SIZE + BOX_MARGIN)
    )

    function forBox(score, boxN: number) {
        return Math.min(score - boxN * matches, matches)
    }
</script>

<svg
    bind:this={ref}
    version="1.1"
    xml:space="preserve"
    xmlns="http://www.w3.org/2000/svg"
>
    <g
        class="wrapper"
        transform="translate({(contentSize.width - BOX_SIZE * boxScale) /
            2}, 0) scale({boxScale})"
    >
        {#each range(boxes + 1) as i}
            <Box
                minCount={forBox(Math.min(score, prevScore), i)}
                maxCount={forBox(Math.max(score, prevScore), i)}
                x={0}
                y={(BOX_SIZE + BOX_MARGIN) * i}
                isGoal={i + 1 == goalBoxes}
            />
        {/each}
    </g>
</svg>

<style lang="ts">
    svg {
        flex-grow: 1;
        width: 100%;
    }
    .wrapper {
        transition: 0.3s transform ease;
    }
</style>
