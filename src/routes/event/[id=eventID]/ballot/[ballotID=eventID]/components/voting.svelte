<script lang="ts">
	import { page } from '$app/state';
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

<h2 class="mb-4">{event.name}</h2>
<h3 class="mb-8">{ballot.voter_name}'s Ballot</h3>
{#if ballot.submitted !== null}
	<p>Thank you for submitting your vote!</p>
{:else}
	<VotingWrapper {ballotID} {event} token={storage.getBallot(ballotID).token} {onSubmitVote} />
{/if}
