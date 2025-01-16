<script lang="ts">
    import { range } from "../lib/utils.svelte"

    interface Props {
        placeholder: string
        name: string
        color: number
    }

    let {
        placeholder,
        name = $bindable(""),
        color = $bindable(0),
    }: Props = $props()
</script>

<div class="add-team truco-background pal-{color}">
    <label>
        <p>Nombre</p>
        <input {placeholder} bind:value={name} type="text" />
    </label>
    <div class="colors">
        {#each range(8) as i}
            <input type="radio" value={i} class="pal-{i}" bind:group={color} />
        {/each}
    </div>
</div>

<style lang="ts">
    .add-team {
        overflow-y: auto;

        label {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            width: 100%;
            padding: 1rem;
        }

        p {
            margin-bottom: 0.5rem;
        }

        input {
            width: 100%;
            font-size: 1.5rem;
            background-color: transparent;
            outline: none;
            font-weight: bold;
            text-align: center;
            /*
        border-radius: 1rem 1rem 0 0;
        background-color: var(--p40);
        */
            border-bottom: 1px solid var(--p50);

            &::placeholder {
                color: var(--p70);
            }
        }
    }

    .colors {
        padding: 1rem;
        display: grid;
        align-self: center;
        width: 100%;
        flex-grow: 1;
        align-content: center;
        max-width: 10rem;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;

        input {
            -webkit-appearance: none;
            appearance: none;

            border: none;
            background-color: var(--p50);
            margin: -0.25rem;
            border: 1px solid var(--p70);
            box-sizing: content-box;
            border-radius: 100%;

            &::before {
                content: "";
                display: block;
                width: 100%;
                height: 100%;
                clip-path: polygon(
                    40% 70%,
                    90% 20%,
                    100% 30%,
                    40% 90%,
                    0 50%,
                    10% 40%
                );
                /* border-radius: 100%; */
                background-color: var(--p90);
                transition: transform 0.2s ease;
                transform: scale(0);
            }

            &:checked::before {
                transform: scale(0.5);
            }

            aspect-ratio: 1 / 1;
        }
    }
</style>
