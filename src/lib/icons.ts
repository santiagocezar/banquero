import { icons } from '@iconify-json/mdi'
import { getIcons } from '@iconify/utils'

function generateSymbols(names: string[]) {
    getIcons(icons, names)
}
