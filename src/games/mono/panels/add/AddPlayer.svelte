<script lang="ts">
    import { range } from "$lib/utils.svelte"

    interface Props {
        onadd: (name: string, color: number) => void
    }

    const { onadd: add }: Props = $props()

    let name = $state("")
    let color = $state(0)

    function onSubmit(ev: Event) {
        add(name, color)
        ev.preventDefault()
    }
</script>

<form onsubmit={onSubmit} class="add-team pal-{color}">
    <label>
        <p>Nombre</p>
        <input placeholder="Nombre" bind:value={name} type="text" />
    </label>
    <div class="colors">
        {#each range(8) as i}
            <input type="radio" value={i} class="pal-{i}" bind:group={color} />
        {/each}
    </div>
    <button class="plastic-pal"> Agregar </button>
</form>

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
        background-color: var(--c40);
        */
            border-bottom: 1px solid var(--c50);

            &::placeholder {
                color: var(--c70);
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
            background-color: var(--c50);
            margin: -0.25rem;
            border: 1px solid var(--c70);
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
                background-color: var(--c90);
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
