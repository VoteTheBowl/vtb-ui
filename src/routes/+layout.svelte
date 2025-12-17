<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.png';
	import { ThemeProvider } from 'flowbite-svelte';
	import { defaultTheme } from '$lib/themes';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ThemeProvider theme={defaultTheme}>
	<div class="justify-top flex min-h-screen w-screen flex-col items-center">
		<div class="w-fulls h-full p-4 sm:max-w-lg">
			{@render children?.()}
		</div>
	</div>
</ThemeProvider>

{import.meta.env.VITE_APP_VERSION}
