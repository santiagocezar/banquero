/** @type {GameMeta} */
export default {
    name: "trucomatic",
    description: "El contador del truco por excelencia.",
    homeImportPath: "./Recents.svelte",
    viewImportPath: "./Truco.svelte",
    headerInGame: true,
    icons: {
        pack: "material-symbols",
        prefix: "ic",
        use: [
            "arrow-back",
            "chevron-right",
            "share",
            "remove",
            "add"
        ]
    }
}
