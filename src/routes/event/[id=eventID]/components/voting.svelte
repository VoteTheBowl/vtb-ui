<script lang="ts">
	import { EventsAPI, type BallotResponseData, type EventResponseData } from '$lib/api/events';
	import { getStorageContext } from '$lib/storage/storage';
	import { Button, Heading, P } from 'flowbite-svelte';
	import { ArrowRightOutline, ArrowLeftOutline } from 'flowbite-svelte-icons';

	const {
		event = $bindable(),
		ballots
	}: { event: EventResponseData; ballots: BallotResponseData[] | null } = $props();

	const storage = getStorageContext();
	const submittedBallots = $derived(ballots?.filter((ballot) => ballot.submitted));
	const unsubmittedBallots = $derived(ballots?.filter((ballot) => !ballot.submitted));

	const openRegistration = async () => {
		const api = new EventsAPI();
		await api.updateStatus(event.id, storage.getEvent(event.id).token, 'RE');
		event.status = 'RE';
	};
	const closeVoting = async () => {
		const api = new EventsAPI();
		await api.updateStatus(event.id, storage.getEvent(event.id).token, 'CL');
		event.status = 'CL';
	};
</script>

<Heading tag="h2">Voting ({event.name})</Heading>

{#if unsubmittedBallots !== undefined && submittedBallots !== undefined}
	<Heading tag="h3" class="my-2 text-center">Active ({unsubmittedBallots.length})</Heading>
	<ul class="text-center">
		{#each unsubmittedBallots as ballot (ballot.id)}
			<li>{ballot.voter_name}</li>
		{/each}
	</ul>
	<Heading tag="h3" class="my-2 text-center">Submitted ({submittedBallots.length})</Heading>
	<ul class="text-center">
		{#each submittedBallots as ballot (ballot.id)}
			<li>{ballot.voter_name}</li>
		{/each}
	</ul>

	{#if submittedBallots.length === 0 && unsubmittedBallots.length === 0}
		<P class="text-center">No ballots available.</P>
	{/if}
{:else}
	<P class="text-center">Loading ballots...</P>
{/if}

<div class="flex min-h-full flex-wrap items-stretch gap-2">
	<Button size="sm" outline color="red" class="grow" onclick={openRegistration}>
		Temporarily Open Registration
	</Button>
	<Button size="xl" color="blue" class="grow" onclick={closeVoting}>Close Voting</Button>
</div>
