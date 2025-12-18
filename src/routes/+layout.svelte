<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.png';
	import { ThemeProvider } from 'flowbite-svelte';
	import { defaultTheme } from '$lib/themes';
	import { InfoAPI } from '$lib/api/info';
	import { onMount } from 'svelte';
	import StorageProvider from '$lib/storage/StorageProvider.svelte';

	let { children } = $props();

	let loaded = $state(false);

	onMount(async () => {
		console.log(
			`App Version: ${import.meta.env.VITE_APP_VERSION}`,
			`API Version: ${(await new InfoAPI().getVersion()).version}`
		);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ThemeProvider theme={defaultTheme}>
	<StorageProvider onLoad={() => (loaded = true)}>
		{#if !loaded}
			<div class="flex min-h-screen w-screen flex-col items-center justify-center">
				<p class="text-center">Loading...</p>
			</div>
		{:else}
			<div class="justify-top flex min-h-screen w-screen flex-col items-center">
				<div class="w-fulls h-full p-4 sm:max-w-lg">
					{@render children?.()}
				</div>
			</div>
		{/if}
	</StorageProvider>
</ThemeProvider>
