<script lang="ts">
    import * as mono from "$mono"
    import ManageProperty from "./ManageProperty.svelte"
    import PlayerInfo from "./PlayerInfo.svelte"

    interface Props {
        player: mono.Player
        ownerships: mono.Ownerships
        onreturn: () => void
        exchange: (value: mono.Exchange) => void
    }

    const { player, ownerships, onreturn, exchange }: Props = $props()

    const filled = (value: Partial<mono.Exchange>) =>
        exchange({
            charges: null,
            pays: null,
            amount: 0,
            mortgage: [],
            sell: [],
            buy: [],
            houses: 0,
            ...value,
        })

    let viewProperty: number | null = $state(null)

    const prop = $derived(
        viewProperty !== null ? mono.properties[viewProperty] : null
    )
</script>

{#if prop !== null}
    <ManageProperty
        id={prop.id}
        {ownerships}
        onreturn={() => (viewProperty = null)}
        sell={(price) =>
            filled({
                charges: player.id,
                amount: price,
                buy: [prop.id],
            })}
        chargeRent={(rent) =>
            filled({
                charges: player.id,
                amount: rent,
            })}
        buyHouses={(amount, price, housesFor) =>
            amount < 0
                ? filled({
                      charges: player.id,
                      pays: mono.BANK.id,
                      amount: -price * amount / 2,
                      houses: -amount,
                      housesFor
                  })
                : filled({
                      charges: mono.BANK.id,
                      pays: player.id,
                      amount: price * amount,
                      houses: amount,
                      housesFor
                  })}
        mortgage={(price) =>
            filled({
                charges: player.id,
                pays: mono.BANK.id,
                amount: price,
                mortgage: [prop.id],
            })}
    />
{:else}
    <PlayerInfo
        {player}
        {ownerships}
        onpropertyselected={(id) => (viewProperty = id)}
        pay={() =>
            filled({
                charges: null,
                pays: player.id,
            })}
        charge={() =>
            filled({
                charges: player.id,
                pays: null,
            })}
        {onreturn}
    />
{/if}
