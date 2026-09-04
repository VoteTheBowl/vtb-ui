<script lang="ts">
	import { EventsAPI } from '$lib/api/events';
	import DisplayVoteWrapper from '$lib/components/DisplayVoteWrapper.svelte';
	import BasicPageLayout from '$lib/components/layouts/BasicPageLayout.svelte';
	import Section from '$lib/components/Section.svelte';
	import { getBallotsContext, getEventContext } from '$lib/context';
	import { getStorageContext } from '$lib/storage/storage.svelte';
	import votingSystems from '$lib/voting-system/config';
	import { Toggle } from 'flowbite-svelte';

	const eventContext = getEventContext();
	const ballotsContext = getBallotsContext();
	const storage = getStorageContext();
	const config = $derived(
		votingSystems.find((value) => value.id === eventContext.event?.electoral_system)
	);
	const myBallot = $derived(
		ballotsContext.ballots?.find((b) => {
			return (
				eventContext.event && b.id === Number(storage.getBallotIDFromEventID(eventContext.event.id))
			);
		})
	);

	const toggleShowResults = async () => {
		if (!eventContext.event) return;

		const api = new EventsAPI();
		const token = storage.getEvent(eventContext.event.id).token;
		if (eventContext.event.show_results) {
			await api.updateEvent(eventContext.event.id, token, { show_results: false });
			eventContext.event.show_results = false;
		} else {
			await api.updateEvent(eventContext.event.id, token, { show_results: true });
			eventContext.event.show_results = true;
		}
	};
</script>

<BasicPageLayout
	class="flex min-h-dvh flex-col gap-8"
	title="Results"
	eventName={eventContext.event?.name}
>
	{#if eventContext.event && ballotsContext.ballots}
		{@const event = eventContext.event}
		{@const ballots = ballotsContext.ballots}
		<Section title="Results">
			<div class="mb-4">
				{#if config}
					<config.results {event} {ballots} />
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
	{/if}
</BasicPageLayout>
