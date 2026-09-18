<script lang="ts">
	import votingSystems from '$lib/voting-system/config';
	import { BallotAPI, type BallotResponseData, type EventResponseData } from '$lib/api/events';
	import { setSubmissionContext, type SubmissionContext } from '$lib/voting-system/context';
	import Button from './Button.svelte';
	import Modal from './Modal.svelte';

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

	// svelte-ignore non_reactive_update
	let confirmationDialog: HTMLDialogElement;

	setSubmissionContext(submissionContext);

	const submitVote = async () => {
		const ballotAPI = new BallotAPI();
		const ballot = await ballotAPI.submitBallot(ballotID, token, submissionContext.submission);
		onSubmitVote(ballot);
	};
</script>

<div class="mb-8">
	{#if config}
		<config.voting {event} />
	{:else}
		Config Error!
	{/if}
</div>

<Button
	disabled={!submissionContext.submissionIsValid}
	onclick={() => confirmationDialog.showModal()}
>
	Submit Ballot
</Button>

<Modal bind:dialog={confirmationDialog}>
	<p>Are you sure you want to submit yor ballot?</p>
	<div class="flex flex-row gap-2">
		<Button
			class="grow"
			variant="danger"
			onclick={() => {
				confirmationDialog.close();
			}}
		>
			No
		</Button>
		<Button
			class="grow"
			onclick={() => {
				confirmationDialog.close();
				submitVote();
			}}
		>
			Yes
		</Button>
	</div>
</Modal>
