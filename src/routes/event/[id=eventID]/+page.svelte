<script lang="ts">
	import { page } from '$app/state';
	import { EventsAPI, type BallotResponseData, type EventResponseData } from '$lib/api/events';
	import { getStorageContext } from '$lib/storage/storage';
	import { onMount } from 'svelte';
	import Registration from './components/registration.svelte';
	import Voting from './components/voting.svelte';
	import Results from './components/results.svelte';
	import { RESULTS_REFRESH_DELAY } from '$lib/const';

	let eventID = $derived(Number(page.params.id));
	let event: EventResponseData | null = $state(null);
	let ballots: BallotResponseData[] | null = $state(null);
	const storage = getStorageContext();

	const getEvent = async () => {
		const api = new EventsAPI();
		event = await api.getEvent(eventID, storage.getEvent(eventID).token);
	};

	const getBallots = async () => {
		if (event == null) return;
		const api = new EventsAPI();
		ballots = await api.listBallots(event.id, storage.getEvent(eventID).token);
	};

	onMount(() => {
		let intervalID: NodeJS.Timeout;
		getEvent().then(() => {
			getBallots();
			intervalID = setInterval(getBallots, RESULTS_REFRESH_DELAY);
		});

		return () => {
			clearInterval(intervalID);
		};
	});
</script>

<div class="flex min-h-dvh flex-col justify-between gap-8 p-4">
	{#if event?.status == 'RE'}
		<Registration bind:event {ballots} />
	{:else if event?.status == 'VO'}
		<Voting bind:event {ballots} />
	{:else if event?.status == 'CL'}
		<Results bind:event {ballots} />
	{:else}
		Loading...
	{/if}
</div>
