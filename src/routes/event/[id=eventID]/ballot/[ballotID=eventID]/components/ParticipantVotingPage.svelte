<script lang="ts">
	import { page } from '$app/state';
	import VotingWrapper from '$lib/components/VotingWrapper.svelte';
	import { getStorageContext } from '$lib/storage/storage.svelte';
	import type { BallotResponseData, EventResponseData } from '$lib/api/events';
	import DisplayVoteWrapper from '$lib/components/DisplayVoteWrapper.svelte';
	import Section from '$lib/components/Section.svelte';
	import BasicPageLayout from '$lib/components/layouts/BasicPageLayout.svelte';

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

<BasicPageLayout title="{event.name} - Voting">
	{#if ballot.submitted !== null}
		<p class="mb-8">Thank you for submitting your ballot!</p>

		<DisplayVoteWrapper {event} {ballot} />
	{:else}
		<p class="mb-8">Submit your ballot below!</p>

		<Section title="Your Ballot">
			<VotingWrapper {ballotID} {event} token={storage.getBallot(ballotID).token} {onSubmitVote} />
		</Section>
	{/if}
</BasicPageLayout>
