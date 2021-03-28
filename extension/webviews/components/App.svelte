<script lang="ts">
import { onMount } from 'svelte';


	import Cards from './Cards.svelte';
	import Header from './Header.svelte';
	import Search from './Search.svelte';

	let accessToken = "";
	let loading = true;
	let user: { name: string, id: number } | null = null;

	onMount(async () => {
		window.addEventListener("message", async (event) => {
			const message = event.data;
			switch(message.type) {
				case "token":
					accessToken = message.value;
					const response = await fetch(`${apiBaseUrl}/me`, {
						headers: {
							authorization: `Bearer ${accessToken}`
						},
					});
					const data = await response.json();
					user = data.user;
					loading = false;
			}
		})

		tsvscode.postMessage({ type: "get-token", value: undefined });

		

	})

</script>

{#if loading}
	<div>loading...</div>
{:else if user}
	<pre>{JSON.stringify(user)}</pre>
{:else}
	<div>no user logged in</div>
{/if}
<Header />
<main>
	<Search />
	<Cards />
</main>

<style style="text/scss">
	main {
		text-align: center;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>