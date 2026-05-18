<script lang="ts">
	import type { APIError } from '$lib/api/base';
	import { EventsAPI } from '$lib/api/events';
	import { getStorageContext } from '$lib/storage/storage';
	import { Heading, Listgroup, ListgroupItem, P } from 'flowbite-svelte';
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
					state: event.closed ? 'closed' : 'open'
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
	<ListgroupItem
		class="flex flex-row items-center justify-between px-4 py-3"
		href={`/event/${event.id}`}
	>
		{event.name}
	</ListgroupItem>
{/snippet}

{#if events.length === 0}
	<P class="mb-4">No past events found.</P>
{:else}
	{#if openEvents.length}
		<Listgroup active class="mb-4 ">
			<Heading tag="h4" class="p-4 text-lg">Open</Heading>
			{#each openEvents as event (event.id)}
				{@render eventItem(event)}
			{/each}
		</Listgroup>
	{/if}
	{#if closedEvents.length}
		<Listgroup active class="mb-4">
			<Heading tag="h4" class="p-4 text-lg">Closed</Heading>
			{#each closedEvents.slice(0, 5) as event (event.id)}
				{@render eventItem(event)}
			{/each}
		</Listgroup>
	{/if}
{/if}
