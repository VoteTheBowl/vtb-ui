<script lang="ts">
	import type { Submission } from './types';
	import type { BallotResponseData, EventResponseData } from '$lib/api/events';
	import { P } from 'flowbite-svelte';

	let { event, ballots }: { event: EventResponseData; ballots: BallotResponseData[] } = $props();

	let votes: { choice: string; count: number }[] = $derived(
		event.choices.map((choice) => ({
			choice,
			count: ballots.filter((ballot) => (ballot.vote as Submission)?.choice === choice).length
		})) || []
	);
</script>

{#each votes as vote (vote.choice)}
	<P class="my-2">
		{vote.choice}: {vote.count}
	</P>
{/each}
