<script>
    import { key } from "./key.js";
    import { weatherList } from "./store.js";
    import { onMount } from 'svelte';

    let city = "";

    function urlFor(city) {
        return `http://api.openweathermap.org/data/2.5/weather?units=metric&appid=${key}&q=${city}`;
    }

    async function addWeather(newCity) {
        const res = await fetch(urlFor(newCity));
        res.status === 404 
        ? alert("Invalid city") 
        : weatherList.add(await res.json());
    }

    function submit(event) {
        if (event.key === "Enter") {
            addWeather(city);
            city = "";
        }
    }

    onMount(() => {
		window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.type) {
            case 'new-search':
                addWeather(message.value);
                break;
        }
    });
	})
</script>

<div class="search-form">
    <input 
        type="text" 
        placeholder="Enter city name" 
        bind:value={city}
        on:keydown={submit}
    />
</div>


<style type="text/scss">
    .search-form {
        width: 100%;
        margin-left: 5%;
        padding: 0.2rem;
        input[type="text"] {
            width: 90%;
        }
    }
</style>