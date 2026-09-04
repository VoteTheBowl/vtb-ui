<script lang="ts">
	import '../app.css';
	import { defaultTheme } from '$lib/themes';
	import { InfoAPI } from '$lib/api/info';
	import { onMount } from 'svelte';
	import StorageProvider from '$lib/storage/StorageProvider.svelte';
	import { DarkMode, ThemeProvider } from 'flowbite-svelte';

	let { children } = $props();

	onMount(async () => {
		console.log(
			`App Version: ${import.meta.env.VITE_APP_VERSION}`,
			`API Version: ${(await new InfoAPI().getVersion()).version}`
		);
	});
</script>

<ThemeProvider theme={defaultTheme}>
	<StorageProvider>
		{@render children()}
	</StorageProvider>
</ThemeProvider>

<DarkMode class="invisible" aria-hidden />
