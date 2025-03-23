<script lang="ts">
    import Icon from "$lib/components/Icon.svelte"
    import { Tabs } from "melt/builders";
    import * as mono from "$games/mono"
    import { crossfade } from "svelte/transition"
    import { cubicInOut } from "svelte/easing"

    import IconMoneySend from "~icons/hugeicons/money-send-02"
    import IconMoneyReceive from "~icons/hugeicons/money-receive-flow-02"
    import IconLegalDocument from "~icons/hugeicons/legal-document-02"
    import IconMovements from "~icons/hugeicons/arrow-data-transfer-horizontal"
    import { sum } from "$lib/utils.svelte"
    import type { Snippet } from "svelte"
    
    interface Props {
        player: mono.Player
        ownerships: mono.Ownerships
        onRemoveClick: () => void
        onReturn: () => void
        pay: () => void
        charge: () => void
        properties?: Snippet
        transactions?: Snippet
    }

    
    const tablist = [
        {id: "Propiedades", Icon: IconLegalDocument},
        {id: "Movimientos", Icon: IconMovements},
    ]
    
    const tabs = new Tabs({ value: tablist[0].id })

    const {
        player,
        ownerships,
        onRemoveClick,
        onReturn,
        pay,
        charge,
        properties,
        transactions
    }: Props = $props()

    // TODO: capital acumulado

    const capital = $derived(
        player.money +
        mono.filterOwner(ownerships, player.id).reduce(
            sum((curr) =>
                ((prop = mono.properties[curr.id]) =>
                    (curr.mortgaged ? 0 : prop.price) +
                    (prop.kind === "lot"
                        ? curr.houses * prop.housing
                        : 0))()
            ),
            0
        )
    )
    

    const [send, receive] = crossfade({
        duration: 250,
        easing: cubicInOut,
    });
</script>

<section class="pal-{player.color} surface-colors">
    <header>
        <nav>
            <button onclick={onReturn} class="flat">
                <Icon use="ic-arrow-back" />
            </button>
            <h2>{player.name}</h2>
        </nav>
    </header>
    <div class="account plastic">
        <div class="value">
            {#if player === mono.BANK}
                <p><Icon class="bank" use="ic-account-balance" /></p>
                <p class="big">Banco</p>
            {:else}
                <p class="label">Balance en cuenta</p>
                <p class="big">$ {player.money.toLocaleString(undefined, {
                    useGrouping: "always"
                })}</p>
                <p class="label">Capital estimado $ {capital.toLocaleString(undefined, {
                    useGrouping: "always"
                })}</p>
                
            {/if}
        </div>

        <div class="actions">
            <button onclick={() => pay()}>
                <IconMoneySend />
                Enviar
            </button>
            <button onclick={() => charge()}>
                <IconMoneyReceive />
                Cobrar
            </button>
        </div>

        <button onclick={onRemoveClick} class="delete flat">
            <Icon use="ic-delete" />
        </button>
    </div>
    <div
        {...tabs.triggerList}
        class="tablist"
        aria-label="Información del jugador"
    >
        {#each tablist as {Icon, id}}
            <button class="flat" {...tabs.getTrigger(id)}>
                <Icon />
                {id}
                {#if tabs.value === id}
                    <div in:receive={{ key: "trigger" }} out:send={{ key: "trigger" }} class="underline"></div>
                {/if}
            </button>
        {/each}
    </div>
    <main {...tabs.getContent(tablist[0].id)}>
        {@render properties?.()}
    </main>
    <main {...tabs.getContent(tablist[1].id)}>
        {@render transactions?.()}
    </main>
</section>

<style>
    section {
        display: grid;
        background-color: var(--bg3);
        height: 100%;
        max-height: 100%;
        grid-template-rows: auto auto auto 1fr;
    }
    nav {
        display: flex;
    }
    main {
        overflow: auto;
        height: 100%;
        max-height: 100%;
    }
    header {
        height: 3rem;
        
        & nav {
            display: grid;
            grid-template-columns: auto 1fr;
            padding-right: .5rem;
        }
        & h2 {
            justify-self: end;
            align-self: center;
            align-items: center;
            display: flex;
            background-color: var(--bg0);
            padding: 0 .5rem 0 .25rem;
            border-radius: 2rem;
            height: 2rem;

            &::before {
                content: "";
                width: 1.5rem;
                height: 1.5rem;
                background-color: var(--c60);
                border-radius: 1.5rem;
                margin-right: .5rem;
            }
        }
    }
    .account {
        margin: 1rem;
        display: grid;
        grid-template-rows: 1fr auto;
        padding: 1rem;
        height: 12rem;
        background-image: linear-gradient(-10deg in oklch, var(--c60), var(--bg));
        position: relative;
    }
    .delete {
        position: absolute;
        top: 0;
        right: 0;
        color: var(--c60);
    }
    .label {
        color: var(--c60);
        font-size: .94rem;
    }
    .big {
        font-weight: bold;
        font-size: 2.5rem;
        line-height: 1.2;
    }
    .actions {
        display: flex;
        justify-content: end;
        gap: 1rem;
        
        & button {
            /* width: 5rem;
            height: 3.5rem;
            padding: 0;
            flex-direction: column;
            font-size: small;
            gap: 0; */
            font-weight: bold;
        }
    }
    .tablist {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        & button {
            flex: 1 1 0;
            position: relative;

            &[aria-selected="true"] {
                color: var(--k60);
            }
        }
    }
    .tablist .underline {
        position: absolute;
        bottom: 0;
        left: 1rem;
        right: 1rem;
        height: .25rem;
        background-color: var(--k60);
        border-radius: .25rem;
    }
</style>
