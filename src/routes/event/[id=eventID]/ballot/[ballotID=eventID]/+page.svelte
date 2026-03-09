<script lang="ts">
	import { page } from '$app/state';
	import {
		BallotAPI,
		EventsAPI,
		type BallotResponseData,
		type EventResponseData
	} from '$lib/api/events';
	import { getStorageContext } from '$lib/storage/storage';
	import { onMount } from 'svelte';
	import { Heading, P } from 'flowbite-svelte';
	import Voting from './components/voting.svelte';
	import { VOTER_REFRESH_DELAY } from '$lib/const';
	import Results from './components/results.svelte';

	let eventID = $derived(Number(page.params.id));
	let ballotID = $derived(Number(page.params.ballotID));
	let event: EventResponseData | null = $state(null);
	let ballot: BallotResponseData | null = $state(null);
	const storage = getStorageContext();

	const getEvent = async () => {
		const api = new EventsAPI();
		event = await api.getEvent(eventID, storage.getBallot(ballotID).token);
	};

	const getBallot = async () => {
		const ballotAPI = new BallotAPI();
		ballot = await ballotAPI.getBallot(ballotID, storage.getBallot(ballotID).token);
	};

	onMount(() => {
		getBallot();
		getEvent();

		let intervalID: NodeJS.Timeout;
		intervalID = setInterval(getEvent, VOTER_REFRESH_DELAY);

		return () => {
			clearInterval(intervalID);
		};
	});
</script>

<div class="min-h-dvh p-4">
	{#if ballot && event?.status == 'RE'}
		<Heading tag="h1" class="mb-8">{event.name}</Heading>
		<P>
			Thanks for registering for <b>{event.name}</b>. Sit tight and wait for the event to start.
		</P>
	{:else if ballot && event?.status == 'VO'}
		<Voting {event} bind:ballot />
	{:else if ballot && event?.status == 'CL'}
		<Results {event} {ballot} />
	{:else}
		Loading...
	{/if}
</div>
