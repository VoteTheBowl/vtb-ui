<script lang="ts">
	import { onMount } from 'svelte';
	import { setStorageContext, StorageManager } from './storage.svelte';

	let { children } = $props();

	const storage = new StorageManager('storage');
	setStorageContext(storage);

	const refreshStorage = () => {
		storage.init();
	};

	onMount(() => {
		storage.init();
	});
</script>

<svelte:window onstorage={refreshStorage} />

{#if storage.loaded}
	{@render children()}
{/if}
