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

export interface Exchange {
    pays: number | null
    charges: number | null
    amount: number
    mortgage: number[]
    sell: number[]
    buy: number[]
    houses: number
}

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

export function indexPlayers(players: MonopolyGame['players']) {
    return new Map(players.map(p => [p.id, p]))
}

export function filterOwner(owners: Ownerships, id: number): Ownership[] {
    return owners.filter((o): o is NonNullable<typeof o> => o !== null && o.owner === id)
}

export const BANK: Player = {
    id: -1,
    name: "Banco",
    color: -1,
    money: 0,
};
