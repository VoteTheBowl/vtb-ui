<script lang="ts">
	import { EventsAPI, type BallotResponseData, type EventResponseData } from '$lib/api/events';
	import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';
	import BasicPageLayout from '$lib/components/layouts/BasicPageLayout.svelte';
	import Section from '$lib/components/Section.svelte';
	import { getStorageContext } from '$lib/storage/storage.svelte';
	import { Button } from 'flowbite-svelte';

	let {
		event = $bindable(),
		ballots
	}: { event: EventResponseData; ballots: BallotResponseData[] | null } = $props();

	const storage = getStorageContext();
	const submittedBallots = $derived(ballots?.filter((ballot) => ballot.submitted));
	const unsubmittedBallots = $derived(ballots?.filter((ballot) => !ballot.submitted));

	/* 	const openRegistration = async () => {
		const api = new EventsAPI();
		await api.updateStatus(event.id, storage.getEvent(event.id).token, 'RE');
		event.status = 'RE';
	}; */

	let openConfirmClose = $state(false);

	const closeVoting = async () => {
		const api = new EventsAPI();
		const response = await api.closeEvent(event.id, storage.getEvent(event.id).token);
		event.closed = response.closed;
	};
</script>

<BasicPageLayout class="flex min-h-dvh flex-col gap-8" title="{event.name} - Voting">
	<div>
		<p class="mb-4">
			Once all voters have submitted their ballots you can close the voting. This will calculate the
			results and prevent voters from submitting any more votes.
		</p>

		{#if unsubmittedBallots !== undefined && submittedBallots !== undefined}
			<Section title="Active Ballots ({unsubmittedBallots.length})">
				<ul>
					{#each unsubmittedBallots as ballot (ballot.id)}
						<li>{ballot.voter_name}</li>
					{/each}
				</ul>
			</Section>
			<Section title="Submitted Ballots ({submittedBallots.length})">
				<ul>
					{#each submittedBallots as ballot (ballot.id)}
						<li>{ballot.voter_name}</li>
					{/each}
				</ul>
			</Section>
		{:else}
			<p>Loading ballots...</p>
		{/if}
	</div>

	<div class="flex min-h-full flex-wrap items-stretch gap-2">
		<!-- <Button size="sm" outline color="red" class="grow" onclick={openRegistration}>
		Temporarily Open Registration
	</Button> -->
		<Button size="xl" class="grow" onclick={() => (openConfirmClose = true)}>Close Voting</Button>
	</div>

	<ConfirmationModal bind:open={openConfirmClose} heading="Close Vote?" onconfirm={closeVoting}>
		Are you sure you want to close the voting?
	</ConfirmationModal>
</BasicPageLayout>
