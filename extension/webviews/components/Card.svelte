<script>
    import { weatherList } from "./store";
    import { fly } from 'svelte/transition';
    export let weather;
    export let idx;
    let src = `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    let dur = 1.5 * 1000;
    let start = 0;
    let showDelete = false;

    function init() {
        start = new Date().getTime();
        showDelete = false;
    }

    function openModal() {
        // if (new Date().getTime() >= (start + dur)) {
        //     showDelete = true;
        // } 
        showDelete = true;
    }

    function closeModal() {
        start = 0;
        showDelete = false;
    }

    function remove() {
        weatherList.remove(idx);
        closeModal();
    }
</script>

<div in:fly="{{ x: 200, duration: 200 }}" out:fly="{{ x: -200, duration: 200 }}">
    <section on:mousedown={remove} >
        <h4><b>{weather.name}</b></h4>
        <img {src} alt={weather.weather[0].description} title={weather.weather[0].main}>
        <div class="container">
            {Math.round(weather.main.temp)}℃ / {weather.main.humidity}％
        </div>
    </section>
</div>

<style type="text/scss">

</style>