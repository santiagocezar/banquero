// import { styled } from 'lib/theme';
// import { FC, FormEvent, useState } from 'react';
// import { Paneled } from 'components/panels';
// import { Swatch, useAddPlayerPanel } from 'components/panels/AddPlayer';
// import { PlayerFor, PlayerID } from 'lib/bx';
// import { AddScore } from './AddScore';
// import { truco } from '.';
// import { palettes } from "lib/color";
// import { Input } from "components/Forms";
// import { HEADER_HEIGHT } from "components/Header";
// import { range } from "lib/utils";
import './style.less'

import { createGame } from "../../lib/bxx";
import { For, Show, createComputed, createEffect, createMemo, createSignal, untrack } from "solid-js";
import * as z from 'zod'
import { confetti } from 'tsparticles-confetti'
import { range } from "../../lib/utils";

export const TrucoTeam = z.object({
    name: z.string(),
    color: z.number(),
    score: z.number(),
})

export const TrucoGame = z.object({
    teams: z.object({
        nosotros: TrucoTeam,
        ellos: TrucoTeam,
    }).nullable(),
    goal: z.number(),
}).default({
    teams: null,
    goal: 15,
})
export type TrucoTeam = z.infer<typeof TrucoTeam>
export type TrucoGame = z.infer<typeof TrucoGame>

export const truco = createGame("truco", TrucoGame)


interface TeamInputProps {
    team: string;
    defaultColor: number
}

function TeamInput(props: TeamInputProps) {
    const [color, setColor] = createSignal(props.defaultColor);

    function changeColor(event: Event) {
        if (event.target instanceof HTMLInputElement) {
            setColor(Number(event.target.value))
        }
    }

    return <div class={"add-team background pal-" + color()}>
        <label>
            <p>Nombre</p>
            <input name={props.team + "-name"}
                placeholder={props.team}
                type="text" />
        </label>
        <div class="colors" onChange={changeColor} >
            <For
                each={range(12)}>
                {i => (
                    <input
                        type="radio"
                        name={props.team + "-color"}
                        checked={untrack(() => color() == i)}
                        value={i}
                        class={"pal-" + i}
                    />
                )}
            </For>
        </div>
    </div>
}

interface AddTeamProps {
    onConfirm: (team1: TrucoTeam, team2: TrucoTeam) => void
}
const AddTeam = (props: AddTeamProps) => {
    const color1 = Math.floor(Math.random() * 12),
        color2 = (color1 + Math.ceil(Math.random() * 11)) % 12;

    function create(event: Event) {
        event.preventDefault()
        if (!(event.target instanceof HTMLFormElement)) return

        const data = new FormData(event.target);

        const name1 = data.get("Nosotros-name")?.toString() || "Nosotros"
        const name2 = data.get("Ellos-name")?.toString() || "Ellos"

        const color1 = Number(data.get("Nosotros-color"))
        const color2 = Number(data.get("Ellos-color"))

        props.onConfirm({
            name: name1, color: color1, score: 0
        }, {
            name: name2, color: color2, score: 0
        })
    }


    return (
        <form class="add-teams" onSubmit={create}>
            <TeamInput defaultColor={color1} team="Nosotros" />
            <TeamInput defaultColor={color2} team="Ellos" />
            <div class="actions">
                <button type="submit">Listo</button>
            </div>
        </form>
    )
};


interface TeamProps {
    team: z.infer<typeof TrucoTeam>
    goal: number
}

function Team(props: TeamProps) {
    let elementRefForColors: HTMLDivElement

    const matches = createMemo(() => props.goal % 5 == 0 ? 5 : 6)
    const goalBoxes = createMemo(() => Math.floor(props.goal / matches()))
    const scoreBoxes = createMemo(() => Math.ceil(props.team.score / matches()))
    const boxes = createMemo(() => Math.max(goalBoxes(), scoreBoxes()))

    console.log("aaa: " + JSON.stringify(props.team))

    function increase() {
        props.team.score++
    }
    function decrease() {
        props.team.score > 0 && props.team.score--;
    }

    createEffect<number>((prevScore) => {
        const score = props.team.score
        if (score == props.goal && score > prevScore) {
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
        return score
    }, props.team.score)


    return (
        <div ref={elementRefForColors!} class={"team background pal-" + props.team.color}>
            <header>
                <h2>
                    {props.team.name}
                </h2>
                <p class="number">{props.team.score}</p>
            </header>
            <div class="boxes">
                <For
                    each={range(boxes())}>
                    {i => <>
                        <div class="fosforo-box">
                            <For
                                each={range(Math.min(props.team.score - i * matches(), matches()))}>
                                {() => (
                                    <div class="fosforo" />
                                )}
                            </For>
                        </div>
                        <Show when={(i + 1) == goalBoxes()}>
                            <hr />
                        </Show>
                    </>}
                </For>
            </div>
            <div class="actions">
                <button onClick={decrease}>-</button>
                <button onClick={increase}>+</button>
            </div>
        </div >
    )
}

export function TrucoView() {
    const game = truco.useData()

    console.log(JSON.stringify(game))

    function addTeams(nosotros: TrucoTeam, ellos: TrucoTeam) {
        game.teams = {
            nosotros, ellos
        }
    }

    function changeGoal(event: Event) {
        if (event.target instanceof HTMLInputElement) {
            game.goal = Number(event.target.value)
        }
    }

    return (
        <div class="truco">
            <Show
                when={game.teams}
                fallback={
                    <AddTeam onConfirm={addTeams} />

                }
            >
                {teams => <div class="teams">
                    <Team goal={game.goal} team={teams().nosotros} />
                    <Team goal={game.goal} team={teams().ellos} />
                    <div class="goal-toggle" onChange={changeGoal}>
                        <span>Jugar hasta</span>
                        <input type="radio" name="goal" aria-label="15" checked={untrack(() => game.goal == 15)} value="15" />
                        <input type="radio" name="goal" aria-label="18" checked={untrack(() => game.goal == 18)} value="18" />
                        <input type="radio" name="goal" aria-label="24" checked={untrack(() => game.goal == 24)} value="24" />
                        <input type="radio" name="goal" aria-label="30" checked={untrack(() => game.goal == 30)} value="30" />
                        <span>puntos</span>
                    </div>
                </div>}
            </Show>
        </div>
        // {players[0] ? players[1] ? <><Team team={players[0]} /><Team team={players[1]} /></> : <><Team team={players[0]} /><AddTeam /></> : <><AddTeam /><TeamBackground /></>}


    );
}
