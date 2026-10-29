<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import type { ResultComponentProps } from '$lib/voting-system/types';
	import type { StarResultType } from './types';

	let { result }: ResultComponentProps<StarResultType> = $props();
</script>

<div>
	<div class="mb-8">
		{#if result['gold'].length}
			<p>
				<span class="text-xl font-bold italic">{result['gold'].join(', ')}</span> won!
			</p>
		{/if}

		{#if result['silver'].length}
			<p>
				<span class="text-xl font-bold italic">{result['silver'].join(', ')}</span> came in second place!
			</p>
		{/if}

		{#if result['bronze'].length}
			<p>
				<span class="text-xl font-bold italic">{result['bronze'].join(', ')}</span> came in third place!
			</p>
		{/if}
	</div>

	{#if result['scores'].length}
		{#each result['scores'] as score (score.choice)}
			<div class="flex items-center gap-1">
				<p class="text-xl">
					{score.choice} - {score.score}
				</p>
				<Icon icon="star" class="fill-amber-300! stroke-none!" />
				{#if result['gold'].includes(score.choice)}
					<p class="font-bold text-green-600">(Winner)</p>
				{/if}
				{#if result['silver'].includes(score.choice)}
					<p class="font-bold text-blue-600 dark:text-blue-400">(Second Place)</p>
				{/if}
				{#if result['bronze'].includes(score.choice)}
					<p class="font-bold text-yellow-600">(Third Place)</p>
				{/if}
			</div>
		{/each}
	{/if}
</div>
