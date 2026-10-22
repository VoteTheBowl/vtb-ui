<script lang="ts">
	import type { ResultComponentProps } from '$lib/voting-system/types';
	import type { PluralityResultType } from './types';

	let { result }: ResultComponentProps<PluralityResultType> = $props();
</script>

{#each Object.entries(result).sort((a, b) => b[1] - a[1]) as vote, index (vote[0])}
	{#if index === 0}
		<p class="mb-4">
			The winner is <span class="text-xl font-bold italic">{vote[0]}</span> with ({vote[1]}) votes.
		</p>
		<h4 class="border-b-2">Totals</h4>
	{/if}
	<p class="my-2 text-xl">
		<span class="text-xl font-bold">{vote[0]}</span>: {vote[1]}
	</p>
{/each}
