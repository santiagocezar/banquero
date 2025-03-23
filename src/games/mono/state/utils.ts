import { count } from "$lib/utils.svelte"
import { BANK, properties } from "./global"
import type { Exchange, Ownership, Ownerships, Player } from "./schema"

export function rent(owners: Ownerships, id: number) {
    const own = owners[id]
    const prop = properties[id]
    let sameBlock = prop.group.reduce(count(id => !!own && owners[id]?.owner === own.owner), 0)

    return !own ? prop.rent[0] :
        prop.kind === "lot" ? own.houses > 0 ? prop.rent[own.houses]
            : prop.rent[0] * (sameBlock == prop.group.length ? 2 : 1)
            : prop.rent[sameBlock - 1]
}

export function transferTax(owns: Ownership) {
    const prop = properties[owns.id]

    return owns.mortgaged ? prop.price / 20 : 0
}

/**
 * Get ownership data for certain player (except the bank).
 * @param owners Full ownership data
 * @param id ID of owner to use as filter, doesn't work with the bank
 * @returns The ownership data for that ID
 */
export function filterOwner(owners: Ownerships, id: number): Ownership[] {
    return owners.filter((o): o is NonNullable<typeof o> => o !== null && o.owner === id)
}

/**
 * Get the property ID for those owned by certain player,
 * or owned by no one if BANK.id is passed.
 * @param owners Full ownership data
 * @param id ID of owner to use as filter
 * @returns The property IDs owned by that ID
 */
export function filterOwnerIDs(owners: Ownerships, playerID: number): number[] {
    return owners.flatMap((o, id) => (
        o === null
            ? playerID == BANK.id
                ? [id]
                : []
            : o.owner === playerID
                ? [id]
                : []
    ))
}

/**
 * Get the owner of certain property
 * @param owners Full ownership data
 * @param id ID of the property
 * @returns The player ID for the owner
 */
export const getOwner = (owners: Ownerships, id: number) => (
    owners[id]?.owner ?? BANK.id
)

export function indexPlayers(players: Player[]) {
    return new Map(players.concat(BANK).map(p => [p.id, p]))
}

export const getPlayer = (players: Map<number, Player>, id: number | null) => (
    id === null ? undefined :
    id === BANK.id ? BANK :
    players.get(id)
)

export const findPlayerIndex = (players: Player[], id: number) => (
    id === BANK.id 
        ? -1                                              // we already know the bank is not a real player
        : players.findIndex(player => player.id === id)   // find it if it's real
)

export const newOwnership = (id: number, owner: number) => ({
        id,
        owner,
        houses: 0,
        mortgaged: false,
})

