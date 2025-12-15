<script lang="ts">
	import { page } from '$app/state';
	import { EventsAPI } from '$lib/api/events';
	import { onMount, setContext } from 'svelte';
	import type { EventContext } from '$lib/types';
	import { getStorageContext } from '$lib/storage/storage';

	const { children } = $props();

	const eventID = $derived(Number(page.params.id));
	const ballotID = $derived(Number(page.params.ballotID));

	const storage = getStorageContext();

	const eventContext: EventContext = $state({
		event: null
	});
	setContext('event-data', eventContext);

	onMount(async () => {
		const api = new EventsAPI();
		const token = storage.getBallot(ballotID).token;

		eventContext.event = await api.getEvent(eventID, token);
	});
</script>

{@render children()}
