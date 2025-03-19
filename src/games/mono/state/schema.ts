import { type Game } from '$lib/bxx.svelte';
import { z } from "zod";
import { properties } from './global';

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

const MonopolyGame = z.object({
    defaultMoney: z.number(),
    players: z.array(Player),
    history: z.array(Transaction),
    owners: z.array(z.nullable(Ownership)),
})
export type MonopolyGame = z.infer<typeof MonopolyGame>
export type Ownerships = z.infer<typeof MonopolyGame>["owners"]

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

export interface ExchangeOwnership {
    /** ID of the property */
    id: number
    soldTo?: number
    mortgage?: "lift" | "loan"
    builds?: number
}

export interface ExchangeParty {
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
    ownerships?: ExchangeOwnership[]
}

export interface Exchange {
    pays: ExchangeParty
    charges: ExchangeParty

    /** Amount of money exchanged between parties */
    amount: number
}

export const game: Game<MonopolyGame> = {
    identifier: 'mono',
    validate: (v) => {
        const data = MonopolyGame.parse(v)

        let usedIDs = new Set<number>()
        let maxID = Math.max(...data.players.map(v => v.id))
        
        return {
            ...data,
            players: data.players.map(({id, ...player}) => {
                if (usedIDs.has(id)) {
                    id = ++maxID
                }
                usedIDs.add(id)
                return {
                    ...player,
                    id
                }
            })
        }
    },
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
