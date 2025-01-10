<script lang="ts">
    import { properties, type Player } from "$mono"
    import ManageProperty from "./ManageProperty.svelte"
    import PlayerInfo from "./PlayerInfo.svelte"

    interface Props {
        player: Player
    }

    const { player }: Props = $props()

    let viewProperty: number | null = $state(null)

    let blockCount = $derived(
        player.properties.reduce(
            (count, p) => {
                count[properties[p.id].block] =
                    (count[properties[p.id].block] ?? 0) + 1

                return count
            },
            {} as Record<string, number>
        )
    )
</script>

{#if viewProperty !== null}
    <ManageProperty
        owned={player.properties[viewProperty]}
        sameBlock={blockCount[properties[viewProperty].block]}
        onreturn={() => (viewProperty = null)}
    />
{:else}
    <PlayerInfo {player} onpropertyselected={(id) => (viewProperty = id)} />
{/if}
