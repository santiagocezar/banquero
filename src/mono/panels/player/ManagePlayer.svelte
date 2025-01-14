<script lang="ts">
    import {
        BANK,
        properties,
        rent,
        type Exchange,
        type MonopolyProperty,
        type Player,
    } from "$mono"
    import ManageProperty from "./ManageProperty.svelte"
    import PlayerInfo from "./PlayerInfo.svelte"

    interface Props {
        id: number
        player: Player
        onreturn: () => void
        exchange: (value: Exchange) => void
    }

    const { id, player, onreturn, exchange }: Props = $props()

    const filled = (value: Partial<Exchange>) =>
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

    const blockCount = $derived(
        player.properties.reduce(
            (count, p) => {
                count[properties[p.id].block] =
                    (count[properties[p.id].block] ?? 0) + 1

                return count
            },
            {} as Record<string, number>
        )
    )

    const prop: MonopolyProperty = $derived(
        //@ts-expect-error
        properties[player.properties[viewProperty].id]
    )
</script>

{#if viewProperty !== null}
    <ManageProperty
        owned={player.properties[viewProperty]}
        sameBlock={blockCount[prop.block]}
        onreturn={() => (viewProperty = null)}
        sell={(price) =>
            filled({
                charges: id,
                amount: price,
                buy: [viewProperty!],
            })}
        chargeRent={(rent) =>
            filled({
                charges: id,
                amount: rent,
            })}
        buyHouses={(amount, price) =>
            amount < 0
                ? filled({
                      charges: id,
                      pays: BANK,
                      amount: price * amount,
                      houses: -amount,
                  })
                : filled({
                      charges: BANK,
                      pays: id,
                      amount: price * amount,
                      houses: amount,
                  })}
        mortgage={(price) =>
            filled({
                charges: id,
                pays: BANK,
                amount: price,
                mortgage: [viewProperty!],
            })}
    />
{:else}
    <PlayerInfo
        {player}
        onpropertyselected={(id) => (viewProperty = id)}
        pay={() =>
            filled({
                charges: null,
                pays: id,
            })}
        charge={() =>
            filled({
                charges: id,
                pays: null,
            })}
        {onreturn}
    />
{/if}
