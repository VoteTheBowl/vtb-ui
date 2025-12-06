<script lang="ts">
	import { page } from '$app/state';
	import { BallotAPI, EventsAPI } from '$lib/api/events';
	import { voterTokenStorage } from '$lib/token-util';
	import { onMount, setContext } from 'svelte';
	import type { BallotContext, EventContext } from '$lib/types';
	import { VOTER_REFRESH_DELAY } from '$lib/const';

	const { children } = $props();

	const eventID = $derived(Number(page.params.id));
	const ballotID = $derived(Number(page.params.ballotID));

	const eventContext: EventContext = $state({
		event: null
	});
	const ballotContext: BallotContext = $state({
		ballot: null
	});

	setContext('event-data', eventContext);
	setContext('ballot-data', ballotContext);

	let token: string = '';
	let timeoutID: NodeJS.Timeout;

	const getEvent = async () => {
		if (!page.params.id) return;
		const api = new EventsAPI();
		eventContext.event = await api.getEvent(eventID, token);
		clearTimeout(timeoutID);
		timeoutID = setTimeout(getEvent, VOTER_REFRESH_DELAY);
	};

	onMount(() => {
		const ballotAPI = new BallotAPI();
		token = voterTokenStorage.getToken(eventID);

		ballotAPI.getBallot(ballotID, token).then((ballot) => {
			ballotContext.ballot = ballot;
		});

		getEvent();

		return () => clearTimeout(timeoutID);
	});
</script>

{@render children()}
