<script lang="ts">
	import { page } from '$app/state';
	import { EventsAPI, BallotAPI } from '$lib/api/events';
	import { onMount, setContext } from 'svelte';
	import type { EventContext, BallotContext } from '$lib/types';
	import { getStorageContext } from '$lib/storage/storage';
	import { VOTER_REFRESH_DELAY } from '$lib/const';

	const { children } = $props();

	const eventID = $derived(Number(page.params.id));
	const ballotID = $derived(Number(page.params.ballotID));

	const storage = getStorageContext();

	const eventContext: EventContext = $state({
		event: null
	});
	const ballotContext: BallotContext = $state({
		ballot: null
	});

	setContext('event-data', eventContext);
	setContext('ballot-data', ballotContext);

	let timeoutID: NodeJS.Timeout;

	const getEvent = async () => {
		if (!page.params.id) return;
		const api = new EventsAPI();

		const token = storage.getBallot(ballotID).token;

		eventContext.event = await api.getEvent(eventID, token);
		clearTimeout(timeoutID);
		timeoutID = setTimeout(getEvent, VOTER_REFRESH_DELAY);
	};

	onMount(() => {
		const ballotAPI = new BallotAPI();
		const token = storage.getBallot(ballotID).token;

		ballotAPI.getBallot(ballotID, token).then((ballot) => {
			ballotContext.ballot = ballot;
		});

		getEvent();

		return () => clearTimeout(timeoutID);
	});
</script>

{@render children()}
