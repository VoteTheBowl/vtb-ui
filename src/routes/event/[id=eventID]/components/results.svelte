<script lang="ts">
	import { EventsAPI, type BallotResponseData, type EventResponseData } from '$lib/api/events';
	import { getStorageContext } from '$lib/storage/storage';
	import votingSystems from '$lib/voting-system/config';
	import { Checkbox, Heading, Label, P } from 'flowbite-svelte';

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
			await api.hideResults(event.id, token);
			event.show_results = false;
		} else {
			await api.showResults(event.id, token);
			event.show_results = true;
		}
	};
</script>

<div>
	<Heading tag="h2" class="mb-4">Results ({event.name})</Heading>
	<Label class="mb-6">
		<Checkbox class="ml-2" checked={event.show_results} onchange={toggleShowResults} />
		Visible to participants
	</Label>

	{#if config}
		{#if ballots}
			<config.results {event} {ballots} />
		{/if}
	{:else}
		Config Error!
	{/if}
</div>
