<script lang="ts">
	import { EventsAPI, type BallotResponseData, type EventResponseData } from '$lib/api/events';
	import { getStorageContext } from '$lib/storage/storage';
	import votingSystems from '$lib/voting-system/config';
	import { Toggle } from 'flowbite-svelte';

	const {
		event = $bindable(),
		ballots
	}: { event: EventResponseData; ballots: BallotResponseData[] | null } = $props();

	const storage = getStorageContext();
	const config = $derived(votingSystems.find((value) => value.id === event.electoral_system));

	const toggleShowResults = async () => {
		const api = new EventsAPI();
		const token = storage.getEvent(event.id).token;
		if (event.show_results) {
			await api.updateEvent(event.id, token, { show_results: false });
			event.show_results = false;
		} else {
			await api.updateEvent(event.id, token, { show_results: true });
			event.show_results = true;
		}
	};
</script>

<div>
	<h2 class="mb-8">{event.name}</h2>
	<h3 class="mb-2">Results</h3>

	<div class="mb-4">
		{#if config}
			{#if ballots}
				<config.results {event} {ballots} />
			{/if}
		{:else}
			Config Error!
		{/if}
	</div>

	<h3 class="mb-2">Settings</h3>
	<Toggle class="ml-2 cursor-pointer" checked={event.show_results} onchange={toggleShowResults}>
		Results {event.show_results ? 'Visible' : 'Hidden'}
	</Toggle>
</div>
