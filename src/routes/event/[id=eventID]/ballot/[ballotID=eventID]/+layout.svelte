<script lang="ts">
	import { getStorageContext } from '$lib/storage/storage.svelte';

	const { children } = $props();

	const storage = getStorageContext();
</script>

{#if storage.loaded}
	{@render children()}
{/if}
