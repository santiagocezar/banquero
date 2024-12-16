const themeColor = document.getElementById("theme-color") as HTMLMetaElement

function setThemeColor() {
    try {
        themeColor.content = getComputedStyle(document.documentElement).backgroundColor
    } catch (err) {
        console.warn('failed to set theme color')
    }
}

matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    setThemeColor()
})

setThemeColor()
