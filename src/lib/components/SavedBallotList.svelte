<script lang="ts">
	import type { APIError } from '$lib/api/base';
	import { EventsAPI } from '$lib/api/events';
	import { getStorageContext } from '$lib/storage/storage';
	import { Alert, Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	type BallotItem = {
		eventName: string;
		eventID: number;
		state: 'expired' | 'valid' | 'missing';
		id: number;
	};

	let ballots: BallotItem[] = $state([]);

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
					state: response.status == 'CL' ? 'expired' : 'valid'
				});
			} catch (e) {
				if ((e as APIError).status == 404) storage.deleteBallot(keyAsNumber);
			}
		}
	});
</script>

{#snippet ballotItem(ballot: BallotItem)}
	<Alert color="green">
		Ballot - {ballot.eventName}
		<Button href={`/event/${ballot.eventID}/ballot/${ballot.id}`} size="xs" class="py-1">
			Open
		</Button>
	</Alert>
{/snippet}

{#each ballots as ballot (ballot.id)}
	{@render ballotItem(ballot)}
{/each}
