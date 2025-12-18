<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { setStorageContext, StorageManager } from './storage';

	let { children, onLoad }: { children: Snippet; onLoad?: () => void } = $props();

	const storage = new StorageManager('storage');
	setStorageContext(storage);

	onMount(() => {
		storage.init().then(() => {
			onLoad?.();
		});
	});
</script>

{@render children?.()}
