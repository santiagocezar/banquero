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

import { useGameData } from "../../bxx";
import { For, Show, createSignal, untrack } from "solid-js";
import * as z from 'zod'

export function range(size: number, startAt = 0) {
    return [...Array(Math.floor(size)).keys()].map((i) => i + startAt);
}

const TrucoTeam = z.object({
    name: z.string(),
    color: z.number(),
    score: z.number(),
})

const TrucoGame = z.object({
    team1: TrucoTeam.nullable(),
    team2: TrucoTeam.nullable(),
}).default({
    team1: null,
    team2: null
})
type TrucoTeam = z.infer<typeof TrucoTeam>
type TrucoGame = z.infer<typeof TrucoGame>


interface AddTeamProps {
    onConfirm: (team: TrucoTeam) => void
}

const AddTeam = (props: AddTeamProps) => {
    const [color, setColor] = createSignal(Math.floor(Math.random() * 12));

    function create(event: Event) {
        event.preventDefault()
        if (!(event.target instanceof HTMLFormElement)) return

        const data = new FormData(event.target);

        const name = data.get("name")?.toString() || "Motobug"

        props.onConfirm({
            name, color: color(), score: 0
        })
    }

    function changeColor(event: Event) {
        if (event.target instanceof HTMLInputElement) {
            setColor(Number(event.target.value))
        }
    }

    return (
        <form class={"add-team background pal-" + color()} onSubmit={create}>
            <label>
                <p>Nombre:</p>
                <input name="name" type="text" />
            </label>
            <div class="colors" onChange={changeColor} >
                <For
                    each={range(12)}>
                    {i => (
                        <input
                            type="radio"
                            name="color"
                            checked={untrack(() => color() == i)}
                            value={i}
                            class={"pal-" + i}
                        />
                    )}
                </For>
            </div>
            {/* <Swatches>
                {palettes.map((_, i) => (
                    <Swatch key={i} palette={i} active={i === palette} onClick={setPalette} />
                ))}
            </Swatches> */}
            <div class="actions">
                <button type="submit">Agregar</button>
            </div>
        </form>
    )
};


interface TeamProps {
    team: z.infer<typeof TrucoTeam>
}

function Team(props: TeamProps) {
    console.log("aaa: " + JSON.stringify(props.team))

    function increase() {
        props.team.score++
    }
    function decrease() {
        props.team.score > 0 && props.team.score--;
    }

    return (
        <div class={"team background pal-" + props.team.color}>
            <h2>
                {props.team.name}
            </h2>
            <div class="boxes">
                <For
                    each={range(props.team.score / 5)}>
                    {() => (
                        <div class="fosforo-box">
                            <div class="fosforo" />
                            <div class="fosforo" />
                            <div class="fosforo" />
                            <div class="fosforo" />
                            <div class="fosforo" />
                        </div>
                    )}
                </For>
                <div class="fosforo-box">
                    <For
                        each={range(props.team.score % 5)}>
                        {() => (
                            <div class="fosforo" />
                        )}
                    </For>
                </div>
            </div>
            <div class="actions">
                <button onClick={decrease}>-</button>
                <button onClick={increase}>+</button>
            </div>
        </div>
    )
}

export function TrucoView() {
    const game = useGameData(TrucoGame)

    console.log(JSON.stringify(game))

    function addTeam1(team: TrucoTeam) {
        game.team1 = team
    }
    function addTeam2(team: TrucoTeam) {
        game.team2 = team
    }
    console.log("aaa: " + JSON.stringify(game.team2))

    return (
        <div class="truco">
            <Show
                when={game.team1}
                fallback={<AddTeam onConfirm={addTeam1} />}
            >
                {team => <Team team={team()} />}
            </Show>
            <Show
                when={game.team2}
                fallback={<AddTeam onConfirm={addTeam2} />}
            >
                {team => <Team team={team()} />}
            </Show>
        </div>
        // {players[0] ? players[1] ? <><Team team={players[0]} /><Team team={players[1]} /></> : <><Team team={players[0]} /><AddTeam /></> : <><AddTeam /><TeamBackground /></>}


    );
}
