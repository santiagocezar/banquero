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
import { For, JSX, Show, createComputed, createEffect, createMemo, createSignal, untrack } from "solid-js";
import * as z from 'zod'
import { confetti } from 'tsparticles-confetti'
import { range } from "../../lib/utils";

export const PlayerData = z.object({
    name: z.string(),
    color: z.number(),
    rounds: z.array(z.number()),
})

export const TableData = z.object({
    players: z.array(PlayerData),
}).default({
    players: [],
})
export type PlayerData = z.infer<typeof PlayerData>
export type TableData = z.infer<typeof TableData>

export const table = createGame("table", TableData)

interface PlayerContentProps {
    player: PlayerData
}

function PlayerContent(props: PlayerContentProps) {
    return (
        <p>{props.player.name}</p>
    )
}


interface AddPlayerContentProps {
    onConfirm: (player: PlayerData | null) => void
}
function AddPlayerContent(props: AddPlayerContentProps) {
    const [color, setColor] = createSignal(Math.floor(Math.random() * 12));

    const [adding, setAdding] = createSignal(false)

    function changeColor(event: Event) {
        if (event.target instanceof HTMLInputElement) {
            setColor(Number(event.target.value))
        }
    }

    function create(event: Event) {
        event.preventDefault()
        if (!(event.target instanceof HTMLFormElement)) return

        const data = new FormData(event.target);

        const name1 = data.get("name")?.toString() || "Jugador"

        const color1 = Number(data.get("color"))

        props.onConfirm({
            name: name1, color: color1, rounds: []
        })
        setAdding(false)
        setColor(Math.floor(Math.random() * 12))
    }


    return (
        <div class={"column add-player pal-" + color()} data-adding={adding()}>
            <Show when={adding()} fallback={<button class="add" onClick={() => setAdding(true)}>Agregar jugador</button>}>
                <form onSubmit={create}>
                    <label class="text-input">
                        <p>Nombre</p>
                        <input name={"name"}
                            type="text" />
                    </label>
                    <div class="colors" onChange={changeColor} >
                        <For
                            each={range(12)}>
                            {i => (
                                <input
                                    type="radio"
                                    name={"color"}
                                    checked={untrack(() => color() == i)}
                                    value={i}
                                    class={"pal-" + i}
                                />
                            )}
                        </For>
                    </div>
                    <div class="actions">
                        <button type="submit">Listo</button>
                    </div>
                </form>
            </Show>
        </div>
    )
}


export function TableView() {
    const game = table.useData()


    function addPlayer(player: PlayerData | null) {
        if (player)
            game.players.push(player)
    }

    return (
        <div class="table">
            <For
                each={game.players}
            >
                {player => (
                    <div class={"column player pal-" + player.color}>
                        <PlayerContent player={player} />
                    </div>
                )}
            </For>
            <AddPlayerContent onConfirm={addPlayer} />
        </div>
        // {players[0] ? players[1] ? <><Team team={players[0]} /><Team team={players[1]} /></> : <><Team team={players[0]} /><AddTeam /></> : <><AddTeam /><TeamBackground /></>}


    );
}
