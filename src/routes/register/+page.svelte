<script lang="ts">
	import { goto } from '$app/navigation';
	import { EventsAPI, type EventResponseData } from '$lib/api/events';
	import { Input, Label, Button, Spinner, Alert } from 'flowbite-svelte';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { APIError } from '$lib/api/base';
	import { ErrorBallotWithEventIDNotFound, getStorageContext } from '$lib/storage/storage.svelte';
	import BasicPageLayout from '$lib/components/layouts/BasicPageLayout.svelte';
	import { page } from '$app/state';

	let eventID = Number(page.url.searchParams.get('e'));
	let shareToken = page.url.searchParams.get('s');

	const storage = getStorageContext();

	let event: EventResponseData | undefined = $state();
	let voterName = $state('');
	let loading: boolean | undefined = $state(undefined);

	let error = $state<string | null>(null);
	let loadingError = $state<string | null>(null);
	const isFormValid = $derived(voterName.trim() !== '');

	const handleSubmit = async (e: SubmitEvent) => {
		e.preventDefault();

		if (event) {
			const api = new EventsAPI();
			let response;
			try {
				response = await api.createBallot(event.id, voterName, event.share_token);
			} catch (e) {
				if (e instanceof APIError && e.status === 422) {
					error = 'That name is already taken. Please choose another name.';
					return;
				} else {
					throw e;
				}
			}

			storage.saveBallot(response.ballot_id, event.id, response.ballot_token);
			await goto(resolve(`/event/${event.id}/ballot/${response.ballot_id}/`));
		}
	};

	onMount(async () => {
		// Don't show loading spinner if we can respond quickly
		const timer = setTimeout(() => {
			loading = true;
		}, 200);

		if (!shareToken || isNaN(eventID)) {
			loadingError = 'Invalid Registration Link!';
			clearTimeout(timer);
			loading = false;
			return;
		}

		const api = new EventsAPI(fetch);

		try {
			event = await api.getEvent(eventID, shareToken);
		} catch (e: unknown) {
			if (e instanceof APIError && e.status) {
				switch (e.status) {
					case 404:
						loadingError = 'This event does not exist!';
						clearTimeout(timer);
						loading = false;
						return;
					case 403:
						loadingError = 'Invalid Registration Link!';
						clearTimeout(timer);
						loading = false;
						return;
					default:
						loadingError = `Unknown Error: ${e.statusText}`;
						clearTimeout(timer);
						loading = false;
						return;
				}
			}
		}

		if (!event) {
			loadingError = `Event not found!`;
			clearTimeout(timer);
			loading = false;
			return;
		}

		if (event.closed) {
			loadingError = `This event has concluded!`;
			clearTimeout(timer);
			loading = false;
			return;
		}

		if (event.allow_registration == false) {
			loadingError = `The host has disabled registration for the ${event.name}. Please contact your host if this is in error.`;
			clearTimeout(timer);
			loading = false;
			return;
		}

		try {
			const ballotID = storage.getBallotIDFromEventID(event.id);
			await goto(resolve(`/event/${event.id}/ballot/${ballotID}/`));
		} catch (e) {
			if (!(e instanceof ErrorBallotWithEventIDNotFound)) {
				throw e;
			}
		}

		clearTimeout(timer);
		loading = false;
	});
</script>

<BasicPageLayout title="Registration">
	{#if loading === false && event && !loadingError}
		<p class="mb-8">
			Register for the <i><b>{event.name}!</b></i> Provide a unique name below and start voting!
		</p>

		<form class="space-y-6" onsubmit={handleSubmit}>
			{#if error}
				<Alert color="red">
					{error}
				</Alert>
			{/if}
			<div>
				<Label for="name" class="mb-2">Name</Label>
				<Input
					id="name"
					placeholder="Enter your name"
					bind:value={voterName}
					oninput={() => {
						error = null;
					}}
					required
				/>
			</div>

			<div class="flex gap-4">
				<Button type="submit" class="flex-1 cursor-pointer" disabled={!isFormValid}>
					Start Voting!
				</Button>
			</div>
		</form>
	{:else if loading === false}
		<p>{loadingError}</p>
	{:else if loading === true}
		<span><Spinner /> Loading...</span>
	{/if}
</BasicPageLayout>
