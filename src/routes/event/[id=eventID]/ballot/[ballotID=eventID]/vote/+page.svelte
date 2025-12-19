<script lang="ts">
	import { page } from '$app/state';
	import { Heading } from 'flowbite-svelte';
	import { getContext, onMount } from 'svelte';
	import type { BallotContext, EventContext } from '$lib/types';
	import VotingWrapper from '$lib/components/VotingWrapper.svelte';
	import ResultWrapper from '$lib/components/ResultWrapper.svelte';
	import { getStorageContext } from '$lib/storage/storage';
	import { BallotAPI } from '$lib/api/events';

	const ballotID = $derived(Number(page.params.ballotID));

	const eventContext: EventContext = getContext('event-data');
	const ballotContext: BallotContext = getContext('ballot-data');

	const storage = getStorageContext();

	let submitted = $derived(ballotContext.ballot?.submitted !== null);
	let name = $derived(ballotContext.ballot?.voter_name || '');

	function onSubmitVote() {
		submitted = true;
	}

	onMount(async () => {
		const token = storage.getBallot(ballotID).token;
		const api = new BallotAPI();

		const ballot = await api.getBallot(ballotID, token);
		name = ballot.voter_name;
		submitted = ballot.submitted !== null;
	});
</script>

<Heading tag="h2" class="my-8 text-center">Voting - {name}</Heading>
<div class="my-4 flex flex-col items-center gap-4">
	{#if !eventContext.event}
		<p class="text-center">Loading event data...</p>
	{:else if submitted}
		{#if eventContext.event?.show_results === true}
			<ResultWrapper event={eventContext.event} token={storage.getBallot(ballotID).token} />
		{:else}
			<p class="text-center">You have already submitted your vote. Thank you!</p>
		{/if}
	{:else}
		<VotingWrapper
			{ballotID}
			event={eventContext.event}
			token={storage.getBallot(ballotID).token}
			{onSubmitVote}
		/>
	{/if}
</div>
