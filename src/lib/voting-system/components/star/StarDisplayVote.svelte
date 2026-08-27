<script lang="ts">
	import { getSubmissionContext } from '$lib/voting-system/context';
	import type { VotingComponentProps } from '$lib/voting-system/types';
	import { onMount } from 'svelte';
	import Star from './Star.svelte';
	import type { StarSubmission } from './types';

	let { event }: VotingComponentProps = $props();

	const submissionContext = getSubmissionContext();

	onMount(() => {
		submissionContext.submission = event.choices.map((choice) => ({ choice, rating: 0 }));
	});
</script>

<div class="items-between flex-col">
	{#each event.choices as choice (choice)}
		{@const ratingObj = (submissionContext.submission as StarSubmission)?.find(
			(r) => r.choice === choice
		)}
		{#if ratingObj}
			<div class="my-2 w-full flex-col items-center justify-between gap-4">
				<p>{choice}</p>
				<div class="relative flex items-center">
					{#each Array(5), index (index)}
						<Star {index} {choice} rating={ratingObj.rating} />
					{/each}
				</div>
			</div>
		{/if}
	{/each}
</div>
