<script lang="ts">
	import type { DisplayOnlyVotingComponentProps } from '$lib/voting-system/types';
	import Star from './Star.svelte';
	import type { StarSubmissionType } from './types';

	let { event, submission }: DisplayOnlyVotingComponentProps<StarSubmissionType> = $props();
</script>

<div class="items-between flex-col">
	{#each event.choices as choice, index (index + choice)}
		{#if submission && choice in submission}
			{@const rating = submission[choice]}
			<div class="my-2 w-full flex-col items-center justify-between gap-4">
				<p>{choice}</p>
				<div class="relative flex items-center">
					{#each Array(5), index (index)}
						{#if index < rating}
							<Star {index} {rating} />
						{:else if index === 0}
							<p class="p-3 text-xl font-bold">No Rating</p>
						{/if}
					{/each}
				</div>
			</div>
		{/if}
	{/each}
</div>
