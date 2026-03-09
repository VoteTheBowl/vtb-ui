<script lang="ts">
	import type { BallotResponseData, EventResponseData } from '$lib/api/events';
	import ResultWrapper from '$lib/components/ResultWrapper.svelte';
	import { getStorageContext } from '$lib/storage/storage';
	import { Heading, P } from 'flowbite-svelte';

	let {
		event,
		ballot
	}: {
		event: EventResponseData;
		ballot: BallotResponseData;
	} = $props();

	const storage = getStorageContext();
</script>

<Heading tag="h1">{event.name}</Heading>
<Heading tag="h2" class="mb-8">Results</Heading>
<P class="mb-8">
	This event has concluded. Thank you for participating <i>{ballot.voter_name}</i>!
</P>
{#if event.show_results}
	<ResultWrapper {event} token={storage.getBallot(ballot.id).token} />
{/if}
