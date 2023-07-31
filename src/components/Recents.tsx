import { For } from "solid-js";
import { Recent, getRecents } from "../lib/bxx";
import { TrucoGame, truco } from "../games/truco";

function friendlyName(recent: Recent) {
    if (recent.game == truco.id) {
        const teams = truco.getData(recent.id).teams
        if (teams) {
            return `${teams.nosotros.name} v. ${teams.ellos.name}`
        }
    }
    return recent.game
}

export function Recents() {
    const recents = getRecents()

    return (
        <For each={recents}>
            {recent => <p>{friendlyName(recent)}</p>}
        </For>
    )
}