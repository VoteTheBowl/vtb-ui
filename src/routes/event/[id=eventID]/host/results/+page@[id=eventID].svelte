<script lang="ts">
	import { page } from '$app/state';
	import { Button, Checkbox, Heading, Label } from 'flowbite-svelte';
	import ResultWrapper from '$lib/ResultWrapper.svelte';
	import { onMount, setContext } from 'svelte';
	import { EventsAPI } from '$lib/api/events';
	import type { EventContext } from '$lib/types';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { getStorageContext } from '$lib/storage/storage';

	const eventID = $derived(Number(page.params.id));
	let eventContext: EventContext = $state({ event: null });
	let token: string = $state('');
	const storage = getStorageContext();

	setContext('event-data', eventContext);

	onMount(async () => {
		const api = new EventsAPI();
		token = storage.getEvent(eventID).token;

		eventContext.event = await api.getEvent(eventID, token);
	});

	const openEvent = async () => {
		const api = new EventsAPI();
		await api.openEvent(eventID, token);
		await goto(resolve(`/event/${eventID}/host/dashboard`), { replaceState: true });
	};

	const toggleShowResults = async () => {
		if (eventContext.event) {
			const api = new EventsAPI();
			if (eventContext.event.show_results) {
				await api.hideResults(eventID, token);
				eventContext.event.show_results = false;
			} else {
				await api.showResults(eventID, token);
				eventContext.event.show_results = true;
			}
		}
	};
</script>

<Heading tag="h2" class="my-8 text-center">Results</Heading>
<div class="my-4 flex flex-col items-center gap-4">
	{#if eventContext.event}
		<ResultWrapper event={eventContext.event} {token} />

		<Label class="ml-4">
			<Checkbox
				class="ml-2"
				checked={eventContext.event.show_results}
				onchange={toggleShowResults}
			/>
			Make results visible to participants
		</Label>

		<Button onclick={openEvent}>Re-open Event</Button>
	{/if}
</div>
