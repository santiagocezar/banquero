import { type Game } from '$lib/bxx.svelte';
import { z } from "zod";

const BingoGame = z.object({
    played: z.array(z.number())
})
type BingoGame = z.infer<typeof BingoGame>

export const game: Game<BingoGame> = {
    identifier: 'bingo',
    validate: BingoGame.parse,
    initial: () => ({ played: [] }),
    reset: () => ({ played: [] }),
};
