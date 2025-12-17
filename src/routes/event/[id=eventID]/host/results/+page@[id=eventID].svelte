<script lang="ts">
	import { page } from '$app/state';
	import { Button, Heading } from 'flowbite-svelte';
	import { hostTokenStorage } from '$lib/token-util';
	import ResultWrapper from '$lib/ResultWrapper.svelte';
	import { onMount, setContext } from 'svelte';
	import { EventsAPI } from '$lib/api/events';
	import type { EventContext } from '$lib/types';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const eventID = $derived(Number(page.params.id));
	let eventContext: EventContext = $state({ event: null });
	let token: string = $state('');

	setContext('event-data', eventContext);

	onMount(async () => {
		const api = new EventsAPI();
		token = hostTokenStorage.getToken(eventID);

		eventContext.event = await api.getEvent(eventID, token);
	});

	const openEvent = async () => {
		const api = new EventsAPI();
		await api.openEvent(eventID, token);
		await goto(resolve(`/event/${eventID}/host/dashboard`), { replaceState: true });
	};
</script>

<Heading tag="h2" class="my-8 text-center">Results</Heading>
<div class="my-4 flex flex-col items-center gap-4">
	{#if eventContext.event}
		<ResultWrapper {eventID} votingSystemID={eventContext.event.electoral_system} {token} />
	{/if}
</div>

<Button onclick={openEvent}>Re-open Event</Button>
