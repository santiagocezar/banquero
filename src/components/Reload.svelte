<script lang="ts">
    import { useRegisterSW } from "virtual:pwa-register/svelte"
    import Icon from "src/components/Icon.svelte"

    const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
        onRegistered(swr) {
            console.log(`SW registered: ${swr}`)
        },
        onRegisterError(error) {
            console.log("SW registration error", error)
        },
    })

    function close() {
        offlineReady.set(false)
        needRefresh.set(false)
    }

    const toast = $derived($offlineReady || $needRefresh)
</script>

{#if toast}
    <div class="pwa-toast" role="alert">
        <div class="message">
            {#if $offlineReady}
                <span> Trucomatic ahora funciona sin conexión! </span>
            {:else}
                <span> Hay una actualización disponible... </span>
            {/if}
        </div>
        {#if $needRefresh}
            <button onclick={() => updateServiceWorker(true)}>
                Recargar
            </button>
        {/if}
        <button onclick={close}>
            <Icon use="ic-close" />
        </button>
    </div>
{/if}

<style>
    .pwa-toast {
        display: flex;
        background-color: var(--blue);
        color: white;

        .message {
            padding: 0.5rem 1rem;
            flex-grow: 1;
        }

        button {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            padding: 0 1rem;
        }
    }
    /*.pwa-toast {
        position: fixed;
        right: 0;
        bottom: 0;
        margin: 16px;
        padding: 12px;
        border: 1px solid #8885;
        border-radius: 4px;
        z-index: 1;
        text-align: left;
        box-shadow: 3px 4px 5px 0 #8885;
        background-color: white;
    }
    .pwa-toast .message {
        margin-bottom: 8px;
    }
    .pwa-toast button {
        border: 1px solid #8885;
        outline: none;
        margin-right: 5px;
        border-radius: 2px;
        padding: 3px 10px;
    }*/
</style>
