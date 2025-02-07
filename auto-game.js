import { resolve, dirname } from "node:path"
import { fileURLToPath, pathToFileURL } from 'node:url';

const GAME = process.env.GAME ?? "truco"

const gameBase = resolve(dirname(fileURLToPath(import.meta.url)), "src/games/" + GAME)
console.log(gameBase)
/** @type {{default: GameMeta}} */
const { default: meta } = await import(pathToFileURL(resolve(gameBase, "meta.js")))

export { meta, gameBase }