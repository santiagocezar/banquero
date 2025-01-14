<script lang="ts">
    import { useGame } from "../lib/bxx.svelte"
    import PlayerList from "./PlayerList.svelte"
    import Transfer from "./panels/transfer/Transfer.svelte"
    import ManagePlayer from "./panels/player/ManagePlayer.svelte"
    import {
        type Player,
        type MonopolyProperty,
        type MonopolyGame,
        BANK,
        properties,
        mono,
        type Exchange,
    } from "."
    import Icon from "src/components/Icon.svelte"

    /*
    TODO:
    - [ ] Recents menu
    - [ ] Dynamic header text
    - [ ] Add help tab
    - [ ] Add history & standings (tablero) tab
    - [ ] Mortgage and lift mortgage
    - [ ] Mortgage taxes
    */

    const { id, data } = useGame(mono, (data) => true)
    /*
    data.players = [
        {
            name: "Santi",
            money: 1500,
            color: 7,
            properties: [0, 4, 7, 1].map((id) => ({
                id,
                houses: 2,
                mortgaged: false,
            })),
        },
        {
            name: "Flor",
            money: 1500,
            color: 3,
            properties: [2, 3, 6].map((id) => ({
                id,
                houses: 2,
                mortgaged: false,
            })),
        },
    ]*/

    type Mode =
        | { type: "list" }
        | { type: "adding" }
        | { type: "player-info"; id: number }
        | {
              type: "exchange"
              value: Exchange
          }

    let mode: Mode = $state({ type: "list" })

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
    function calculatePlayerValue(player: Player) {
        return (
            player.money +
            player.properties.reduce(
                (total, curr) =>
                    total +
                    (curr.mortgaged ? 0 : properties[curr.id].price) +
                    curr.houses * (properties[curr.id].housing ?? 0),
                0
            )
        )
    }
    function returnToList() {
        mode = { type: "list" }
    }
    function exchange(value: Exchange) {
        mode = { type: "exchange", value }
    }
    function confirmExchange(value: Exchange) {
        const pays: Player | undefined = data.players[value.pays!]
        const charges: Player | undefined = data.players[value.pays!]

        if (pays) {
            pays.money -= value.amount
            // TODO: taxes
        }
        if (charges) pays.money += value.amount

        const paysPropsById = new Map(pays.properties.map((p) => [p.id, p]))
        const chargesPropsById = new Map(
            charges.properties.map((p) => [p.id, p])
        )

        for (const p of value.buy) {
            paysPropsById.set(p, chargesPropsById.get(p)!)
            chargesPropsById.delete(p)
        }
        for (const p of value.sell) {
            chargesPropsById.set(p, paysPropsById.get(p)!)
            paysPropsById.delete(p)
        }
        pays.properties = [...paysPropsById.values()]
        charges.properties = [...chargesPropsById.values()]

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
            id={mode.id}
            player={data.players[mode.id]}
            {exchange}
            onreturn={returnToList}
        />
    {:else if mode.type == "exchange" && mode.value.pays !== null && mode.value.charges !== null}
        <Transfer
            cancelExchange={returnToList}
            bind:exchange={mode.value}
            {confirmExchange}
            players={data.players}
            bankProperties={[]}
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
                from={mode.type === "exchange" ? mode.value.pays : null}
                to={mode.type === "exchange" ? mode.value.charges : null}
                players={data.players}
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
