<script lang="ts">
	import { page } from '$app/state';
	import VotingWrapper from '$lib/components/VotingWrapper.svelte';
	import { getStorageContext } from '$lib/storage/storage.svelte';
	import type { BallotResponseData } from '$lib/api/events';
	import Section from '$lib/components/Section.svelte';
	import BasicPageLayout from '$lib/components/layouts/BasicPageLayout.svelte';
	import { getBallotContext, getEventContext } from '$lib/context';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import UpdateContext from '../UpdateContext.svelte';

	const ballotID = $derived(Number(page.url.searchParams.get('b')));

	const storage = getStorageContext();
	const eventContext = getEventContext();
	const ballotContext = getBallotContext();

	function onSubmitVote(value: BallotResponseData) {
		ballotContext.ballot = value;
		goto(resolve(`/ballot/results?b=${ballotID}`));
	}
</script>

<UpdateContext />

<BasicPageLayout title="Voting" subtitle={eventContext.event?.name}>
	{#if eventContext.event && ballotContext.ballot}
		{@const event = eventContext.event}
		{@const ballot = ballotContext.ballot}
		{#if event.allow_voting && !event.closed}
			{#if ballot.submitted !== null}
				<p class="mb-8">
					You have already voted! Please go to the <a
						href={resolve(`/ballot/results?b=${ballotID}`)}
					>
						results
					</a> page to see your ballot and the event results.
				</p>
			{:else}
				<p class="mb-8">Submit your ballot below!</p>

				<Section title="Your Ballot">
					<VotingWrapper
						{ballotID}
						event={eventContext.event}
						token={storage.getBallot(ballotID).token}
						{onSubmitVote}
					/>
				</Section>
			{/if}
		{:else if event.closed}
			<p>
				This event has concluded. <a href={resolve(`/ballot/results?b=${ballotID}`)}
					>Go to results</a
				>.
			</p>
		{:else}
			<p>
				Thank you for registering to the {event.name}. You will be able to vote when the host opens
				voting.
			</p>
		{/if}
	{/if}
</BasicPageLayout>
