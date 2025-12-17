<script lang="ts">
	import type { EventContext, ResultContext } from '$lib/types';
	import { P } from 'flowbite-svelte';
	import { getContext } from 'svelte';
	import type { Submission } from './types';

	const eventContext: EventContext = getContext('event-data');
	const resultContext: ResultContext = getContext('results');

	let votes: { choice: string; count: number }[] = $derived(
		eventContext.event?.choices.map((choice) => ({
			choice,
			count: resultContext.ballots.filter(
				(ballot) => (ballot.vote as Submission)?.choice === choice
			).length
		})) || []
	);
</script>

{#if eventContext}
	{#each votes as vote (vote.choice)}
		<P class="my-2">
			{vote.choice}: {vote.count}
		</P>
	{/each}
{/if}
