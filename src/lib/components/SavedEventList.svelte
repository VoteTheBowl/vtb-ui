<script lang="ts">
	import type { APIError } from '$lib/api/base';
	import { EventsAPI } from '$lib/api/events';
	import { getStorageContext } from '$lib/storage/storage';
	import { Alert } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	type EventItem = {
		name: string;
		state: 'expired' | 'valid' | 'missing';
		id: number;
	};

	let events: EventItem[] = $state([]);

	let ballots: {
		eventName: string;
		state: 'expired' | 'valid' | 'missing';
		id: number;
	}[] = $state([]);

	const storage = getStorageContext();

	onMount(async () => {
		const eventApi = new EventsAPI();

		const localEvents = storage.data.events;
		const localBallots = storage.data.ballots;

		for (const key in localEvents) {
			const keyAsNumber = Number(key);
			try {
				await eventApi.getEvent(keyAsNumber, localEvents[keyAsNumber].token);
				events.push({
					name: localEvents[keyAsNumber].name,
					id: keyAsNumber,
					state: 'valid'
				});
			} catch (e) {
				if ((e as APIError).status == 404) {
					events.push({
						name: localEvents[keyAsNumber].name,
						id: keyAsNumber,
						state: 'missing'
					});
					storage.deleteEvent(keyAsNumber);
				}
			}
		}

		console.log(events);

		for (const key in localBallots) {
			const keyAsNumber = Number(key);
			try {
				const response = await eventApi.getEvent(
					localBallots[keyAsNumber].eventID,
					localBallots[keyAsNumber].token
				);
				ballots.push({
					eventName: response.name,
					id: keyAsNumber,
					state: response.status == 'CL' ? 'expired' : 'valid'
				});
			} catch (e) {
				if ((e as APIError).status == 404) storage.deleteBallot(keyAsNumber);
			}
		}
	});
</script>

{#snippet eventItem(event: EventItem)}
	<Alert>{event.name}</Alert>
{/snippet}

{#each events as event (event.id)}
	{@render eventItem(event)}
{/each}
