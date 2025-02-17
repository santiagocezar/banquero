function setThemeColor() {
    const themeColor = document.getElementById("theme-color") as HTMLMetaElement
    try {
        themeColor.content = getComputedStyle(
            document.documentElement
        ).backgroundColor
    } catch (err) {
        console.warn("failed to set theme color")
    }
}

if (typeof window !== "undefined") {
    matchMedia("(prefers-color-scheme: dark)").addEventListener(
        "change",
        (event) => {
            setThemeColor()
        }
    )
    
    setThemeColor()
}
