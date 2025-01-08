import { nanoid } from "nanoid"
import * as fflate from "fflate"
import * as base64 from "js-base64"

export interface Game<T> {
    identifier: string
    validate: (v: unknown) => T
    initial: () => T
    reset: (old: T) => T
}

// smol function club - begin

export function dataFromUrlSafe(text: string): string {
    const decoded = base64.toUint8Array(text)
    const decompressed = fflate.gunzipSync(decoded)
    return new TextDecoder().decode(decompressed)
}

export function dataToUrlSafe(data: string): string {
    const bytes = new TextEncoder().encode(data)
    const compressed = fflate.gzipSync(bytes)
    return base64.fromUint8Array(compressed, true)
}

export function loadSave<T>(game: Game<T>, id: string): T | undefined {
    const serialized = localStorage.getItem(id)
    if (serialized) {
        const data = JSON.parse(serialized)
        return game.validate(data)
    }
}

export function storeSave(id: string, data: any) {
    const json = JSON.stringify(data)
    localStorage.setItem(id, json)
}

export function generateID(game: Game<any>): string {
    const date = new Date().toISOString().substring(0, 10)
    const random = nanoid(8)
    return `${date}-${random}-${game.identifier}`
}

export function importSave(game: Game<any>, data: string) {
    const json = dataFromUrlSafe(data)
    return game.validate(JSON.parse(json))
}

export const defineGame = <T>(game: Game<T>): Game<T> => game

// smol function club - end

export function useGame<T>(
    game: Game<T>,
    autosave: (data: T) => boolean
): { id: string; data: T } {
    const url = new URL(location.href)
    let id = url.hash.substring(1) || url.searchParams.get("id")
    let data: T
    if (!id || (data = loadSave(game, id)!) === undefined) {
        let encoded = url.searchParams.get("data")
        id = generateID(game)

        data = encoded === null ? game.initial() : importSave(game, encoded)
    }

    url.searchParams.delete("data")
    url.searchParams.delete("id")
    url.hash = "#" + id

    history.replaceState(null, "", url)

    addToRecents(game.identifier, id)

    const mutableData = $state(data)

    $effect(() => {
        const data = JSON.stringify(mutableData)
        if (autosave(mutableData)) {
            localStorage.setItem(id, data)
            console.log("saved!")
        }
    })

    return { id, data: mutableData }
}

export async function shareGameData(id: string) {
    const url = new URL(location.href)
    const data = localStorage.getItem(id)!
    const encoded = dataToUrlSafe(data)

    url.searchParams.delete("id")
    url.searchParams.set("data", encoded)
    await navigator.share({
        title: "Compartir partida",
        url: url.toString(),
    })
}

export interface Recent {
    game: string
    id: string
    date: Date
}
export function getRecents(): Recent[] | null {
    let recents: Recent[] = []
    if (typeof localStorage === "undefined") return null

    try {
        recents = JSON.parse(localStorage.getItem("recents")!)
        if (!recents) recents = []
    } catch (err) {
        console.warn(err)
    }
    return recents.map((r) => ({ ...r, date: new Date(r.date) }))
}
export function deleteRecent(id: string): Recent[] {
    let recents: Recent[] = []
    try {
        recents = JSON.parse(localStorage.getItem("recents")!)
        if (!recents) recents = []
    } catch (err) {
        console.warn(err)
    }
    const idx = recents.findIndex((v) => v.id == id)
    if (idx >= 0) {
        recents.splice(idx, 1)
    }
    localStorage.setItem("recents", JSON.stringify(recents))
    localStorage.removeItem(id)
    return recents.map((r) => ({ ...r, date: new Date(r.date) }))
}

function addToRecents(game: string, id: string) {
    let recents = getRecents()!

    const recentIndex = recents.findIndex((v) => v.id == id)

    const date = new Date()

    if (recentIndex > 0) {
        // yes, not including index 0 is deliberate
        // TODO: why though
        recents.splice(recentIndex, 1)
        recents.splice(0, 0, { game, id, date })
    }
    if (recentIndex < 0) {
        recents.splice(0, 0, { game, id, date })
    }

    localStorage.setItem("recents", JSON.stringify(recents))
}
