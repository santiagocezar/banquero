import "./recents.less"

import { For } from "solid-js";
import { Recent, getRecents } from "../lib/bxx";
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
    recent: Recent
}

function RecentGame(props: RecentGameProps) {
    try {
        const data = truco.getData(props.recent.id)

        if (!data.teams) return null

        return <a href={"/game?id=" + props.recent.id} class="recent">
            <div class={"background pal-" + data.teams.nosotros.color}>
                <div class={"pal-" + data.teams.ellos.color}></div>
            </div>
            <strong>{data.teams.nosotros.name}</strong>
            <span>vs.</span>
            <strong>{data.teams.ellos.name}</strong>
        </a>
    } catch (err) {
        console.error(err)
        return null
    }
}

export function Recents() {
    const recents = getRecents()

    return (
        <For each={recents} fallback={<p class="nope">No hay</p>}>
            {recent => <RecentGame recent={recent} />}
        </For>
    )
}