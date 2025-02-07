<script lang="ts">
    import meta from "$game/meta.js"
    import logo from "$game/assets/icon.svg?url"
 
    import Home from "$home"
</script>

<a href="/" class="logo">
    <img src={logo} alt={meta.name} />
    <span>{meta.name}</span>
</a>
<a class="new" href="/game">Nueva partida</a>
<Home />
<footer class="donate">
    <p>
        <a
            href="https://cafecito.app/valsan"
            rel="noopener"
            target="_blank"
        >
            <img
                srcset="https://cdn.cafecito.app/imgs/buttons/button_2.png 1x, https://cdn.cafecito.app/imgs/buttons/button_2_2x.png 2x, https://cdn.cafecito.app/imgs/buttons/button_2_3.75x.png 3.75x"
                src="https://cdn.cafecito.app/imgs/buttons/button_2.png"
                alt="Invitame un café en cafecito.app"
            />
        </a>
    </p>
    <p>
        <small
            >Desarrollo de carácter educativo. No se permite el uso para
            fines lucrativos.</small
        >
    </p>
</footer>

<style lang="less">
    .logo {
        display: flex;
        flex-direction: row;
        gap: 0.5em;
        justify-content: center;
        align-items: center;
        height: 6rem;
        text-align: center;
        font-family: "Poppins";
        font-size: 2rem;
        flex-shrink: 0;
        user-select: none;
        img {
            height: 1.375em;
        }
    }
    .new {
        background-color: var(--blue);
        color: white;
        margin: 1rem;
        padding: 1rem;
        font-size: 2rem;
        text-align: center;
        border-radius: 2rem;
        font-weight: bold;
        display: block;
        flex-shrink: 0;
    }
    footer {
        img {
            display: inline-block;
        }
        padding: 2rem 1rem;
        text-align: center;
    }
</style>
