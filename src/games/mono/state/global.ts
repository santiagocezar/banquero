import type { MonopolyProperty, Player } from "./schema";

import { properties as untypedProperties } from "./hasbro_argentina_group.json"

export const properties = untypedProperties as MonopolyProperty[]

export const BANK: Player = {
    id: -1,
    name: "Banco",
    color: -1,
    money: 0,
};
