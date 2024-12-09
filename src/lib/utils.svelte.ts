export * from "./utils"

export function delayEffect(fn: () => () => void, delayMs: number) {
    let lastTimeout: any
    $effect(() => {
        console.log("hiasodaso")
        const afterDelay = fn()
        clearTimeout(lastTimeout)
        lastTimeout = setTimeout(afterDelay, delayMs)
    })
}
