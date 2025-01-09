<script lang="ts">
    import Icon from "../components/Icon.svelte"
    import { OwnedProperty, properties } from "./index.svelte"

    interface Props {
        owned: OwnedProperty
    }

    const { owned }: Props = $props()

    const prop = $derived(properties[owned.id])
</script>

<section style="--c: {prop.block}">
    <header>
        <nav>
            <button>
                <Icon use="ic-arrow-back" />
            </button>
            {prop.name}
        </nav>
        <div class="rent">
            <p>Alquiler</p>
            <p>${prop.rent?.[owned.houses]}</p>
        </div>

        <button class="stripe">
            <Icon use="ic-payments" />
            Cobrar alquiler
            </button>
    </header>
</section>

<style>
    section {
        display: grid;
        grid-template-rows: 2fr 3fr;
        height: 100%;
        overflow: hidden;
    }
    header {
        background-color: color-mix(in hsl, white, var(--c) 25%);
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto 1fr auto;
        gap: 0 0.5rem;
        padding: 0.5rem;
        text-align: center;

        & nav {
            display: flex;
            text-align: left;
            gap: 1rem;
            line-height: 1;
            align-items: center;
            font-weight: bold;
        }
        & .rent {
            text-align: center;
            place-self: center;

            & p:last-child {
                font-variant: tabular-nums;
                font-weight: 300;
                font-size: 3.5rem;
                line-height: 1;
            }
        }
        & .mortage {
            font-size: 1.25rem;
            font-variant: tabular-nums;
        }
        & button {
            background-color: var(--c);
            color: var(--p90);
        }
    }
</style>
