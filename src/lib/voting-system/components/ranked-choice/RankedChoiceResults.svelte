<script lang="ts">
	import type { ResultComponentProps } from '$lib/voting-system/types';
	import type { RankedResultType } from './types';

	let { result }: ResultComponentProps<RankedResultType> = $props();
</script>

<p class="mb-4 font-bold">
	{#if result.winner === '__TIE_FLAG__'}
		It's a tie!
	{:else}
		{result.winner} wins!
	{/if}
</p>

<div class="flex flex-col-reverse">
	{#each result.rounds as { tally, exhausted }, i (i)}
		<div class="round mt-2 w-3xs rounded-lg bg-gray-200 p-2">
			<div class="mb-2 text-sm font-light text-gray-600 uppercase">Round {i + 1}</div>
			<div class="text-gray-700">
				{#each Object.keys(tally) as candidate (candidate)}
					<div>{candidate}: {tally[candidate]}</div>
				{/each}
				<div>exhausted votes: {exhausted}</div>
			</div>
		</div>
	{/each}
</div>
