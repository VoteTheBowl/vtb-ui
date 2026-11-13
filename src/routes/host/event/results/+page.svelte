<script lang="ts">
	import { EventsAPI } from '#lib/api/events.js';
	import DisplayVoteWrapper from '#lib/components/DisplayVoteWrapper.svelte';
	import BasicPageLayout from '#lib/components/layouts/BasicPageLayout.svelte';
	import Section from '#lib/components/Section.svelte';
	import Switch from '#lib/components/Switch.svelte';
	import { getBallotsContext, getEventContext } from '#lib/context.js';
	import { getStorageContext } from '#lib/storage/storage.svelte.js';
	import votingSystems from '#lib/voting-system/config.js';

	const eventContext = getEventContext();
	const ballotsContext = getBallotsContext();
	const storage = getStorageContext();
	const config = $derived(
		eventContext.event?.electoral_system
			? votingSystems[eventContext.event.electoral_system]
			: undefined
	);
	const myBallot = $derived(
		ballotsContext.ballots?.find((b) => {
			if (eventContext.event) {
				let storedBallotID = undefined;
				try {
					storedBallotID = Number(storage.getBallotIDFromEventID(eventContext.event.id));
				} catch {
					//Do nothing
				}

				return b.id === storedBallotID;
			}
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
	const toggleHideChoiceLabels = async () => {
		if (!eventContext.event) return;

		const api = new EventsAPI();
		const token = storage.getEvent(eventContext.event.id).token;
		if (eventContext.event.hide_choice_labels) {
			await api.updateEvent(eventContext.event.id, token, { hide_choice_labels: false });
			eventContext.event.hide_choice_labels = false;
		} else {
			await api.updateEvent(eventContext.event.id, token, { hide_choice_labels: true });
			eventContext.event.hide_choice_labels = true;
		}
	};
</script>

<BasicPageLayout
	class="flex min-h-dvh flex-col gap-8"
	title="Results"
	subtitle={eventContext.event?.name}
>
	{#if eventContext.event && ballotsContext.ballots && eventContext.event.result}
		{@const event = eventContext.event}
		<Section title="Results">
			<div class="mb-4">
				{#if config}
					<config.results result={eventContext.event.result} />
				{:else}
					Config Error!
				{/if}
			</div>
		</Section>
		<Section title="Settings">
			<div class="flex flex-col gap-3">
				<Switch checked={event.show_results} onchange={toggleShowResults} label="Show Results" />
				{#if event.choices[0].alias}
					<Switch
						checked={event.hide_choice_labels}
						onchange={toggleHideChoiceLabels}
						label="Hide Choice Labels"
					/>
				{/if}
			</div>
		</Section>
		{#if myBallot}
			<DisplayVoteWrapper {event} submission={myBallot.vote} />
		{/if}
	{/if}
</BasicPageLayout>
