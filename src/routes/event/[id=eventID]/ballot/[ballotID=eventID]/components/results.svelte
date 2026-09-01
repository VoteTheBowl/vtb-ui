<script lang="ts">
	import { type BallotResponseData, type EventResponseData } from '$lib/api/events';
	import { getStorageContext } from '$lib/storage/storage';
	import DisplayVoteWrapper from '$lib/components/DisplayVoteWrapper.svelte';
	import ResultWrapper from '$lib/components/ResultWrapper.svelte';
	import Section from '$lib/components/Section.svelte';

	let {
		event,
		ballot
	}: {
		event: EventResponseData;
		ballot: BallotResponseData;
	} = $props();

	const storage = getStorageContext();
</script>

<h2 class="mb-4">{event.name}</h2>

<p class="mb-12">
	This event has concluded. Thank you for participating <i>{ballot.voter_name}</i>!
	{#if !event.show_results}
		<br />
		<br />
		Your host has chosen to hide the final results, please talk to the host to find out the winner!
	{/if}
</p>
{#if event.show_results}
	<Section title="Results" class="mb-16">
		<ResultWrapper {event} token={storage.getBallot(ballot.id).token} />
	</Section>
{/if}

<DisplayVoteWrapper {event} {ballot} />
