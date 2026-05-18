<script lang="ts">
	import type { APIError } from '$lib/api/base';
	import { EventsAPI } from '$lib/api/events';
	import { getStorageContext } from '$lib/storage/storage';
	import { Heading, Listgroup, ListgroupItem, P } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	type BallotItem = {
		eventName: string;
		eventID: number;
		state: 'closed' | 'open';
		id: number;
	};

	let ballots: BallotItem[] = $state([]);
	let closedBallots: BallotItem[] = $derived(ballots.filter((ballot) => ballot.state === 'closed'));
	let openBallots: BallotItem[] = $derived(ballots.filter((ballot) => ballot.state === 'open'));

	const storage = getStorageContext();

	onMount(async () => {
		const eventApi = new EventsAPI();
		const localBallots = storage.data.ballots;

		for (const key in localBallots) {
			const keyAsNumber = Number(key);
			try {
				const response = await eventApi.getEvent(
					localBallots[keyAsNumber].eventID,
					localBallots[keyAsNumber].token
				);
				ballots.push({
					eventName: response.name,
					eventID: localBallots[keyAsNumber].eventID,
					id: keyAsNumber,
					state: response.closed ? 'closed' : 'open'
				});
			} catch (e) {
				const status = (e as APIError).status;
				if (status == 404 || status == 403) storage.deleteBallot(keyAsNumber);
			}
		}
	});
</script>

{#snippet ballotItem(ballot: BallotItem)}
	<ListgroupItem
		class="flex flex-row items-center justify-between px-4 py-3"
		href={`/event/${ballot.eventID}/ballot/${ballot.id}`}
	>
		{ballot.eventName}
	</ListgroupItem>
{/snippet}

{#if ballots.length === 0}
	<P class="mb-4">No past ballots found.</P>
{:else}
	{#if openBallots.length}
		<Listgroup active class="mb-4 ">
			<Heading tag="h4" class="p-4 text-lg">Open</Heading>
			{#each openBallots as ballot (ballot.id)}
				{@render ballotItem(ballot)}
			{/each}
		</Listgroup>
	{/if}
	{#if closedBallots.length}
		<Listgroup active class="mb-4">
			<Heading tag="h4" class="p-4 text-lg">Closed</Heading>
			{#each closedBallots.slice(0, 5) as ballot (ballot.id)}
				{@render ballotItem(ballot)}
			{/each}
		</Listgroup>
	{/if}
{/if}
