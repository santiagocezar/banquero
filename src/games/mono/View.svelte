<script lang="ts">
    import { useGame } from "$lib/bxx.svelte"
    import * as mono from "."
    import { sum } from "$lib/utils.svelte"

    import PlayerList from "./PlayerList.svelte"
    import Transfer from "./panels/transfer/Transfer.svelte"
    import AddPlayer from "./panels/add/AddPlayer.svelte"

    import Icon from "$lib/components/Icon.svelte"
    import PlayerInfo from "./panels/player/PlayerInfo.svelte"
    import ManageProperty from "./properties/PropertyManager.svelte"
    import ConfirmTransfer from "./panels/transfer/ConfirmTransfer.svelte"
    import { useMonoServer } from "./ws.svelte"
    import PaneledView from "$lib/components/PaneledView.svelte"
    import PropertyList from "./properties/PropertyList.svelte"

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
        | { type: "player-info"; playerID: number, propertyID?: number }
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
        viewList()
    }

    function addPlayer(name: string, color: number) {
        data.players.push({
            id: ++maxID,
            name,
            color,
            money: data.defaultMoney,
        })
        
        syncData()
        viewList()
    }
        

    /*** those that don't ***/

    function viewPlayerInfo(playerID: number, propertyID?: number) {
        mode = {
            type: "player-info",
            playerID,
            propertyID,
        }
    }

    function viewAddPlayer() {
        mode = { type: "adding" }
    }

    function viewList() {
        mode = { type: "list" }
    }

    function viewExchange(data: Partial<DefaultExchange>) {
        mode = {
            type: "exchange",
            pays: null,
            charges: null,
            defaultAmount: 0,
            defaultSell: null,
            ...data,
        }
    }

    function viewConfirmExchange(value: mono.Exchange) {
        mode = {
            type: "confirm-exchange",
            value
        }
    }

    function onPlayerClick(id: number) {
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
            viewPlayerInfo(id)
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
    {@const player = playerIndex.get(props.playerID)!}

    {#key player.id}
        <PlayerInfo
            {player}
            ownerships={data.owners}
            onRemoveClick={() => onPlayerRemove(player.id)}
            pay={() => viewExchange({
                pays: player.id,
            })}
            charge={() => viewExchange({
                charges: player.id,
            })}
            onReturn={viewList}
        >
            {#snippet properties()}
                <PropertyList 
                    ownerships={data.owners} 
                    owner={player.id} 
                    onPropertyClick={(id) => viewPlayerInfo(player.id, id)}
                    displayPrice={player === mono.BANK}
                    selected={props.propertyID}
                    cards={player !== mono.BANK} 
                />
                {#if props.propertyID !== undefined}
                    {@const id = props.propertyID}

                    <ManageProperty
                        {id}
                        ownerships={data.owners}
                        onReturn={() => viewPlayerInfo(player.id)}
                        sell={(charges, price) => viewExchange({
                            charges,
                            defaultAmount: price,
                            defaultSell: props.propertyID
                        })}
                        chargeRent={(charges, rent) => viewExchange({
                            charges,
                            defaultAmount: rent,
                        })}
                        buyHouses={(owner, amount, price) => viewConfirmExchange({
                            pays: {
                                id: amount > 0 ? owner : mono.BANK.id,
                                ownerships: [{
                                    id, 
                                    builds: amount,
                                }]
                            },
                            charges: { id: amount > 0 ? mono.BANK.id : owner },
                            amount: price * (amount > 0 ? amount : -amount / 2),
                        })}
                        mortgage={(owner, price) => viewConfirmExchange({
                            pays: {
                                id: mono.BANK.id,
                                ownerships: [{
                                    id,
                                    mortgage: "loan"
                                }]
                            },
                            charges: { id: owner },
                            amount: price,
                        })}
                    />
                {/if}
            {/snippet}
        </PlayerInfo>
    {/key}
{/snippet}

{#snippet exchange(props: ModeSet<"exchange">)}
    <Transfer
        ownerships={data.owners}
        pays={mono.getPlayer(playerIndex, props.pays)}
        charges={mono.getPlayer(playerIndex, props.charges)}
        defaultAmount={props.defaultAmount}
        defaultSell={props.defaultSell}
        
        onSwitchClick={(who) => mode = { ...props, [who]: null } }
        onCancel={viewList}
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

<PaneledView activeSidebar={!(
    mode.type === "list" ||
    (mode.type === "exchange" &&
    (mode.pays === null || mode.charges === null))
)}>
    <header>
        {#if mode.type == "exchange"}
        <button onclick={viewList} class="flat">
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
        onAddClick={viewAddPlayer}
    />

    {#snippet sidebar()}
        {#key mode.type}
            {#if mode.type == "player-info"}
                {@render playerInfo(mode)}
            {:else if mode.type == "exchange"}
                {@render exchange(mode)}
            {:else if mode.type == "confirm-exchange"}
                {@render confirmExchange(mode)}
            {:else if mode.type == "adding"}
                <AddPlayer onadd={addPlayer} />
            {/if}
        {/key}
    {/snippet}
</PaneledView>

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
