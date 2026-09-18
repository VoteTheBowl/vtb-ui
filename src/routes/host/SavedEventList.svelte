<script lang="ts">
	import type { APIError } from '$lib/api/base';
	import { EventsAPI, type EventResponseData } from '$lib/api/events';
	import { getStorageContext } from '$lib/storage/storage.svelte';
	import { getEventStage, getEventURL } from '$lib/util';
	import dayjs from 'dayjs';
	import { onMount } from 'svelte';
	import Section from '../../lib/components/Section.svelte';
	import { resolve } from '$app/paths';
	import { fade } from 'svelte/transition';

	let events: EventResponseData[] = $state([]);

	const storage = getStorageContext();

	function sortEvents(a: EventResponseData, b: EventResponseData) {
		const aWeight = a.closed ? dayjs(a.closed).unix() : 0;
		const bWeight = b.closed ? dayjs(b.closed).unix() : 0;

		if (bWeight == 0) return 1;

		if (aWeight == 0) return -1;

		return bWeight - aWeight;
	}

	const fetchEvent = async (client: EventsAPI, id: number, token: string) => {
		try {
			return await client.getEvent(id, token);
		} catch (e) {
			const status = (e as APIError).status;
			if (status == 404 || status == 403) {
				storage.deleteEvent(id);
			} else {
				throw e;
			}
		}
	};

	onMount(async () => {
		const eventApi = new EventsAPI();

		const localEvents = storage.data.events;

		let queues: Promise<EventResponseData | undefined>[] = [];

		for (const key in localEvents) {
			const keyAsNumber = Number(key);

			queues.push(fetchEvent(eventApi, keyAsNumber, localEvents[keyAsNumber].token));
		}

		events = (await Promise.all(queues)).filter((e) => e !== undefined);
	});
</script>

<Section title="Events">
	{#if events.length === 0}
		<p>No past events found.</p>
	{:else if events.length}
		<ul>
			{#each events.toSorted(sortEvents) as event (event.id)}
				{@const eventStage = getEventStage(event)}
				<li in:fade>
					<a
						href={resolve(getEventURL(event))}
						class="relative flex flex-row items-center justify-between border-b-2 border-b-transparent
						pt-3 pb-2 no-underline transition-colors duration-300 hover:border-b-black dark:hover:border-b-white"
					>
						<span>{event.name}</span>
						<span>
							{eventStage}{eventStage === 'Closed'
								? ` - ${dayjs(event.closed).format('MMM D, YYYY')}`
								: ''}
						</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</Section>
