<script lang="ts">
import AddTeam from './AddTeam.svelte'
import Team from './Team.svelte'
import { range } from "../lib/utils";
import { truco } from "./truco";

const game = truco.useData(data => data.teams !== null)

console.log(JSON.stringify(game))

function addTeams(nosotros: TrucoTeam, ellos: TrucoTeam, goal: number) {
    game.teams = {
        nosotros, ellos
    }
    game.goal = goal
}
</script>
<!--
<svg style="display: none;" id="fire" width="128" height="128" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="gradient" gradientTransform="rotate(90)">
            <stop offset="0%" stop-color="black" />
            <stop offset="100%" stop-color="white" />
        </linearGradient>
        <filter id="gradient-blend" x="0" y="0" width="1" height="1">
            <feImage href="/noise.png" height="512" width="256">
                <animate
                    attributeName="y"
                    values="0;-256"
                    dur="2s"
                    repeatCount="indefinite" />
            </feImage>
            <feBlend in2="SourceGraphic" mode="multiply" />
            <feComponentTransfer>
                <feFuncR type="linear" slope="100" intercept="-10" />
                <feFuncG type="linear" slope="100" intercept="-10" />
                <feFuncB type="linear" slope="100" intercept="-10" />
            </feComponentTransfer>
        </filter>
        <mask id="fire-mask">
            <rect x="0" y="0" width="128" height="128" fill="url(#gradient)" filter="url(#gradient-blend)"/>
        </mask>
    </defs>
    <rect x="0" y="0" width="128" height="128" fill="red" mask="url(#fire-mask)"/>
    
</svg>-->

<div class="truco">
    {#if game.teams}
        <div class="teams">
            <Team goal={game.goal} team={game.teams.nosotros} />
            <Team goal={game.goal} team={game.teams.ellos} />

            <footer class="donate">
                <a href="https://cafecito.app/valsan" rel="noopener" target="_blank">
                    <img
                        srcset="https://cdn.cafecito.app/imgs/buttons/button_2.png 1x, https://cdn.cafecito.app/imgs/buttons/button_2_2x.png 2x, https://cdn.cafecito.app/imgs/buttons/button_2_3.75x.png 3.75x"
                        src="https://cdn.cafecito.app/imgs/buttons/button_2.png"
                        alt="Invitame un café en cafecito.app"
                    />
                </a>
            </footer>
        </div>
    {:else}
        <AddTeam onconfirm={addTeams} />
    {/if}
</div>

<style lang="less">
/* basically !unimportant */
@layer {
    .truco {
        :global {
            .actions {
                display: flex;
                overflow: hidden;
                flex-shrink: 0;
                border-radius: 2rem;
                // border: .25rem solid white;
                // margin: -.25rem;

                button {
                    width: 0;
                    flex-grow: 1;
                    background-color: var(--p50);
                    color: var(--contrast);
                    font-size: 2rem;
                    padding: 1rem;
                    font-weight: bold;
                }
            }
        }
    }
}
.truco {
    display: block;
    flex-grow: 1;

    padding: 1rem;
    flex-basis: 0;
    overflow: hidden;
/*     mask-image: url(#fire-mask); */
    
    :global {
        .background {
            display: flex;
            overflow: hidden;
            flex-direction: column;
            border-radius: 2rem;
            background-color: var(--p30);
            transition: background-color .5s ease;
            border: 1px solid var(--p50);
            flex-grow: 1;
        }
    }
    

    .teams {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr min-content;
        height: 100%;
        gap: .5rem;
        overflow: hidden;
        flex-direction: column;
        flex-grow: 1;

        .actions {
            grid-column: span 2;
        }

        footer {
            flex-shrink: 0;
            grid-column: span 2;
            display: flex;
            padding: 1rem 0;
            justify-content: center;
        }
    }
}

@keyframes fire {
    0% {
        background-position-y: 0%;
    }
    100% {
        background-position-y: 200%;
    }
}

.fire {
    background-color: red;
    background-image: url("/noise.png"), linear-gradient(to bottom, transparent, white);
    background-size: 200%;
/*     background-blend-mode: multiply; */
    filter: brightness(70%) contrast(1000%);
    width: 128px;
    height: 128px;
    animation: 2s linear fire infinite;
}
</style>
