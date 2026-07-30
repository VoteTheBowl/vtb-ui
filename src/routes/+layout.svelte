<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.png';
	import { defaultTheme } from '$lib/themes';
	import { InfoAPI } from '$lib/api/info';
	import { onMount } from 'svelte';
	import StorageProvider from '$lib/storage/StorageProvider.svelte';
	import { DarkMode, ThemeProvider } from 'flowbite-svelte';
	import { resolve } from '$app/paths';

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
		<header class="relative bg-primary-600 text-white dark:bg-primary-900 dark:text-gray-200">
			<div class="m-auto mx-auto p-4 sm:max-w-lg">
				<h1 class="text-2xl font-bold">
					<a href={resolve('/')}>Vote The Bowl</a>
				</h1>
				<DarkMode
					size="sm"
					class="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-primary-300 hover:bg-primary-700 dark:text-primary-400 hover:dark:bg-primary-800"
				/>
			</div>
		</header>
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
