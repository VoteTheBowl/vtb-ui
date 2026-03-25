<script lang="ts">
	import type { APIError } from '$lib/api/base';
	import { EventsAPI } from '$lib/api/events';
	import { getStorageContext } from '$lib/storage/storage';
	import { Card, Heading, P } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	type EventItem = {
		name: string;
		state: 'closed' | 'open' | 'missing';
		id: number;
	};

	let events: EventItem[] = $state([]);

	let closedEvents: EventItem[] = $derived(events.filter((event) => event.state === 'closed'));
	let openEvents: EventItem[] = $derived(events.filter((event) => event.state === 'open'));

	const storage = getStorageContext();

	onMount(async () => {
		const eventApi = new EventsAPI();

		const localEvents = storage.data.events;

		for (const key in localEvents) {
			const keyAsNumber = Number(key);

			try {
				const event = await eventApi.getEvent(keyAsNumber, localEvents[keyAsNumber].token);
				events.push({
					name: localEvents[keyAsNumber].name,
					id: keyAsNumber,
					state: event.status === 'CL' ? 'closed' : 'open'
				});
			} catch (e) {
				const status = (e as APIError).status;
				if (status == 404 || status == 403) {
					events.push({
						name: localEvents[keyAsNumber].name,
						id: keyAsNumber,
						state: 'missing'
					});
					storage.deleteEvent(keyAsNumber);
				}
			}
		}
	});
</script>

{#snippet eventItem(event: EventItem)}
	<li class="p-0.5">
		<Card class="flex flex-row items-center justify-between px-4 py-3" href={`/event/${event.id}`}>
			{event.name}
		</Card>
	</li>
{/snippet}

{#if events.length === 0}
	<P>No past events found.</P>
{:else}
	{#if openEvents.length}
		<Heading tag="h4" class="text-lg">Open</Heading>
		<ul class="mb-4">
			{#each openEvents as event (event.id)}
				{@render eventItem(event)}
			{/each}
		</ul>
	{/if}
	{#if closedEvents.length}
		<Heading tag="h4" class="text-lg">Closed</Heading>
		<ul class="mb-4">
			{#each closedEvents.slice(0, 5) as event (event.id)}
				{@render eventItem(event)}
			{/each}
		</ul>
	{/if}
{/if}
