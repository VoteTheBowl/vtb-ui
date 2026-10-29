<script lang="ts">
	import type { EventContext } from '#lib/types.js';
	import { onDestroy, onMount } from 'svelte';
	import { getEventFromParamOrReroute } from '../utils';
	import { page } from '$app/state';
	import { getStorageContext } from '#lib/storage/storage.svelte.js';
	import { setBallotsContext, setEventContext, type BallotsContext } from '#lib/context.js';
	import { EventsAPI } from '#lib/api/events.js';
	import { PUBLIC_REFRESH_DELAY } from '$app/env/public';

	const { children } = $props();

	let eventContext: EventContext = $state({ event: null });
	let ballotsContext: BallotsContext = $state({ ballots: null });

	setEventContext(eventContext);
	setBallotsContext(ballotsContext);

	const storage = getStorageContext();

	let intervalID: NodeJS.Timeout;

	onMount(async () => {
		const client = new EventsAPI();

		eventContext.event = await getEventFromParamOrReroute(page.url.searchParams, storage, client);

		if (eventContext.event) {
			const eID = eventContext.event.id;
			ballotsContext.ballots = await client.listBallots(eID, storage.getEvent(eID).token);

			intervalID = setInterval(async () => {
				ballotsContext.ballots = await client.listBallots(eID, storage.getEvent(eID).token);
			}, PUBLIC_REFRESH_DELAY);
		} else {
			clearInterval(intervalID);
		}
	});

	onDestroy(() => {
		clearInterval(intervalID);
	});
</script>

{@render children()}
