<script lang="ts">
	import { EventsAPI, type BallotResponseData, type EventResponseData } from '$lib/api/events';
	import DisplayVoteWrapper from '$lib/components/DisplayVoteWrapper.svelte';
	import BasicPageLayout from '$lib/components/layouts/BasicPageLayout.svelte';
	import Section from '$lib/components/Section.svelte';
	import { getStorageContext } from '$lib/storage/storage.svelte';
	import votingSystems from '$lib/voting-system/config';
	import { Toggle } from 'flowbite-svelte';

	const {
		event = $bindable(),
		ballots
	}: { event: EventResponseData; ballots: BallotResponseData[] | null } = $props();

	const storage = getStorageContext();
	const config = $derived(votingSystems.find((value) => value.id === event.electoral_system));
	const myBallot = $derived(
		ballots?.find((b) => b.id === Number(storage.getBallotIDFromEventID(event.id)))
	);

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

<BasicPageLayout class="flex min-h-dvh flex-col gap-8" title="{event.name} - Results">
	<Section title="Results">
		<div class="mb-4">
			{#if config}
				{#if ballots}
					<config.results {event} {ballots} />
				{/if}
			{:else}
				Config Error!
			{/if}
		</div>
	</Section>
	<Section title="Settings">
		<Toggle class="ml-2 cursor-pointer" checked={event.show_results} onchange={toggleShowResults}>
			Results {event.show_results ? 'Visible' : 'Hidden'}
		</Toggle>
	</Section>
	{#if myBallot}
		<DisplayVoteWrapper {event} ballot={myBallot} />
	{/if}
</BasicPageLayout>
