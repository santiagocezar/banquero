<script lang="ts">
    import { useGame } from "../lib/bxx.svelte"
    import PlayerList from "./PlayerList.svelte"
    import Transfer from "./panels/transfer/Transfer.svelte"
    import ManagePlayer from "./panels/player/ManagePlayer.svelte"
    import * as mono from "."
    import Icon from "src/components/Icon.svelte"
    import { sum } from "$lib/utils.svelte"

    /*
    TODO:
    - [ ] Recents menu
    - [ ] Dynamic header text
    - [ ] Add help tab
    - [ ] Add history & standings (tablero) tab
    - [ ] Mortgage and lift mortgage
    - [ ] Mortgage taxes
    - [ ] Check if the Enter key works on transfer
    */

    const { data } = useGame(mono.game, () => true)
        
    data.players = [
        {
            id: 0,
            name: "Santi",
            money: 1500,
            color: 7,
        },
        {
            id: 1,
            name: "Flor",
            money: 1500,
            color: 3,
        },
    ];
    
    {[0, 4, 7, 1].forEach(id => { data.owners[id] = { id, houses: 1, owner: 0, mortgaged: false } })}
    {[2, 3, 6].forEach(id => data.owners[id] = { id, houses: 1, owner: 1, mortgaged: false })}

    console.log($state.snapshot(mono.filterOwner(data.owners, 0)))
    
    type Mode =
        | { type: "list" }
        | { type: "adding" }
        | { type: "player-info"; id: number }
        | {
              type: "exchange"
              value: mono.Exchange
          }

    let mode: Mode = $state({ type: "list" })

    const playerIndex = $derived(mono.indexPlayers(data.players))
    
    function onPlayerClick(id: number) {
        console.log(id)
        if (mode.type === "exchange") {
            if (id === mode.value.pays) {
                mode.value.pays = null
            } else if (id === mode.value.charges) {
                mode.value.charges = null
            } else if (mode.value.pays !== null) {
                mode.value.charges = id
            } else {
                mode.value.pays = id
            }

            // TODO: cancel when both are null maybe?
        } else {
            mode = { type: "player-info", id }
        }
    }

    function onAddClick() {
        mode = { type: "adding" }
    }

    function onPlayerDelete(id: number) {
        // TODO: Restore properties
        // if (deletingPlayer !== null) {
        //     board.remove(deletingPlayer);
        //     if (from === deletingPlayer)
        //         setFrom(null);
        //     if (to === deletingPlayer)
        //         setTo(null);
        //     setDeletingPlayer(null);
        // }
    }
    function calculatePlayerValue(player: mono.Player) {
        return (
            player.money +
            mono.filterOwner(data.owners, player.id).reduce(
                sum((curr) => ((prop = mono.properties[curr.id]) =>
                    (curr.mortgaged ? 0 : prop.price) +
                    (prop.kind === "lot" ? curr.houses * prop.housing : 0)
                )()),
                0
            )
        )
    }
    function returnToList() {
        mode = { type: "list" }
    }
    function exchange(value: mono.Exchange) {
        mode = { type: "exchange", value }
    }
    function changeOwnership(a: mono.Player, b: mono.Player, props: number[]) {
        for (const id of props) {
            if (b === mono.BANK) {
                data.owners[id] = null
            } else {
                data.owners[id] ??= {
                    id,
                    houses: 0,
                    mortgaged: false,
                    owner: b.id
                }
                data.owners[id].owner = b.id
            }
        }
    }
    function confirmExchange(value: mono.Exchange) {
        const pays = playerIndex.get(value.pays!) ?? mono.BANK
        const charges = playerIndex.get(value.charges!) ?? mono.BANK

        changeOwnership(charges, pays, value.buy)
        changeOwnership(pays, charges, value.sell)
        
        if (pays) {
            pays.money -= value.amount
            // TODO: taxes
        }
        if (charges) {
            charges.money += value.amount
        }

        returnToList()
    }
    /*
    const transactionItems = useMemo(
        () =>
            history.map((h) => (
            )),
        [history]
    )*/
</script>

<!--
<SelectionProvider>
    <Paneled
        mainView={(
            <MainView>
-->
<!-- <SendMoney /> -->
<div class="panels">
    {#if mode.type == "player-info"}
        <ManagePlayer
            player={playerIndex.get(mode.id) ?? mono.BANK}
            ownerships={data.owners}
            {exchange}
            onreturn={returnToList}
        />
    {:else if mode.type == "exchange" && mode.value.pays !== null && mode.value.charges !== null}
        <Transfer
            players={playerIndex}
            ownerships={data.owners}
            cancelExchange={returnToList}
            bind:exchange={mode.value}
            {confirmExchange}
        />
    {:else}
        <div class="list">
            <header>
                <button onclick={() => history.back()} class="button back">
                    <Icon use="ic-arrow-back" />
                </button>
                <h1>Lista de jugadores</h1>
                <button class="button" id="share">
                    <Icon use="ic-share" />
                </button>
            </header>
            <PlayerList
                players={data.players}
                ownerships={data.owners}
                from={mode.type === "exchange" ? mode.value.pays : null}
                to={mode.type === "exchange" ? mode.value.charges : null}
                onclick={onPlayerClick}
                onclickadd={onAddClick}
                ondelete={onPlayerDelete}
            />
        </div>
    {/if}
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
        grid-template-columns: 1fr;
        height: 100%;
        gap: 0.5rem;
        overflow: hidden;
        user-select: none;
    }
    header {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
        align-items: center;
    }
</style>
