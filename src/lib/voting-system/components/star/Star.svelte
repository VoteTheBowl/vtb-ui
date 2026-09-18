<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';

	let { index, rating }: { index: number; rating: number } = $props();
</script>

<Icon
	icon="star"
	class="h-10 w-10 stroke-amber-400! stroke-[0.5]! {rating > index ? 'fill-amber-300!' : ''}"
/>
