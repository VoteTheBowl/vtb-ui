<script lang="ts">
	import type { StarSubmissionType } from './types';
	import type { VotingComponentProps } from '#lib/voting-system/types.js';
	import { onMount } from 'svelte';
	import Star from './Star.svelte';
	import { getSubmissionContext } from '#lib/voting-system/context.js';
	import Icon from '#lib/components/Icon.svelte';

	let { event }: VotingComponentProps = $props();

	let submissionContext = getSubmissionContext();
	let ratings: NonNullable<StarSubmissionType> = $state({});

	function onRatingClick(choice: string, rating: number) {
		ratings[choice] = rating;
		submissionContext.submission = ratings;
	}

	onMount(() => {
		event.choices.forEach((choice) => (ratings[choice] = 0));
		submissionContext.submission = ratings;
		submissionContext.submissionIsValid = true;
	});
</script>

<p>Rate each item from 0-5 stars. You may rate multiple items with the same number of stars.</p>

<div class="items-between flex-col">
	{#each event.choices as choice, index (index + choice)}
		{#if choice in ratings}
			{@const rating = ratings[choice]}
			<div class="my-2 w-full flex-col items-center justify-between gap-4">
				<p>{choice}</p>
				<div class="relative flex items-center">
					{#each Array(5), index (index)}
						<button
							class="flex cursor-pointer items-center justify-center"
							onclick={() => onRatingClick(choice, index + 1)}
						>
							<Star {index} {rating} />
						</button>
					{/each}
					{#if rating > 0}
						<button
							class="flex cursor-pointer items-center justify-center p-2 pt-1.5 pb-0.5"
							onclick={() => onRatingClick(choice, 0)}
						>
							<Icon icon="refresh-ccw" />
						</button>
					{/if}
				</div>
			</div>
		{/if}
	{/each}
</div>
