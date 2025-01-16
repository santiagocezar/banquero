<script lang="ts">
    import { useGame } from "../lib/bxx.svelte"
    import * as mono from "."
    import { sum } from "$lib/utils.svelte"

    import PlayerList from "./PlayerList.svelte"
    import Transfer from "./panels/transfer/Transfer.svelte"
    import ManagePlayer from "./panels/player/ManagePlayer.svelte"
    import AddPlayer from "./panels/add/AddPlayer.svelte"

    import Icon from "src/components/Icon.svelte"

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

    type Mode =
        | { type: "list" }
        | { type: "adding" }
        | { type: "player-info"; id: number }
        | {
              type: "exchange"
              value: mono.Exchange
          }

    let mode: Mode = $state({ type: "list" })

    let maxID = $state(Math.max(0, ...data.players.map((p) => p.id)))

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
                    owner: b.id,
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
    function addPlayer(name: string, color: number) {
        data.players.push({
            id: ++maxID,
            name,
            color,
            money: data.defaultMoney,
        })
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
    <div
        class="sidebar"
        data-active={!(
            mode.type === "list" ||
            (mode.type === "exchange" &&
                (mode.value.pays === null ||
                mode.value.charges === null))
        )}
    >
        {#if mode.type == "player-info"}
            <ManagePlayer
                player={playerIndex.get(mode.id) ?? mono.BANK}
                ownerships={data.owners}
                {exchange}
                onreturn={returnToList}
            />
        {:else if mode.type == "exchange"}
            <Transfer
                players={playerIndex}
                ownerships={data.owners}
                cancelExchange={returnToList}
                bind:exchange={mode.value}
                {confirmExchange}
            />
        {:else if mode.type == "adding"}
            <AddPlayer onadd={addPlayer} />
        {/if}
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
            overflow: hidden;
            display: block;
        }
    }
    header {
        display: flex;
        justify-content: space-between;
        padding: 0.5rem;
        align-items: center;
    }
</style>
