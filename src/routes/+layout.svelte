<script lang="ts">
	import '../app.css';
	import { InfoAPI } from '$lib/api/info';
	import { onMount } from 'svelte';
	import StorageProvider from '$lib/storage/StorageProvider.svelte';
	import ThemeContextProvider from '$lib/components/ThemeContextProvider.svelte';

	let { children } = $props();

	onMount(async () => {
		console.log(
			`App Version: ${import.meta.env.VITE_APP_VERSION}`,
			`API Version: ${(await new InfoAPI().getVersion()).version}`
		);
	});
</script>

<ThemeContextProvider>
	<StorageProvider>
		{@render children()}
	</StorageProvider>
</ThemeContextProvider>
