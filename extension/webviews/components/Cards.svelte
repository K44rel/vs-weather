<script>
    import { weatherList } from "./store.js";
    import Card from "./Card.svelte";
</script>

{#each $weatherList as weather, idx}
    <Card {weather} {idx} />
{/each}