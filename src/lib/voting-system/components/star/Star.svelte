<script lang="ts">
	import { Star } from 'flowbite-svelte';

	let { index, choice, rating }: { index: number; choice: string; rating: number } = $props();
</script>

<Star
	iconIndex={index}
	groupId={choice.trim().toLowerCase().replace(/\s+/g, '-')}
	fillPercent={rating > index ? 100 : 0}
	size={50}
	ariaLabel={`Rate ${index + 1} star${index == 0 ? '' : 's'}`}
/>
