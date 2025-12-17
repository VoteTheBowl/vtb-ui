<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { RESULTS_REFRESH_DELAY } from './const';
	import votingSystems from '$lib/voting-system/config';
	import { EventsAPI } from '$lib/api/events';
	import type { ResultContext } from './types';

	const {
		eventID,
		votingSystemID,
		token
	}: { eventID: number; votingSystemID: string; token: string } = $props();
	const config = $derived(votingSystems.find((value) => value.id === votingSystemID));
	const resultContext: ResultContext = $state({ ballots: [] });

	setContext('results', resultContext);

	let timeoutID: NodeJS.Timeout;

	async function getBallots() {
		const api = new EventsAPI();
		resultContext.ballots = await api.listBallots(eventID, token);
		clearTimeout(timeoutID);
		timeoutID = setTimeout(getBallots, RESULTS_REFRESH_DELAY);
	}

	onMount(() => {
		getBallots();

		return () => clearTimeout(timeoutID);
	});
</script>

{#if config}
	<config.results />
{:else}
	Config Error!
{/if}
