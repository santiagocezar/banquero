// import { JSX, Show, createSignal, onMount, ComponentProps, splitProps, Accessor } from "solid-js";


// type ShowFunction<T> = typeof Show<T, ((item: NonNullable<T>) => JSX.Element>

// type BrowserOnlyProps<T> = Omit<
//     ComponentProps<typeof >, 'when'
// >

// export function BrowserOnly(props: BrowserOnlyProps) {
//     const [isBrowser, setIsBrowser] = createSignal(false)

//     onMount(() => {
//         setIsBrowser(true)
//     })

//     return <Show when={isBrowser()} {...props}>
//         {props.children}
//     </Show>
// }