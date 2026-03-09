<script lang="ts">
	import { page } from '$app/state';
	import { Heading, P } from 'flowbite-svelte';
	import VotingWrapper from '$lib/components/VotingWrapper.svelte';
	import { getStorageContext } from '$lib/storage/storage';
	import type { BallotResponseData, EventResponseData } from '$lib/api/events';

	const ballotID = $derived(Number(page.params.ballotID));

	let {
		event,
		ballot = $bindable()
	}: {
		event: EventResponseData;
		ballot: BallotResponseData;
	} = $props();

	const storage = getStorageContext();

	function onSubmitVote(value: BallotResponseData) {
		ballot = value;
	}
</script>

<Heading tag="h1">{event.name}</Heading>
<Heading tag="h2" class="my-8">{ballot.voter_name}'s Ballot</Heading>
<div class="my-4 flex flex-col items-start gap-4">
	{#if ballot.submitted !== null}
		<P>Thank you for submitting your vote!</P>
	{:else}
		<VotingWrapper {ballotID} {event} token={storage.getBallot(ballotID).token} {onSubmitVote} />
	{/if}
</div>
