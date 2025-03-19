import { BANK } from "./global"
import type { Exchange, ExchangeOwnership, ExchangeParty, Ownership, Ownerships, Player } from "./schema"
import { findPlayerIndex, newOwnership } from "./utils"

export function applyExchangeToPlayers(prevPlayers: Player[], ex: Exchange): Player[] {
    const players = prevPlayers.slice()
    const paysIndex = findPlayerIndex(players, ex.pays.id)
    const chargesIndex = findPlayerIndex(players, ex.charges.id)

    if (paysIndex !== null) {
        players[paysIndex] = addMoney(players[paysIndex], -ex.amount)
    }
    if (chargesIndex !== null) {
        players[chargesIndex] = addMoney(players[chargesIndex], ex.amount)
    }
    return players
}

export function applyExchangeToOwnerships(prevOwnerships: Ownerships, ex: Exchange): Ownerships {
    const ownerships = prevOwnerships.slice()

    console.dir(ex)

    const apply = ({ id, soldTo, builds, mortgage }: ExchangeOwnership) => {
        if (soldTo === BANK.id) {
            ownerships[id] = null
        } else {
            if (soldTo !== undefined) {
                ownerships[id] = (
                    ownerships[id] === null ? newOwnership(id, soldTo) :
                    changeOwner(ownerships[id], soldTo)
                )
            }
            if (builds !== undefined) { ownerships[id] = buildHouses(ownerships[id], builds) }
            if (mortgage !== undefined) { ownerships[id] = setMortgage(ownerships[id], mortgage === "loan") }
        }
    }

    if (ex.pays.ownerships) { ex.pays.ownerships.forEach(apply) }
    if (ex.charges.ownerships) { ex.charges.ownerships.forEach(apply) }

    return ownerships
}

function setK<T, K extends keyof T>(object: T, key: K, value: T[K]): T {
    return (
        object[key] === value ? object :
        { ...object, [key]: value }
    )
}

export function addMoney(prev: Player, amount: number): Player {
    return setK(prev, "money", prev.money + amount)
}

export function changeOwner(ownership: Ownership, owner: number): Ownership {
    return setK(ownership, "owner", owner)
}

export function buildHouses(ownership: Ownership | null, amount: number): Ownership | null {
    return (
        ownership && 
        setK(ownership, "houses", Math.max(0, Math.min(5, ownership.houses + amount)))
    )
}

export function setMortgage(ownership: Ownership | null, mortgaged: boolean): Ownership | null {
    return (
        ownership && 
        setK(ownership, "mortgaged", mortgaged)
    )
}

export function removePlayer(prevPlayers: Player[], id: number): Player[] {
    return prevPlayers.filter((player) => (
        player.id !== id
    ))
}

export function removeOwnershipsForPlayer(prevOwnerships: Ownerships, id: number): Ownerships {
    return prevOwnerships.map((ownership) => (
        ownership !== null && ownership.owner === id
            ? null
            : ownership
    ))
}