<script lang="ts">
	import { onMount } from 'svelte';
	import { setStorageContext, StorageManager } from './storage.svelte';
	import { fade } from 'svelte/transition';

	let { children } = $props();

	let long = $state(false);

	const storage = new StorageManager('storage');
	setStorageContext(storage);

	const refreshStorage = () => {
		storage.init();
	};

	onMount(() => {
		storage.init();

		const timeout = setTimeout(() => {
			long = true;
		}, 300);

		return () => {
			clearTimeout(timeout);
		};
	});
</script>

<svelte:window onstorage={refreshStorage} />

{#if storage.loaded}
	{@render children()}
{/if}

{#if !storage.loaded && long}
	<p class="p-8 text-center text-2xl" in:fade>Loading local storage data...</p>
{/if}
