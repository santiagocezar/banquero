<script lang="ts">
    import { type SVGAttributes } from "svelte/elements"

    interface Props extends SVGAttributes<SVGElement> {
        use: string
    }
    const { use, ...rest }: Props = $props()
</script>

<svg width="24" height="24" viewBox="0 0 24 24" {...rest}>
    <use href="#{use}" />
</svg>
