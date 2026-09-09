<script lang="ts">
	import { page } from '$app/state';
	import { BallotAPI, EventsAPI } from '$lib/api/events';
	import { VOTER_REFRESH_DELAY } from '$lib/const';
	import { setBallotContext, setEventContext } from '$lib/context';
	import { getStorageContext } from '$lib/storage/storage.svelte';
	import type { BallotContext, EventContext } from '$lib/types';
	import { onMount } from 'svelte';

	const { children } = $props();

	const ballotID = $derived(Number(page.url.searchParams.get('b')));

	let eventContext: EventContext = $state({ event: null });
	let ballotContext: BallotContext = $state({ ballot: null });
	setEventContext(eventContext);
	setBallotContext(ballotContext);

	const storage = getStorageContext();

	let timeout: string | number | NodeJS.Timeout | undefined;

	onMount(async () => {
		//TODO: This should run on both voting/results pages separately.
		if (page.route.id == '/ballot/results' || page.route.id == '/ballot/voting') {
			if (isNaN(ballotID)) {
				//Error
			} else {
				const { eventID, token } = storage.getBallot(ballotID);
				const eventsClient = new EventsAPI();
				const ballotClient = new BallotAPI();

				eventContext.event = await eventsClient.getEvent(eventID, token);
				ballotContext.ballot = await ballotClient.getBallot(ballotID, token);

				timeout = setInterval(async () => {
					eventContext.event = await eventsClient.getEvent(eventID, token);
				}, VOTER_REFRESH_DELAY);
			}
		} else {
			clearInterval(timeout);
		}
	});
</script>

{@render children()}
