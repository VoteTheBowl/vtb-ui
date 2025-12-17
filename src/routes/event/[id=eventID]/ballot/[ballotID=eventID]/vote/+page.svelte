<script lang="ts">
	import { page } from '$app/state';
	import { Heading } from 'flowbite-svelte';
	import { getContext, onMount } from 'svelte';
	import type { EventContext } from '$lib/types';
	import { voterTokenStorage } from '$lib/token-util';
	import VotingWrapper from '$lib/VotingWrapper.svelte';
	import { BallotAPI } from '$lib/api/events';

	const eventID = $derived(Number(page.params.id));
	const ballotID = $derived(Number(page.params.ballotID));
	const eventContext: EventContext = getContext('event-data');

	let submitted = $state(false);
	let name = $state('');

	function onSubmitVote() {
		submitted = true;
	}

	onMount(async () => {
		const token = voterTokenStorage.getToken(eventID);
		const api = new BallotAPI();

		const ballot = await api.getBallot(ballotID, token);
		name = ballot.voter_name;
		submitted = ballot.submitted !== null;
	});
</script>

<Heading tag="h2" class="my-8 text-center">Voting - {name}</Heading>
<div class="my-4 flex flex-col items-center gap-4">
	{#if submitted}
		<p class="text-center">You have already submitted your vote. Thank you!</p>
	{:else if eventContext.event}
		<VotingWrapper
			{ballotID}
			votingSystemID={eventContext.event.electoral_system}
			token={voterTokenStorage.getToken(eventID)}
			{onSubmitVote}
		/>
	{/if}
</div>
