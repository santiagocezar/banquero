import * as z from 'zod'
import { createGame } from '../lib/bxx.svelte'

export const TrucoTeam = z.object({
    name: z.string(),
    color: z.number(),
    score: z.number(),
})

export const TrucoGame = z.object({
    teams: z.object({
        nosotros: TrucoTeam,
        ellos: TrucoTeam,
    }).nullable(),
                                  goal: z.number(),
}).default({
    teams: null,
    goal: 15,
})
export type TrucoTeam = z.infer<typeof TrucoTeam>
export type TrucoGame = z.infer<typeof TrucoGame>

export const truco = createGame("truco", TrucoGame, remacth => {
    remacth.teams?.ellos &&
    (remacth.teams.ellos.score = 0)
    remacth.teams?.nosotros &&
    (remacth.teams.nosotros.score = 0)
    
    return remacth
})
