import { untrack } from "svelte";
import type { MonopolyGame } from ".";
import { browser } from "$app/environment";

const UPDATE = "update"

export function useMonoServer(data: MonopolyGame) {
    if (!browser) return () => {}

    const ws = new WebSocket("ws://localhost:3000")

    let readyState = $state(ws.readyState)

    ws.onopen = () => readyState = ws.readyState
    ws.onclose = () => readyState = ws.readyState
    ws.onerror = (err) => console.error(err)

    function sendKeyUpdate<K extends keyof MonopolyGame>(value: MonopolyGame[K], key: K) {
        ws.send(`${UPDATE} ${key} ${JSON.stringify(value)}`)
    }

    function sendState() {
        ws.send(JSON.stringify($state.snapshot(data)))
    }

    ws.onmessage = (ev) => {
        const msg = ev.data as string
        if (msg === "hi") {
            sendState()
        } else {
            const recieved = JSON.parse(msg)
            for (const key of Object.keys(data)) {
                // @ts-expect-error
                data[key] = recieved[key]
            }
        }
        // if (recv.substring(0, UPDATE.length) == UPDATE) {
        //     const [key, valueJSON] = recv.substring(UPDATE.length + 1).split(" ")

        //     // @ts-expect-error
        //     data[key] = JSON.parse(valueJSON)
        // }
    } 

    $effect(() => { 
        if (readyState === WebSocket.OPEN) {
            ws.send("hi")
        }
    })
    // $effect(() => { readyState == WebSocket.OPEN && sendKeyUpdate(data.defaultMoney, "defaultMoney") })
    // $effect(() => { readyState == WebSocket.OPEN && sendKeyUpdate(data.history, "history") })
    // $effect(() => { readyState == WebSocket.OPEN && sendKeyUpdate(data.players, "players") })
    // $effect(() => { readyState == WebSocket.OPEN && sendKeyUpdate(data.owners, "owners") })

    $effect(() => () => {
        ws.close()
    })

    return sendState
}