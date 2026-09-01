<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	import { VOTER_REFRESH_DELAY } from '$lib/const';

	import {
		BallotAPI,
		EventsAPI,
		type BallotResponseData,
		type EventResponseData
	} from '$lib/api/events';
	import { getStorageContext } from '$lib/storage/storage.svelte';

	import BasicPageLayout from '$lib/components/layouts/BasicPageLayout.svelte';
	import ParticipantVotingPage from './components/ParticipantVotingPage.svelte';
	import ParticipantResultsPage from './components/ParticipantResultsPage.svelte';

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

{#if ballot && event?.allow_registration == true && event?.allow_voting == false}
	<BasicPageLayout title="{event.name} - Voting">
		<p>
			Thanks for registering for <b>{event.name}</b>. Sit tight and wait for the event to start.
		</p>
	</BasicPageLayout>
{:else if ballot && event?.allow_registration == false && event?.allow_voting == true}
	<ParticipantVotingPage {event} bind:ballot />
{:else if ballot && event?.closed}
	<ParticipantResultsPage {event} {ballot} />
{/if}
