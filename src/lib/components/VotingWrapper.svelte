<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { setContext } from 'svelte';
	import votingSystems from '$lib/voting-system/config';
	import type { SubmissionContext } from '$lib/types';
	import { BallotAPI, type BallotResponseData, type EventResponseData } from '$lib/api/events';
	import ConfirmationModal from './ConfirmationModal.svelte';

	const {
		ballotID,
		event,
		token,
		onSubmitVote
	}: {
		ballotID: number;
		event: EventResponseData;
		token: string;
		onSubmitVote: (value: BallotResponseData) => void;
	} = $props();
	const config = $derived(votingSystems.find((value) => value.id === event.electoral_system));
	const submissionContext: SubmissionContext = $state({
		submission: {},
		submissionIsValid: false
	});
	let openConfirmationModal = $state(false);

	setContext('ballot-data', submissionContext);

	const submitVote = async () => {
		const ballotAPI = new BallotAPI();
		const ballot = await ballotAPI.submitBallot(ballotID, token, submissionContext.submission);
		onSubmitVote(ballot);
	};
</script>

{#if config}
	<config.voting {event} />
{:else}
	Config Error!
{/if}

<Button
	disabled={!submissionContext.submissionIsValid}
	onclick={() => (openConfirmationModal = true)}
>
	Submit Vote
</Button>

<ConfirmationModal bind:open={openConfirmationModal} heading="Submit Ballot" onconfirm={submitVote}>
	Are you sure you want to submit yor ballot?
</ConfirmationModal>
