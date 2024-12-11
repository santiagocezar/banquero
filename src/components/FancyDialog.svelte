<script lang="ts">
import { type Snippet } from 'svelte'

interface Props {
    open: boolean
    returnValue: string | undefined
    children?: Snippet
}

let { open = $bindable(false), returnValue = $bindable(), children } = $props()
let dialog: HTMLDialogElement | undefined = $state()

$effect(() => {
    if (open) dialog!.showModal()
})

function handleClose() {
    open = false
    returnValue = dialog!.returnValue
}
function handleClick(event: Event) {
    event.target == dialog && dialog.close()
}
</script>

<dialog bind:this={dialog} onclose={handleClose} onclick={handleClick}>
    {@render children?.()}
</dialog>

<style lang="less">
dialog {
    background-color: transparent;
    transform: translateY(100%);
    opacity: 0;
    margin-bottom: 0;
    padding: 0;
    transition:
        opacity 0.7s ease-out,
        transform 0.7s ease-out,
        overlay 0.7s ease-out allow-discrete,
        display 0.7s ease-out allow-discrete;
}

dialog[open] {
    opacity: 1;
    transform: translateY(0);
}

@starting-style {
    dialog[open] {
        opacity: 0;
        transform: translateY(100%);
    }
}

dialog::backdrop {
    background-color: rgb(0 0 0 / 0%);
    transition:
        display 0.7s allow-discrete,
        overlay 0.7s allow-discrete,
        background-color 0.7s;
}

dialog[open]::backdrop {
    background-color: rgb(0 0 0 / 25%);
}

@starting-style {
    dialog[open]::backdrop {
        background-color: rgb(0 0 0 / 0%);
    }
}
</style>
