/** @type {GameMeta} */
export default {
    name: "bingomatic",
    description: "Cuenta las bolillas de loteria.",
    homeImportPath: "./Recents.svelte",
    viewImportPath: "./View.svelte",
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
