import { icons as mdiIcons } from '@iconify-json/mdi'
import { getIcons, iconToSVG, expandIconSet } from '@iconify/utils'

export function generateSymbols(names: string[]) {
    expandIconSet(mdiIcons)

    const { icons = {}, not_found = [], prefix } = getIcons(mdiIcons, names, true) ?? {}


    if (not_found.length)
        console.warn(`some icons were not found: ${not_found}`)

    console.log(names)

    let symbols = ""

    for (const icon in icons) {
        const { body, attributes } = iconToSVG(icons[icon]!)
        console.log(icons[icon]!)
        console.log(attributes)

        symbols += `
            <symbol id="${prefix}:${icon}" viewBox="${attributes.viewBox}">
                ${body}
            </symbol>
        `
    }
    return symbols
}
