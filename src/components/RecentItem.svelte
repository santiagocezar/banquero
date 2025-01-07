<script lang="ts">
    import {
        generateID,
        loadSave,
        storeSave,
        type Recent,
    } from "../lib/bxx.svelte";
    import { truco } from "./truco";
    import Icon from "./Icon.svelte";

    interface Props {
        onDelete: (id: string) => void;
        recent: Recent;
    }

    const { onDelete, recent }: Props = $props();

    const data = loadSave(truco, recent.id)!;

    console.dir({
        recent,
        data,
    });

    function rematch() {
        const id = generateID(truco);
        storeSave(id, truco.reset(data));

        location.href = "/game#" + id;
    }

    if (!data || !data.teams) {
        onDelete(recent.id);
    }
</script>

{#if data && data.teams}
    <div class="recent">
        <a
            href="/game#{recent.id}"
            class="border pal-{data.teams.nosotros.color}"
        >
            <div class="border-gradient pal-{data.teams.ellos.color}"></div>
        </a>
        <a
            href="/game#{recent.id}"
            class="background pal-{data.teams.nosotros.color}"
        >
            <div class="background-gradient pal-{data.teams.ellos.color}"></div>
        </a>
        <div class="top">
            <p>
                <strong>{data.teams.nosotros.name}</strong>
                <span>vs.</span>
                <strong>{data.teams.ellos.name}</strong>
            </p>
            <p>
                {recent.date.toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                })}
            </p>
        </div>
        <div class="actions">
            <button class="blue" onclick={rematch}>
                <Icon use="ic-swords" />
                Revancha
            </button>
            <button class="red" onclick={() => onDelete(recent.id)}>
                <Icon use="ic-delete" />
            </button>
        </div>
    </div>
{/if}

<style lang="less">
    .recent {
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
        position: relative;
        padding: 1rem;
        border-radius: 2rem;
        overflow: hidden;
        flex-shrink: 0;
        flex-wrap: wrap;

        .top {
            pointer-events: none;
            z-index: 1;
            flex-shrink: 0;
        }

        .actions {
            pointer-events: none;
            display: flex;
            gap: 1rem;
            position: relative;
            flex-grow: 1;
            align-items: center;
            justify-content: end;
        }

        button {
            &.blue {
                background-color: var(--blue);
                color: white;
            }

            &.red {
                background-color: var(--red);
                color: white;
            }

            pointer-events: auto;
            /*        box-sizing: content-box;
        padding: 0 1rem;
        height: 2rem;
        border-radius: .5rem;*/
        }

        strong {
            font-size: 1.25rem;
        }

        .border {
            position: absolute;
            inset: 0;
            background-color: var(--p50);

            .border-gradient {
                height: 100%;
                background: linear-gradient(to bottom, transparent, var(--p50));
            }
        }

        .background {
            position: absolute;
            inset: 1px;
            border-radius: calc(2rem - 1px);
            background-color: var(--p30);

            .background-gradient {
                height: 100%;
                background: linear-gradient(to bottom, transparent, var(--p30));
                border-radius: calc(2rem - 1px);
            }
        }
    }
</style>
