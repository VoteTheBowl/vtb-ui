<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { setStorageContext, StorageManager } from './storage.svelte';

	let { children }: { children: Snippet } = $props();

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

{@render children?.()}
