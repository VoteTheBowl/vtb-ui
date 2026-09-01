<script lang="ts">
	import type { DisplayOnlyVotingComponentProps } from '$lib/voting-system/types';
	import Star from './Star.svelte';
	import type { StarSubmission } from './types';

	let { event, ballot }: DisplayOnlyVotingComponentProps = $props();
</script>

<div class="items-between flex-col">
	{#each event.choices as choice (choice)}
		{@const ratingObj = (ballot.vote as StarSubmission)?.find((r) => r.choice === choice)}
		{#if ratingObj}
			<div class="my-2 w-full flex-col items-center justify-between gap-4">
				<p>{choice}</p>
				<div class="relative flex items-center">
					{#each Array(5), index (index)}
						{#if index < ratingObj.rating}
							<Star {index} {choice} rating={ratingObj.rating} />
						{:else if index === 0}
							<p class="p-3 text-xl font-bold">No Rating</p>
						{/if}
					{/each}
				</div>
			</div>
		{/if}
	{/each}
</div>
