<script lang="ts">
	import { page } from '$app/state';
	import { BallotAPI, EventsAPI } from '$lib/api/events';
	import { VOTER_REFRESH_DELAY } from '$lib/const';
	import { getBallotContext, getEventContext } from '$lib/context';
	import { getStorageContext } from '$lib/storage/storage.svelte';
	import { onDestroy, onMount } from 'svelte';

	const ballotID = $derived(Number(page.url.searchParams.get('b')));

	let eventContext = getEventContext();
	let ballotContext = getBallotContext();
	const storage = getStorageContext();

	let timeout: string | number | NodeJS.Timeout | undefined;

	onMount(async () => {
		if (isNaN(ballotID)) {
			//Error
		} else {
			const { eventID, token } = storage.getBallot(ballotID);
			const eventsClient = new EventsAPI();
			const ballotClient = new BallotAPI();

			ballotContext.ballot = await ballotClient.getBallot(ballotID, token);
			eventContext.event = await eventsClient.getEvent(eventID, token);

			timeout = setInterval(async () => {
				eventContext.event = await eventsClient.getEvent(eventID, token);
			}, VOTER_REFRESH_DELAY);
		}
	});

	onDestroy(() => {
		clearInterval(timeout);
	});
</script>
