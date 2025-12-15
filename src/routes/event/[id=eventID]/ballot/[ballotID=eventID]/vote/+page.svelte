<script lang="ts">
	import { page } from '$app/state';
	import { Heading } from 'flowbite-svelte';
	import { getContext, onMount } from 'svelte';
	import type { EventContext } from '$lib/types';
	import VotingWrapper from '$lib/VotingWrapper.svelte';
	import { getStorageContext } from '$lib/storage/storage';
	import { BallotAPI } from '$lib/api/events';

	const ballotID = $derived(Number(page.params.ballotID));
	const eventContext: EventContext = getContext('event-data');
	const storage = getStorageContext();

	let submitted = $state(false);
	let name = $state('');

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
	{#if submitted}
		<p class="text-center">You have already submitted your vote. Thank you!</p>
	{:else if eventContext.event}
		<VotingWrapper
			{ballotID}
			votingSystemID={eventContext.event.electoral_system}
			token={storage.getBallot(ballotID).token}
			{onSubmitVote}
		/>
	{/if}
</div>
