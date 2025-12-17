<script lang="ts">
	import type { BallotContext, EventContext } from '$lib/types';
	import { P, Star } from 'flowbite-svelte';
	import { RefreshOutline } from 'flowbite-svelte-icons';
	import { getContext, onMount } from 'svelte';
	import type { StarSubmission } from './types';

	let ratings: StarSubmission = $state([]);

	let eventContext: EventContext = getContext('event-data');
	let ballotContext: BallotContext = getContext('ballot-data');

	function onRatingClick(choice: string, rating: number) {
		const selectedChoice = ratings.find((r) => r.choice === choice);
		if (selectedChoice) {
			selectedChoice.rating = rating;
		}
		ballotContext.submission = ratings;
	}

	onMount(() => {
		// Initialize ratings for each choice
		if (eventContext.event) {
			ratings = eventContext.event.choices.map((choice) => ({ choice, rating: 0 }));
		}
		ballotContext.submission = ratings;
		ballotContext.submissionIsValid = true;
	});
</script>

<P class="text-center">
	Rate each item from 0-5 stars. You may rate multiple items with the same number of stars.
</P>

<div class="items-between flex-col">
	{#if eventContext.event}
		{#each eventContext.event.choices as choice (choice)}
			{@const ratingObj = ratings.find((r) => r.choice === choice)}
			{#if ratingObj}
				<div class="my-2 w-full flex-col items-center justify-between gap-4">
					<P size="lg" class="font-bold">{choice}</P>
					<div class="relative flex items-center">
						{#if ratingObj.rating > 0}
							<button
								class="absolute right-full flex cursor-pointer items-center justify-center p-2 pt-1.5 pb-0.5"
								onclick={() => onRatingClick(choice, 0)}
							>
								<RefreshOutline class="h-5 w-5 shrink-0" />
							</button>
						{/if}
						{#each Array(5), index (index)}
							<button
								class="flex cursor-pointer items-center justify-center"
								onclick={() => onRatingClick(choice, index + 1)}
							>
								<Star
									iconIndex={index}
									groupId={choice.trim().toLowerCase().replace(/\s+/g, '-')}
									fillPercent={ratingObj.rating > index ? 100 : 0}
									size={50}
									ariaLabel={`Rate ${index + 1} star${index == 0 ? '' : 's'}`}
								/>
							</button>
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	{/if}
</div>
