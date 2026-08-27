<script lang="ts">
	import { RefreshOutline } from 'flowbite-svelte-icons';
	import type { StarSubmission } from './types';
	import type { VotingComponentProps } from '$lib/voting-system/types';
	import { onMount } from 'svelte';
	import Star from './Star.svelte';
	import { getSubmissionContext } from '$lib/voting-system/context';

	let { event }: VotingComponentProps = $props();

	let submissionContext = getSubmissionContext();
	let ratings: StarSubmission = $state([]);

	function onRatingClick(choice: string, rating: number) {
		const selectedChoice = ratings.find((r) => r.choice === choice);
		if (selectedChoice) {
			selectedChoice.rating = rating;
		}
		submissionContext.submission = ratings;
	}

	onMount(() => {
		ratings = event.choices.map((choice) => ({ choice, rating: 0 }));
		submissionContext.submission = ratings;
		submissionContext.submissionIsValid = true;
	});
</script>

<p>Rate each item from 0-5 stars. You may rate multiple items with the same number of stars.</p>

<div class="items-between flex-col">
	{#each event.choices as choice (choice)}
		{@const ratingObj = ratings.find((r) => r.choice === choice)}
		{#if ratingObj}
			<div class="my-2 w-full flex-col items-center justify-between gap-4">
				<p>{choice}</p>
				<div class="relative flex items-center">
					{#each Array(5), index (index)}
						<button
							class="flex cursor-pointer items-center justify-center"
							onclick={() => onRatingClick(choice, index + 1)}
						>
							<Star {index} {choice} rating={ratingObj.rating} />
						</button>
					{/each}
					{#if ratingObj.rating > 0}
						<button
							class="flex cursor-pointer items-center justify-center p-2 pt-1.5 pb-0.5"
							onclick={() => onRatingClick(choice, 0)}
						>
							<RefreshOutline class="h-5 w-5 shrink-0 dark:text-white " />
						</button>
					{/if}
				</div>
			</div>
		{/if}
	{/each}
</div>
