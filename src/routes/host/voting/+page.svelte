<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { EventsAPI } from '$lib/api/events';
	import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';
	import BasicPageLayout from '$lib/components/layouts/BasicPageLayout.svelte';
	import Section from '$lib/components/Section.svelte';
	import { getBallotsContext, getEventContext } from '$lib/context';
	import { getStorageContext } from '$lib/storage/storage.svelte';
	import { Button } from 'flowbite-svelte';

	const eventContext = getEventContext();
	const ballotsContext = getBallotsContext();
	const storage = getStorageContext();
	const submittedBallots = $derived(ballotsContext.ballots?.filter((ballot) => ballot.submitted));
	const unsubmittedBallots = $derived(
		ballotsContext.ballots?.filter((ballot) => !ballot.submitted)
	);

	/* 	const openRegistration = async () => {
		const api = new EventsAPI();
		await api.updateStatus(event.id, storage.getEvent(event.id).token, 'RE');
		event.status = 'RE';
	}; */

	let openConfirmClose = $state(false);

	const closeVoting = async () => {
		if (!eventContext.event) return;

		const api = new EventsAPI();
		const response = await api.closeEvent(
			eventContext.event.id,
			storage.getEvent(eventContext.event.id).token
		);
		eventContext.event.closed = response.closed;

		goto(resolve(`/host/results?e=${eventContext.event.id}`), { replaceState: true });
	};
</script>

<BasicPageLayout
	class="flex min-h-dvh flex-col gap-8"
	title="Voting"
	eventName={eventContext.event?.name}
>
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
