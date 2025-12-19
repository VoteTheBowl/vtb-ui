<script lang="ts">
	import { onMount } from 'svelte';
	import { RESULTS_REFRESH_DELAY } from '../const';
	import votingSystems from '$lib/voting-system/config';
	import { EventsAPI, type BallotResponseData, type EventResponseData } from '$lib/api/events';

	const { event, token }: { event: EventResponseData; token: string } = $props();
	const config = $derived(votingSystems.find((value) => value.id === event.electoral_system));
	let ballots: BallotResponseData[] = $state([]);

	let timeoutID: NodeJS.Timeout;

	async function getBallots() {
		const api = new EventsAPI();
		ballots = await api.listBallots(event.id, token);
		clearTimeout(timeoutID);
		timeoutID = setTimeout(getBallots, RESULTS_REFRESH_DELAY);
	}

	onMount(() => {
		getBallots();

		return () => clearTimeout(timeoutID);
	});
</script>

{#if config}
	<config.results {event} {ballots} />
{:else}
	Config Error!
{/if}
