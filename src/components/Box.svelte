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
    export const BOX_MARGIN = 16;
</script>
<script lang="ts">

interface Props {
    minCount: number
    maxCount: number
    x: number
    y: number
    isGoal: boolean
}

const { minCount, maxCount, x, y, isGoal }: Props = $props()
</script>

{#snippet match(i, x, y, rot)}
    <g class="match" data-ghost={i > minCount && i <= maxCount} data-hidden={i > maxCount}>
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

<g transform="translate({x}, {y})">
    {@render match(1, MATCH_WIDTH / 2, BOX_SIZE / 2, 0)}
    {@render match(2, BOX_SIZE / 2, MATCH_WIDTH / 2, 90)}
    {@render match(3, BOX_SIZE - MATCH_WIDTH / 2, BOX_SIZE / 2, 180)}
    {@render match(4, BOX_SIZE / 2, BOX_SIZE - MATCH_WIDTH / 2, -90)}
    {@render match(5, BOX_SIZE / 2, BOX_SIZE / 2, 45)}
    {@render match(6, BOX_SIZE / 2, BOX_SIZE / 2, -45)}
    {#if isGoal}
        <path d="M 0,{BOX_SIZE + BOX_MARGIN / 2} L {BOX_SIZE},{BOX_SIZE + BOX_MARGIN / 2}" stroke="var(--p50)"/>
    {/if}
    <!-- <text y="1em">{minCount}, {maxCount}</text> -->
</g>

<style lang="less">
text {
    font: bold 16px sans-serif;
    fill: red;
}
.match {
    transition: .2s opacity linear, .3s filter cubic-bezier(.17,.67,.12,1), .3s transform cubic-bezier(.17,.67,.12,1);
    transform-box: fill-box;
    transform-origin: center center;

    .stick {
        transition: .15s fill linear;
        fill: var(--p90);
    }
    .head {
        transition: .15s fill linear;
        fill: var(--p50);
    }

    &[data-hidden="true"] {
        opacity: 0;
        transform: scale(1.25);
        filter: blur(5px);
    }

    &[data-hidden="true"],
    &[data-ghost="true"] {
        .stick {
            fill: var(--p40);
        }
        .head {
            fill: var(--p40);
        }
    }
}
</style>
