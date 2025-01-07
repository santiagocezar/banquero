<script lang="ts">
    import TeamInput from "./TeamInput.svelte"

    interface Props {
        onconfirm: (team1: TrucoTeam, team2: TrucoTeam, goal: number) => void
    }

    const { onconfirm }: Props = $props()

    let goal = $state(15)
    let name1 = $state("")
    let name2 = $state("")
    let color1 = $state(Math.floor(Math.random() * 8))
    let color2 = $state((color1 + Math.ceil(Math.random() * 7)) % 8)

    function create(event: Event) {
        event.preventDefault()

        onconfirm(
            { name: name1 || "Nosotros", color: color1, score: 0 },
            { name: name2 || "Ellos", color: color2, score: 0 },
            goal
        )
    }
</script>

{#snippet toggle(puntos)}
    <input
        type="radio"
        name="goal"
        aria-label="Hasta {puntos} puntos"
        value={puntos}
        bind:group={goal}
    />
{/snippet}

<form class="add-teams" onsubmit={create}>
    <TeamInput bind:name={name1} bind:color={color1} placeholder="Nosotros" />
    <TeamInput bind:name={name2} bind:color={color2} placeholder="Ellos" />
    <div class="goal">
        {@render toggle(15)}
        {@render toggle(18)}
        {@render toggle(24)}
        {@render toggle(30)}
    </div>
    <div class="actions even-row">
        <button type="submit">Dale!</button>
    </div>
</form>

<style lang="less">
    .add-teams {
        height: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr min-content;
        gap: 0.5rem;
        overflow: hidden;
        flex-direction: column;
        flex-grow: 1;

        .actions {
            grid-column: span 2;

            button {
                background-color: var(--green);
                color: black;
            }
        }
    }

    .goal {
        display: flex;
        justify-self: center;
        grid-column: span 2;

        border-radius: 1rem;
        overflow: hidden;
        border: 1px solid var(--blue);

        input {
            -webkit-appearance: none;
            appearance: none;

            border-left: 1px solid var(--blue);
            box-sizing: content-box;
            padding: 0 1rem;
            font-size: 2rem;

            &:first-child {
                border: none;
            }

            &::before {
                content: attr(value);
            }

            &:checked {
                background-color: var(--blue);
                color: white;
            }
        }
    }
</style>
