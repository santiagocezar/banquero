import { type Game } from '../lib/bxx.svelte';
import { z } from "zod";
import { properties as untypedProperties } from "./hasbro_argentina_group.json"
import { count } from '$lib/utils.svelte';

export const properties = untypedProperties as MonopolyProperty[]

export type MonopolyProperty = {
    id: number;
    name: string;
    price: number;
    color: string;
    group: number[];
    rent: number[];
} & ({
    kind: "lot"
    housing: number;
} | {
    kind: 'station' | 'service';
});

export interface Transfer {
    from?: number,
    to?: number,
    prop?: number;
    defaultValue?: number;
}

export const Transaction = z.object({
    id: z.number(),
    action: z.string(),
    money: z.number(),
})
export type Transaction = z.infer<typeof Transaction>

export const Ownership = z.object({
    id: z.number(),
    owner: z.number(),
    houses: z.number().default(0),
    mortgaged: z.boolean().default(false),
})
export type Ownership = z.infer<typeof Ownership>

export const Player = z.object({
    id: z.number(),
    name: z.string(),
    color: z.number(),
    money: z.number(),
})
export type Player = z.infer<typeof Player>

//export type ResolvedProperty = Omit<OwnedProperty, 'id'> & {prop: MonopolyProperty}

const MonopolyGame = z.object({
    defaultMoney: z.number(),
    players: z.array(Player),
    history: z.array(Transaction),
    owners: z.array(z.nullable(Ownership)),
})
export type MonopolyGame = z.infer<typeof MonopolyGame>
export type Ownerships = z.infer<typeof MonopolyGame>["owners"]

export const game: Game<MonopolyGame> = {
    identifier: 'mono',
    validate: MonopolyGame.parse,
    initial: () => ({
        defaultMoney: 1500,
        players: [],
        history: [],
        owners: properties.map(() => null),
    }),
    reset: (old) => ({
        defaultMoney: old.defaultMoney,
        players: old.players.map(player => ({
            ...player,
            money: old.defaultMoney,
        })),
        history: [],
        owners: properties.map(() => null),
    })
};

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
export function getOwner(owners: Ownerships, id: number): number {
    return owners[id]?.owner ?? BANK.id
}
export const BANK: Player = {
    id: -1,
    name: "Banco",
    color: -1,
    money: 0,
};

export interface ExParty {
    /** ID of the player */
    id: number
    /**
     * Properties sold.
     * 
     * This way the value is always valid, since it's linked to the player that
     * actually owns those properties.
     * 
     * If it stored the properties A purchases from party B, when B is changed
     * to C, A would still reference the properties owned by B, which C does
     * not have, therefore is invalid.
     */
    sells: number[]
}

export interface Exchange {
    pays: ExParty
    charges: ExParty
    
    /** Amount of money exchanged between parties */    
    amount: number
    /** Properties to mortage */
    mortgage: number[]
    /** Properties lift their mortage */
    liftMortgage: number[]
    /** Amount of buildings added to the property defined by {@link ExParty#buildingsFor} */
    buildings: number
    /** Property to add the buildings */
    buildingsFor: number
}

export function indexPlayers(players: Player[]) {
    return new Map(players.concat(BANK).map(p => [p.id, p]))
}

export function getPlayer(players: Map<number, Player>, id: number): Player | null {
    if (id === BANK.id) { return BANK }
    
    return players.get(id) ?? null
}

export function findPlayerIndex(players: Player[], id: number): number | null {
    if (id === BANK.id) { return null }
    
    return players.findIndex(player => player.id === id)
}

export function addMoney(prev: Player, amount: number): Player {
    return {
        ...prev,
        money: prev.money + amount
    }
}

export function changeOwner(ownerships: Ownerships, owner: number, id: number): Ownership | null {
    return owner === BANK.id
        ? null
        : {
            ...(ownerships[id] ?? {
                id,
                owner,
                houses: 0,
                mortgaged: false
            }),
            owner,
        }
}

export function applyExchangeToPlayers(prevPlayers: Player[], ex: Exchange): Player[] {
    const players = prevPlayers.slice()
    const paysIndex = findPlayerIndex(players, ex.pays.id)
    const chargesIndex = findPlayerIndex(players, ex.charges.id)
    
    console.log({players, paysIndex, chargesIndex})
    
    if (paysIndex !== null) {
        players[paysIndex] = addMoney(players[paysIndex], -ex.amount)
    }
    if (chargesIndex !== null) {
        players[chargesIndex] = addMoney(players[chargesIndex], ex.amount)
    }
    return players
}

export function buildHouses(ownership: Ownership | null, amount: number): Ownership | null {
    return ownership && amount !== 0
        ? {
            ...ownership,
            houses: Math.max(0, Math.min(5, ownership.houses + amount))
        }
        : ownership
}

export function setMortgage(ownership: Ownership | null, mortgaged: boolean): Ownership | null {
    return ownership && mortgaged !== ownership.mortgaged
        ? {
            ...ownership,
            houses: 0,
            mortgaged
        }
        : ownership
}

export function applyExchangeToOwnerships(prevOwnerships: Ownerships, ex: Exchange): Ownerships {
    const ownerships = prevOwnerships.slice()
    const sell = (prev: ExParty, next: ExParty) => (
        prev.sells.forEach(id => {
            ownerships[id] = changeOwner(ownerships, next.id, id)
        })
    )
    const mortgaged = (props: number[], value: boolean) => (
        props.forEach(id => {
            ownerships[id] = setMortgage(ownerships[id], value)
        })
    )
    sell(ex.pays, ex.charges)
    sell(ex.charges, ex.pays)
    
    mortgaged(ex.mortgage, true)
    mortgaged(ex.liftMortgage, false)
    
    ownerships[ex.buildingsFor] = buildHouses(ownerships[ex.buildingsFor], ex.buildings)
    
    return ownerships
}
