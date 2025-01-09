import { type Game } from '../lib/bxx.svelte';
import { z } from "zod";
import { properties as untypedProperties } from "./hasbro_argentina.json"

export const properties = untypedProperties as MonopolyProperty[]

export type MonopolyProperty = {
    id: number;
    name: string;
    price: number;
    block: string;
    rent?: number[];
    housing?: number;
    special?: 'station' | 'service';
    description?: string;
};

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

export const OwnedProperty = z.object({
    id: z.number(),
    houses: z.number().default(0),
    mortgaged: z.boolean().default(false),
})
export type OwnedProperty = z.infer<typeof OwnedProperty>

export const Player = z.object({
    name: z.string(),
    color: z.number(),
    money: z.number(),
    properties: z.array(OwnedProperty)
})
export type Player = z.infer<typeof Player>


//export type ResolvedProperty = Omit<OwnedProperty, 'id'> & {prop: MonopolyProperty}

export const BANK = -1;

const MonopolyGame = z.object({
    defaultMoney: z.number(),
    players: z.array(Player),
    history: z.array(Transaction),
})
export type MonopolyGame = z.infer<typeof MonopolyGame>

export const mono: Game<MonopolyGame> = {
    identifier: 'mono',
    validate: MonopolyGame.parse,
    initial: () => ({
        defaultMoney: 1500,
        players: [],
        history: [],
    }),
    reset: (old) => ({
        defaultMoney: old.defaultMoney,
        players: old.players.map(player => ({
            ...player,
            money: old.defaultMoney,
            properties: [],
        })),
        history: []
    })
};
