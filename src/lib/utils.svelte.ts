import { untrack } from "svelte"

export function range(size: number, startAt = 0) {
    if (size <= 0) return []
    return [...Array(Math.floor(size)).keys()].map((i) => i + startAt)
}

export function delayEffect(fn: () => () => void, delayMs: number) {
    let lastTimeout: any
    $effect(() => {
        console.log("hiasodaso")
        const afterDelay = fn()
        clearTimeout(lastTimeout)
        lastTimeout = setTimeout(afterDelay, delayMs)
    })
}

export function sizeObserver(fn: () => Element | undefined): {
    width: number
    height: number
} {
    const size = $state({ width: 0, height: 0 })

    const handler: ResizeObserverCallback = (entries) => {
        for (const entry of entries) {
            size.width = entry.contentRect.width
            size.height = entry.contentRect.height
            break
        }
    }

    $effect(() => {
        const el = fn()

        if (!el) return

        const observer = new ResizeObserver(handler)
        observer.observe(el)

        return () => {
            observer.disconnect()
        }
    })

    return size
}

function component(C: number) {
    const c = C / 255
    return c <= 0.03928
        ? c / 12.92
        : ((c + 0.055) / 1.055) ** 2.4
}

let reference: HTMLElement
if (typeof document !== "undefined") {
    reference = document.createElement('div')
    reference.style.display = 'none'
    document.body.appendChild(reference)
}

export function contrast(node: HTMLElement | SVGElement, color: string) {
    function update(color: string) {
        reference.style.color = color
        const computed = getComputedStyle(reference).color.substring(3)
        const tuple = computed.substring(computed[0] == 'a' ? 2 : 1, computed.length - 1).split(", ")

        const r = component(parseInt(tuple[0]))
        const g = component(parseInt(tuple[1]))
        const b = component(parseInt(tuple[2]))

        const L = 0.2126 * r + 0.7152 * g + 0.0722 * b

        node.style.setProperty("--contrast", L > 0.179 ? "black" : "white")
    }

    update(color)

    return {
        update
    }
}

export function sum<T>(fn: (current: T, i: number) => number) {
    return (acc: number, current: T, i: number) => acc + fn(current, i)
}
export function count<T>(fn: (current: T, i: number) => boolean) {
    return sum<T>((current, i) => +fn(current, i))
}
export function sideEffect(deps: () => any, effect: () => void) {
    $effect(() => {
        deps()
        untrack(effect)
    })
}
