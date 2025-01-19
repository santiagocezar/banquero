interface IconMeta {
    pack: string
    prefix: string
    use: string[]
}

interface GameMeta {
    name: string
    description: string
    homeImportPath: string
    viewImportPath: string
    headerInGame: boolean
    icons: IconMeta
}
