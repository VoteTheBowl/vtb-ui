<script lang="ts">
	import { page } from '$app/state';
	import VotingWrapper from '$lib/components/VotingWrapper.svelte';
	import { getStorageContext } from '$lib/storage/storage';
	import type { BallotResponseData, EventResponseData } from '$lib/api/events';
	import DisplayVoteWrapper from '$lib/components/DisplayVoteWrapper.svelte';
	import Section from '$lib/components/Section.svelte';

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

<h2 class="mb-16">{event.name} - Voting</h2>
{#if ballot.submitted !== null}
	<p class="mb-8">Thank you for submitting your vote!</p>

	<DisplayVoteWrapper title="Submitted Vote" {event} {ballot} />
{:else}
	<Section title="Your Ballot">
		<VotingWrapper {ballotID} {event} token={storage.getBallot(ballotID).token} {onSubmitVote} />
	</Section>
{/if}
