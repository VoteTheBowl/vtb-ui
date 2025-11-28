<script lang="ts">
	import { page } from '$app/state';
	import { BallotAPI, EventsAPI } from '$lib/api/events';
	import { voterTokenStorage } from '$lib/token-util';
	import { onMount, setContext } from 'svelte';
	import type { BallotContext, EventContext } from '$lib/types';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';

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

	onMount(async () => {
		const eventAPI = new EventsAPI();
		const ballotAPI = new BallotAPI();

		const token = voterTokenStorage.getToken(eventID);

		ballotContext.ballot = await ballotAPI.getBallot(ballotID, token);
		eventContext.event = await eventAPI.getEvent(eventID, token);
	});
</script>

{@render children()}
