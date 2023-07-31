import type * as z from 'zod'
import { createEffect, createDeferred, splitProps } from "solid-js"
import { createMutable } from 'solid-js/store'
import { nanoid } from 'nanoid'
import * as fflate from "fflate";
import * as base64 from "js-base64";

interface Game<T extends z.ZodTypeAny> {
    id: string
    schema: z.ZodDefault<T>
    getData(id: string, fromData?: string | null): z.infer<T>
    useData(): z.infer<T>
}

export function createGame<T extends z.ZodTypeAny>(game: string, schema: z.ZodDefault<T>): Game<T> {
    return {
        id: game,
        schema,
        getData(id, fromData) {
            return getGameData(schema, id, fromData)
        },
        useData() {
            return useGameData(schema, game)
        },
    }
}

export interface Recent {
    game: string
    id: string
    date: Date
}
export function getRecents(): Recent[] {
    let recents: Recent[] = []
    try {
        recents = JSON.parse(localStorage.getItem("recents")!)
        if (!recents) recents = []
    } catch (err) {
        console.warn(err)
    }
    return recents
}

function addToRecents(game: string, id: string) {
    let recents = getRecents()

    const recentIndex = recents.findIndex(v => v.id == id)

    const date = new Date()

    if (recentIndex > 0) { // yes, not including index 0 is deliberate
        recents.splice(recentIndex, 1)
    }
    recents.splice(0, 0, { game, id, date })

    localStorage.setItem("recents", JSON.stringify(recents))

}

export function getGameData<T extends z.ZodTypeAny>(schema: z.ZodDefault<T>, id: string, fromData: string | null = null): z.infer<T> {
    let parsed = schema._def.defaultValue()

    if (fromData) {
        const decoded = base64.toUint8Array(fromData)
        const decompressed = fflate.gunzipSync(decoded)
        const data = new TextDecoder().decode(decompressed)
        parsed = schema.parse(JSON.parse(data))
    } else {
        try {
            const serialized = localStorage.getItem(id)
            if (serialized) {
                const data = JSON.parse(serialized)
                parsed = schema.parse(data)
            }
        } catch (err) {
            console.error(err)
        }
    }

    return parsed
}

export function useGameData<T extends z.ZodTypeAny>(schema: z.ZodDefault<T>, game: string): z.infer<T> {
    let id = nanoid();
    const url = new URL(location.href)
    if (url.searchParams.has("id")) {
        id = url.searchParams.get("id")!
    } else {
        url.searchParams.set("id", id)
    }

    const dataParam = url.searchParams.get("data")
    url.searchParams.delete("data")

    history.replaceState(null, "", url)

    addToRecents(game, id)

    const mut = createMutable(getGameData(schema, id, dataParam))

    let autoSaveTaskID = -1;

    createDeferred(() => {
        localStorage.setItem(id, JSON.stringify(mut))
        console.log("saved!")
    })
    return mut
}