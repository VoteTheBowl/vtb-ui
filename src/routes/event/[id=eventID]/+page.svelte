<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	import { RESULTS_REFRESH_DELAY } from '$lib/const';
	import { getStorageContext } from '$lib/storage/storage.svelte';

	import { EventsAPI, type BallotResponseData, type EventResponseData } from '$lib/api/events';

	import HostRegistrationPage from './components/HostRegistrationPage.svelte';
	import HostVotingPage from './components/HostVotingPage.svelte';
	import HostResultsPage from './components/HostResultsPage.svelte';

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

	//TODO: Convert all host dashboard pages to actual pages. Same for Participant pages
</script>

{#if event?.closed}
	<HostResultsPage bind:event {ballots} />
{:else if event?.allow_registration == true && event?.allow_voting == false}
	<HostRegistrationPage bind:event {ballots} />
{:else if event?.allow_voting == true}
	<HostVotingPage bind:event {ballots} />
{/if}
