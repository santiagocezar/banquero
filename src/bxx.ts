import type * as z from 'zod'
import { createEffect, createDeferred, splitProps } from "solid-js"
import { createMutable } from 'solid-js/store'
import { nanoid } from 'nanoid'
import * as fflate from "fflate";
import * as base64 from "js-base64";


export function useGameData<T extends z.ZodTypeAny>(schema: z.ZodDefault<T>): z.infer<T> {
    let id = nanoid();
    const url = new URL(location.href)
    if (url.searchParams.has("id")) {
        id = url.searchParams.get("id")!
    } else {
        url.searchParams.set("id", id)
        history.replaceState(null, "", url)
    }

    let parsed = schema._def.defaultValue()

    if (url.searchParams.has("data")) {
        const decoded = base64.toUint8Array(url.searchParams.get("data")!)
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

    const mut = createMutable(parsed)

    let autoSaveTaskID = -1;

    function fireAutoSave(data: string) {
        clearTimeout(autoSaveTaskID)
        autoSaveTaskID = setTimeout(() => {
            console.log("saved!")
            localStorage.setItem(id, data)
        }, 2000)
    }

    createDeferred(() => {
        localStorage.setItem(id, JSON.stringify(mut))
        console.log("saved!")
    })
    return mut
}