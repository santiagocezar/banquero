<script lang="ts">
    import { useGame } from "$lib/bxx.svelte"
    import * as mono from "."
    import { sum } from "$lib/utils.svelte"

    import PlayerList from "./PlayerList.svelte"
    import Transfer from "./panels/transfer/Transfer.svelte"
    import AddPlayer from "./panels/add/AddPlayer.svelte"

    import Icon from "$lib/components/Icon.svelte"
    import PlayerInfo from "./panels/player/PlayerInfo.svelte"
    import ManageProperty from "./panels/player/ManageProperty.svelte"
    import ConfirmTransfer from "./panels/transfer/ConfirmTransfer.svelte"
    import { useMonoServer } from "./ws.svelte"

    /*
    TODO:
    - [ ] Recents menu
    - [x] Dynamic header text
    - [ ] Add help tab
    - [ ] Add history & standings (tablero) tab
    - [ ] Mortgage and lift mortgage
    - [ ] Mortgage taxes
    - [x] Buy and sell houses
    - [x] Check if the Enter key works on transfer
    - [x] Fix transfer gradient somehow
    */

    interface DefaultExchange {
        pays: number | null,
        charges: number | null,
        defaultAmount: number,
        defaultSell: number | null,
    }

    type Mode =
        | { type: "list" }
        | { type: "adding" }
        | { type: "player-info"; id: number }
        | { type: "manage-property"; id: number }
        | ({
              type: "exchange"
          } & DefaultExchange)
        | {
              type: "confirm-exchange"
              value: mono.Exchange
          }

    type ModeSet<Type extends Mode["type"]> = Extract<Mode, { type: Type }>
    
    const { data } = useGame(mono.game, () => true)      

    let mode: Mode = $state({ type: "list" })

    let maxID = $state(Math.max(0, ...data.players.map((p) => p.id)))

    const playerIndex = $derived(mono.indexPlayers(data.players))

    const syncData = useMonoServer(data)

    /*** FUNCTIONS THAT CHANGE THE GAME STATE ***/

    function onPlayerRemove(id: number) {
        data.players = mono.removePlayer(data.players, id)
        data.owners = mono.removeOwnershipsForPlayer(data.owners, id)
        syncData()
    }

    function doExchange(value: mono.Exchange) {
        console.log(value)
        console.log('before:', $state.snapshot(data.players))
        const after = mono.applyExchangeToPlayers(data.players, value)
        console.log('after:', $state.snapshot(after))
        data.players = after
        data.owners = mono.applyExchangeToOwnerships(data.owners, value)
        
        syncData()
        returnToList()
    }

    function addPlayer(name: string, color: number) {
        data.players.push({
            id: ++maxID,
            name,
            color,
            money: data.defaultMoney,
        })
        
        syncData()
        returnToList()
    }
        

    /*** those that don't ***/

    function calculatePlayerValue(player: mono.Player) {
        return (
            player.money +
            mono.filterOwner(data.owners, player.id).reduce(
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
    }
    
    function onPlayerClick(id: number) {
        console.log(id)
        if (mode.type === "exchange") {
            // if (mode.value.houses !== 0 || mode.value.mortgage.length > 0) return
            
            if (id === mode.pays) {
                mode.pays = null
            } else if (id === mode.charges) {
                mode.charges = null
            } else if (mode.pays !== null) {
                mode.charges = id
            } else {
                mode.pays = id
            }

            // TODO: cancel when both are null maybe?
        } else {
            mode = { type: "player-info", id }
        }
    }

    function onPropertyClick(id: number) {
        mode = { type: "manage-property", id }
    }

    function onAddClick() {
        mode = { type: "adding" }
    }

    function returnToList() {
        mode = { type: "list" }
    }
    
    function startExchange(data: Partial<DefaultExchange>) {
        mode = {
            type: "exchange",
            pays: null,
            charges: null,
            defaultAmount: 0,
            defaultSell: null,
            ...data,
        }
    }

    function askForExchange(value: mono.Exchange) {
        mode = {
            type: "confirm-exchange",
            value
        }
    }
    
    /*
    const transactionItems = useMemo(
        () =>
            history.map((h) => (
            )),
        [history]
    )*/
</script>

{#snippet playerInfo(props: ModeSet<"player-info">)}
    <PlayerInfo
        player={playerIndex.get(props.id)!}
        ownerships={data.owners}
        {onPropertyClick}
        onRemoveClick={() => onPlayerRemove(props.id)}
        pay={() => startExchange({
            pays: props.id,
        })}
        charge={() => startExchange({
            charges: props.id,
        })}
        onReturn={returnToList}
    />
{/snippet}

{#snippet manageProperty(props: ModeSet<"manage-property">)}
    <ManageProperty
        id={props.id}
        ownerships={data.owners}
        onReturn={onPlayerClick}
        sell={(charges, price) => startExchange({
            charges,
            defaultAmount: price,
            defaultSell: props.id
        })}
        chargeRent={(charges, rent) => startExchange({
            charges,
            defaultAmount: rent,
        })}
        buyHouses={(owner, amount, price) => askForExchange({
            pays: {
                id: amount > 0 ? owner : mono.BANK.id,
                ownerships: [{
                    id: props.id, 
                    builds: amount,
                }]
            },
            charges: { id: amount > 0 ? mono.BANK.id : owner },
            amount: price * (amount > 0 ? amount : -amount / 2),
        })}
        mortgage={(owner, price) => askForExchange({
            pays: {
                id: mono.BANK.id,
                ownerships: [{
                    id: props.id,
                    mortgage: "loan"
                }]
            },
            charges: { id: owner },
            amount: price,
        })}
    />
{/snippet}

{#snippet exchange(props: ModeSet<"exchange">)}
    <Transfer
        ownerships={data.owners}
        pays={props.pays === null ? null : (playerIndex.get(props.pays) ?? null)}
        charges={props.charges === null ? null : (playerIndex.get(props.charges) ?? null)}
        defaultAmount={props.defaultAmount}
        defaultSell={props.defaultSell}
        onSwitchClick={(who) => mode = { ...props, [who]: null } }
        onCancel={returnToList}
        onSubmit={doExchange}
    />
{/snippet}

{#snippet confirmExchange(props: ModeSet<"confirm-exchange">)}
    <ConfirmTransfer
        pays={playerIndex.get(props.value.pays.id)!}
        charges={playerIndex.get(props.value.charges.id)!}
        value={props.value}
        onConfirm={() => doExchange(props.value)}
    />
{/snippet}
<!--
<SelectionProvider>
    <Paneled
        mainView={(
            <MainView>
-->
<!-- <SendMoney /> -->
<div class="panels">
    <div class="list">
        <header>
            {#if mode.type == "exchange"}
            <button onclick={returnToList} class="flat">
                <Icon use="ic-close" />
            </button>
            {:else}
            <button onclick={() => history.back()} class="flat">
                <Icon use="ic-home" />
            </button>
            {/if}
            <h1>{mode.type === "exchange" ? "Seleccione 2 jugadores" : "Lista de jugadores"}</h1>
            <button class="flat" id="share">
                <Icon use="ic-share" />
            </button>
        </header>
        <PlayerList
            players={data.players}
            ownerships={data.owners}
            from={mode.type === "exchange" ? mode.pays : null}
            to={mode.type === "exchange" ? mode.charges : null}
            onClick={onPlayerClick}
            onAddClick={onAddClick}
        />
    </div>
    <div
        class="sidebar"
        data-active={!(
            mode.type === "list" ||
            (mode.type === "exchange" &&
            (mode.pays === null || mode.charges === null))
        )}
    >
        {#key mode.type}
            {#if mode.type == "player-info"}
                {@render playerInfo(mode)}
            {:else if mode.type == "manage-property"}
                {@render manageProperty(mode)}
            {:else if mode.type == "exchange"}
                {@render exchange(mode)}
            {:else if mode.type == "confirm-exchange"}
                {@render confirmExchange(mode)}
            {:else if mode.type == "adding"}
                <AddPlayer onadd={addPlayer} />
            {/if}
        {/key}
    </div>
</div>

<!--
            </MainView>
        )}
    >
        <Panel icon={(<MdHistory />)} name="Historial">
-->

<!--
        </Panel>
        <Panel icon={(<MdLeaderboard />)} name="Rankings">
            <Leaderboard hooks={mono} calculate={calculatePlayerValue} />
        </Panel>
        <Panel icon={(<MdBusiness />)} name="Propiedades">
            <MPProperties {properties} />
        </Panel>
        {useAddPlayerPanel(onPlayerAdded)}
    </Paneled>
</SelectionProvider>
-->

<style>
    .panels {
        display: grid;
        grid-template: "sidebar" 1fr / 1fr;
        height: 100%;
        gap: 0.5rem;
        overflow: hidden;
        user-select: none;
    }
    .sidebar {
        display: none;
        grid-area: sidebar;
        background-color: var(--bg2);
        z-index: 10;
        overflow: hidden;
        &[data-active="true"] {
            display: block;
        }
    }
    .list {
        grid-area: sidebar;
    }
    @media screen and (min-width: 60rem) {
        .panels {
            grid-template: "list sidebar" 1fr / 1fr 30rem;
        }
        .list {
            grid-area: list;
        }
        .sidebar {
            border-radius: 0.5rem;
            border: 1px solid var(--bg0);
            box-shadow: 0 1px 4px var(--bg0);
            margin: 1rem;
            display: block;
        }
    }
    header {
        display: flex;
        padding: 0.5rem;
        align-items: center;
        position: relative;
        --c50: initial;
        
        
        & button {
            background-color: transparent;
            color: inherit;
        }
        & h1 {
            font-size: 1.4rem;
            font-weight: bold;
            flex-grow: 1;
            text-align: left;
        }
    }
</style>
