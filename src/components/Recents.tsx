import "./recents.less"

import { For, createSignal } from "solid-js";
import { Recent, deleteRecent, getRecents } from "../lib/bxx";
import { TrucoGame, truco } from "../components/Truco";

function friendlyName(recent: Recent) {
    if (recent.game == truco.id) {
        const teams = truco.getData(recent.id).teams
        if (teams) {
            return `${teams.nosotros.name} v. ${teams.ellos.name}`
        }
    }
    return recent.game
}

interface RecentGameProps {
    onDelete: (id: string) => void
    recent: Recent
}

function RecentGame(props: RecentGameProps) {
    try {
        const data = truco.getData(props.recent.id)

        function rematch() {
            const id = truco.rematch(props.recent.id)

            location.href = "/game/?id=" + id
        }

        if (!data.teams) return null

        return <div class="recent">
            <a href={"/game/?id=" + props.recent.id} class={"border pal-" + data.teams.nosotros.color}>
                <div class={"border-gradient pal-" + data.teams.ellos.color}></div>
            </a>
            <a href={"/game/?id=" + props.recent.id} class={"background pal-" + data.teams.nosotros.color}>

                <div class={"background-gradient pal-" + data.teams.ellos.color}></div>
            </a>
            <div class="top">
                <strong>{data.teams.nosotros.name}</strong>
                <span>vs.</span>
                <strong>{data.teams.ellos.name}</strong>
            </div>
            <div class="actions">
                <span>{props.recent.date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</span>
                <button class="blue" onClick={rematch} >Revancha</button>
                <button class="red" onClick={() => props.onDelete(props.recent.id)}>Borrar</button>
            </div>
        </div>
    } catch (err) {
        console.error(err)
        return null
    }
}

export function Recents() {
    const [recents, setRecents] = createSignal(getRecents())

    function onDelete(id: string) {
        setRecents(deleteRecent(id))
    }

    return (
        <For each={recents()} fallback={<p class="nope">No hay</p>}>
            {recent => <RecentGame onDelete={onDelete} recent={recent} />}
        </For>
    )
}