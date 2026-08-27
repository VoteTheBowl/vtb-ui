<script lang="ts">
	import type { BallotResponseData, EventResponseData } from '$lib/api/events';
	import ResultWrapper from '$lib/components/ResultWrapper.svelte';
	import { getStorageContext } from '$lib/storage/storage';

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
<h3 class="mb-8">Results</h3>
<p class="mb-2">
	This event has concluded. Thank you for participating <i>{ballot.voter_name}</i>!
</p>
{#if event.show_results}
	<ResultWrapper {event} token={storage.getBallot(ballot.id).token} />
{/if}
