<script lang="ts">
    import { useGame } from "../lib/bxx.svelte"
    import PlayerList from "./PlayerList.svelte"
    import Transfer from "./Transfer.svelte"
    import ManagePlayer from "./panels/player/ManagePlayer.svelte"
    import {
        type Player,
        type MonopolyProperty,
        type MonopolyGame,
        properties,
        mono,
    } from "."

    // import MdHistory from '~icons/ic/round-history';
    // import MdLeaderboard from '~icons/ic/round-leaderboard';
    // import MdBusiness from '~icons/ic/round-business';

    // import { Panel, Paneled } from 'components/panels';

    // import { MPProperties } from './MPProperties';
    // import { useAddPlayerPanel } from 'components/panels/AddPlayer';
    // import { SendMoney } from './SendMoney';
    // import { styled } from 'lib/theme';
    // import { Leaderboard } from 'components/panels/Leaderboard';
    // import { PlayerList } from './PlayerList';
    // import { SelectionProvider } from './Selection';
    // import { HEADER_HEIGHT } from 'components/Header';

    const { id, data } = useGame(mono, (data) => true)

    data.players = [
        {
            name: "Santi",
            money: 1500,
            color: 2,
            properties: properties.map((p) => ({
                id: p.id,
                houses: 2,
                mortgaged: false,
            })),
        },
    ]

    let from: number | null = $state(null)
    let to: number | null = $state(null)
    let transferAmount: number = $state(0)
    let gives: number[] = $state([])
    let recieves: number[] = $state([])
    let houses: number = $state(0)

    // TODO: this right away when the player gets added
    // function onPlayerAdded(id: number) {
    // board.set(pid, fields => {
    // fields.money = defaultMoney;
    // });
    // }

    function onPlayerClick(id: number) {
        console.log(id)
        if (id === from) {
            from = null
        } else if (id === to) {
            to = null
        } else if (from !== null) {
            to = id
        } else {
            from = id
        }
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
<main>
    <!--<PlayerList
        bind:from
        bind:to
        players={data.players}
        onclick={onPlayerClick}
        ondelete={onPlayerDelete}
    />-->
    <ManagePlayer player={data.players[0]} />
    <!--<Transfer
        {from}
        {to}
        players={data.players}
        {gives}
        {recieves}
        value={transferAmount}
        {houses}
    />-->
</main>
<!--
            </MainView>
        )}
    >
        <Panel icon={(<MdHistory />)} name="Historial">
-->
<ul class="history">
    {#each data.history as item (item.id)}
        <li>
            <div>
                <span class="name">{item.action}</span>
                <span class="pts">${item.money}</span>
            </div>
        </li>
    {/each}
    <p class="empty">Historial vacío.</p>
</ul>

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
    main {
        display: grid;
        /*         grid-template-columns: 2fr 1fr 1fr; */
        grid-template-columns: 1fr;
        height: 100%;
        gap: 0.5rem;
        overflow: hidden;
    }
</style>
