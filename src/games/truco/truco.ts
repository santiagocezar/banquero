import * as z from "zod"
import { type Game } from "$lib/bxx.svelte"

export const TrucoTeam = z.object({
    name: z.string(),
    color: z.number(),
    score: z.number(),
})

export const TrucoGame = z.object({
    teams: z
        .object({
            nosotros: TrucoTeam,
            ellos: TrucoTeam,
        })
        .nullable(),
    goal: z.number(),
})

export type TrucoTeam = z.infer<typeof TrucoTeam>
export type TrucoGame = z.infer<typeof TrucoGame>

export const truco: Game<TrucoGame> = {
    identifier: "truco",
    validate: TrucoGame.parse,
    initial: () => ({
        goal: 15,
        teams: null,
    }),
    reset: (old) => ({
        teams:
            old.teams === null
                ? null
                : {
                    nosotros: {
                        ...old.teams.nosotros,
                        score: 0,
                    },
                    ellos: {
                        ...old.teams.ellos,
                        score: 0,
                    },
                },
        goal: old.goal,
    }),
}
