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
	<title>Vote The Bowl - Cook Off Voting Made Easy</title>
	<link rel="icon" href={favicon} />
</svelte:head>

<ThemeProvider theme={defaultTheme}>
	<StorageProvider onLoad={() => (loaded = true)}>
		{#if !loaded}
			<div class="m-auto min-h-screen w-screen">
				<p class="text-center">Loading...</p>
			</div>
		{:else}
			<div class="m-auto sm:max-w-lg">
				{@render children?.()}
			</div>
		{/if}
	</StorageProvider>
</ThemeProvider>
