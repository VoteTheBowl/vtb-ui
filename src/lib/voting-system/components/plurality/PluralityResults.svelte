<script lang="ts">
	import type { Submission } from './types';
	import type { BallotResponseData, EventResponseData } from '$lib/api/events';

	let { event, ballots }: { event: EventResponseData; ballots: BallotResponseData[] } = $props();

	let votes: { choice: string; count: number }[] = $derived(
		event.choices.map((choice) => ({
			choice,
			count: ballots.filter((ballot) => (ballot.vote as Submission)?.choice === choice).length
		})) || []
	);
</script>

{#each votes.sort((a, b) => b.count - a.count) as vote, index (vote.choice)}
	{#if index === 0}
		<p class="mb-4">
			The winner is <span class="text-xl font-bold italic">{vote.choice}</span> with ({vote.count})
			votes.
		</p>
		<h4 class="border-b-2">Totals</h4>
	{/if}
	<p class="my-2 text-xl">
		<span class="text-xl font-bold">{vote.choice}</span>: {vote.count}
	</p>
{/each}
