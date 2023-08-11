import { Show } from 'solid-js'
import { useRegisterSW } from 'virtual:pwa-register/solid'
import './reload.less'


export function Reload() {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            // eslint-disable-next-line prefer-template
            console.log('SW Registered: ' + r)
        },
        onRegisterError(error) {
            console.log('SW registration error', error)
        },
    })

    const close = () => {
        setOfflineReady(false)
        setNeedRefresh(false)
    }

    return (
        <Show when={offlineReady() || needRefresh()}>
            <div class="reload">
                <div class="message">
                    <Show
                        fallback={<span>Hay una actualización!</span>}
                        when={offlineReady()}
                    >
                        <span>Ya podés usar Score sin conexión!</span>
                    </Show>
                </div>
                <Show when={needRefresh()}>
                    <button class="action" onClick={() => {
                        updateServiceWorker(true).catch(console.error)
                    }}>Recargar</button>
                </Show>
                <button class="close" onClick={() => close()}>×</button>
            </div>
        </Show>
    )
}
