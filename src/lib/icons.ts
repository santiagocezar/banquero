import { getIcons, iconToSVG, expandIconSet } from '@iconify/utils'
import { type IconifyJSON } from '@iconify/types'
export { type IconifyJSON } from '@iconify/types';

export function generateSymbols(iconPack: IconifyJSON, names: string[], overridePrefix?: string) {
    expandIconSet(iconPack)

    const { icons = {}, not_found = [], prefix, aliases = {}} = getIcons(iconPack, names, true) ?? {}

    overridePrefix ??= prefix
    
    console.log(aliases )

    if (not_found.length)
        console.warn(`some icons were not found: ${not_found}`)

    let symbols = ""

    for (const name of names) {
        const icon = aliases[name]?.parent ?? name
        const { body, attributes } = iconToSVG(icons[icon]!)

        symbols += `
            <symbol id="${overridePrefix}-${name}" viewBox="${attributes.viewBox}">
                ${body}
            </symbol>
        `
    }
    return symbols
}
