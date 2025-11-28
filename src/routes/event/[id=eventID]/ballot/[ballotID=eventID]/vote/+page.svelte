<script lang="ts">
	import { page } from '$app/state';
	import { Heading } from 'flowbite-svelte';
	import { getContext } from 'svelte';
	import type { BallotContext, EventContext } from '$lib/types';
	import { voterTokenStorage } from '$lib/token-util';
	import VotingWrapper from '$lib/VotingWrapper.svelte';
	import ResultWrapper from '$lib/ResultWrapper.svelte';

	const eventID = $derived(Number(page.params.id));
	const ballotID = $derived(Number(page.params.ballotID));
	const eventContext: EventContext = getContext('event-data');
	const ballotContext: BallotContext = getContext('ballot-data');

	let submitted = $derived(ballotContext.ballot?.submitted !== null);
	let name = $derived(ballotContext.ballot?.voter_name || '');

	function onSubmitVote() {
		submitted = true;
	}
</script>

<Heading tag="h2" class="my-8 text-center">Voting - {name}</Heading>
<div class="my-4 flex flex-col items-center gap-4">
	{#if submitted}
		{#if eventID && eventContext.event?.show_results === true}
			<ResultWrapper
				{eventID}
				votingSystemID={eventContext.event.electoral_system}
				token={voterTokenStorage.getToken(eventID)}
			/>
		{:else}
			<p class="text-center">You have already submitted your vote. Thank you!</p>
		{/if}
	{:else if eventContext.event}
		<VotingWrapper
			{ballotID}
			votingSystemID={eventContext.event.electoral_system}
			token={voterTokenStorage.getToken(eventID)}
			{onSubmitVote}
		/>
	{/if}
</div>
