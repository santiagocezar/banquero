import { JSX, Show, createSignal, onMount } from "solid-js";

interface BrowserOnlyProps {
    children: JSX.Element,
    fallback?: JSX.Element,
}

export function BrowserOnly(props: BrowserOnlyProps) {
    const [isBrowser, setIsBrowser] = createSignal(false)

    onMount(() => {
        setIsBrowser(true)
    })

    return <Show when={isBrowser()} fallback={props.fallback}>
        {props.children}
    </Show>
}