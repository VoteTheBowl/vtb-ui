<script lang="ts">
	import { getStorageContext } from '$lib/storage/storage.svelte';
	import DisplayVoteWrapper from '$lib/components/DisplayVoteWrapper.svelte';
	import ResultWrapper from '$lib/components/ResultWrapper.svelte';
	import Section from '$lib/components/Section.svelte';
	import BasicPageLayout from '$lib/components/layouts/BasicPageLayout.svelte';
	import { getBallotContext, getEventContext } from '$lib/context';
	import { page } from '$app/state';

	const ballotID = $derived(Number(page.url.searchParams.get('b')));

	const eventContext = getEventContext();
	const ballotContext = getBallotContext();

	const storage = getStorageContext();
</script>

<BasicPageLayout title="Results" subtitle={eventContext.event?.name}>
	{#if eventContext.event && ballotContext.ballot}
		{@const event = eventContext.event}
		{@const ballot = ballotContext.ballot}

		<p class="mb-12">
			Thank you for submitting your ballot, <i>{ballot.voter_name}</i>!
		</p>
		{#if !event.show_results}
			<p class="mb-12">
				Your host has chosen to hide the final results, please talk to the host to find out the
				results of this event!
			</p>
		{:else}
			<Section title="Results" class="mb-16">
				<ResultWrapper {event} token={storage.getBallot(ballotID).token} />
			</Section>
		{/if}

		<DisplayVoteWrapper title="Your Submitted Ballot" {event} {ballot} />
	{/if}
</BasicPageLayout>
