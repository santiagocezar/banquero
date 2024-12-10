<script module>
    export const MATCH_HEAD_WIDTH = 10
    export const MATCH_HEAD_LENGTH = 16
    export const MATCH_HEAD_CORNER = 4
    export const MATCH_STICK_WIDTH = 6
    export const MATCH_STICK_LENGTH = 40
    export const MATCH_STICK_CORNER = 2

    export const MATCH_LENGTH = MATCH_STICK_LENGTH + MATCH_HEAD_LENGTH
    export const MATCH_WIDTH = Math.max(MATCH_STICK_WIDTH, MATCH_HEAD_WIDTH)

    export const BOX_SIZE = MATCH_LENGTH + MATCH_HEAD_WIDTH * 2;
</script>
<script lang="ts">

interface Props {
    minCount: number
    maxCount: number
}

const { minCount, maxCount }: Props = $props()
</script>

{#snippet match(i, x, y, rot)}
    <g class="match" data-ghost={i > minCount && i < maxCount} data-hidden={i >= maxCount}>
        <rect 
            class="stick" transform="translate({x}, {y}) rotate({rot})"
            x={-MATCH_STICK_WIDTH/2} y={-MATCH_LENGTH/2+MATCH_HEAD_LENGTH/2} 
            width={MATCH_STICK_WIDTH} height={MATCH_STICK_LENGTH+MATCH_HEAD_LENGTH/2} ry={MATCH_STICK_CORNER} />
        <rect 
            class="head" transform="translate({x}, {y}) rotate({rot})"
            x={-MATCH_HEAD_WIDTH/2} y={-MATCH_LENGTH/2}
            width={MATCH_HEAD_WIDTH} height={MATCH_HEAD_LENGTH} ry={MATCH_HEAD_CORNER} />
    </g>
{/snippet}

<svg width={BOX_SIZE} height={BOX_SIZE} version="1.1" viewBox="0 0 {BOX_SIZE} {BOX_SIZE}" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
    {@render match(0, MATCH_WIDTH / 2, BOX_SIZE / 2, 0)}
    {@render match(1, BOX_SIZE / 2, MATCH_WIDTH / 2, 90)}
    {@render match(2, BOX_SIZE - MATCH_WIDTH / 2, BOX_SIZE / 2, 180)}
    {@render match(3, BOX_SIZE / 2, BOX_SIZE - MATCH_WIDTH / 2, -90)}
    {@render match(4, BOX_SIZE / 2, BOX_SIZE / 2, 45)}
    {@render match(5, BOX_SIZE / 2, BOX_SIZE / 2, -45)}
</svg>

<style lang="less">
.match {
    transition: .15s opacity linear, .15s filter linear, .15s transform ease;
    transform-box: fill-box;

    &[data-hidden="true"] {
        opacity: 0;
        transform: rotate(-10deg) translate(-10px, -10px) scale(1.1);
    }
    &[data-ghost="true"] {
        filter: blur(10px)
    }
    .stick {
        fill: var(--p90);
    }
    .head {
        fill: var(--p50);
    }
}
</style>
