<script lang="ts">
    import { type Snippet } from "svelte"

    interface Props {
        open: boolean
        children?: Snippet
    }

    let { open = $bindable(false), children } = $props()
    let dialog: HTMLDialogElement | undefined = $state()

    $effect(() => {
        if (open) dialog!.showModal()
        else dialog.close()
    })

    function handleClose() {
        open = false
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
        margin: auto auto 0.5rem auto;
        max-width: 100%;
        max-height: 100%;
        padding: 0;
        transition:
            opacity 0.3s linear,
            transform 0.5s cubic-bezier(0.17, 0.67, 0.12, 1),
            overlay 0.3s ease-out allow-discrete,
            display 0.3s ease-out allow-discrete;
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
