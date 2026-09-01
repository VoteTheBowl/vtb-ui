<script lang="ts">
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import { EventsAPI } from '$lib/api/events';
	import { Input, Label, Button, Spinner, Alert } from 'flowbite-svelte';
	import { resolve } from '$app/paths';
	import { onMount } from 'svelte';
	import { APIError } from '$lib/api/base';
	import { ErrorBallotWithEventIDNotFound, getStorageContext } from '$lib/storage/storage.svelte';
	import BasicPageLayout from '$lib/components/layouts/BasicPageLayout.svelte';

	const { data }: PageProps = $props();

	const storage = getStorageContext();

	let voterName = $state('');
	let loading: boolean | undefined = $state(undefined);

	let error = $state<string | null>(null);
	const isFormValid = $derived(voterName.trim() !== '');

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();

		const api = new EventsAPI();
		let response;
		try {
			response = await api.createBallot(data.id, voterName, data.share_token);
		} catch (e) {
			if (e instanceof APIError && e.status === 422) {
				error = 'That name is already taken. Please choose another name.';
				return;
			} else {
				throw e;
			}
		}

		storage.saveBallot(response.ballot_id, data.id, response.ballot_token);
		await goto(resolve(`/event/${data.id}/ballot/${response.ballot_id}/`));
	};

	onMount(async () => {
		// Don't show loading spinner if we can respond quickly
		const timer = setTimeout(() => {
			loading = true;
		}, 200);

		try {
			const ballotID = storage.getBallotIDFromEventID(data.id);
			await goto(resolve(`/event/${data.id}/ballot/${ballotID}/`));
		} catch (e) {
			if (!(e instanceof ErrorBallotWithEventIDNotFound)) {
				throw e;
			}
		} finally {
			clearTimeout(timer);
			loading = false;
		}
	});
</script>

<BasicPageLayout title="Registration">
	{#if loading === false}
		<p class="mb-8">
			Register for the <i><b>{data.name}!</b></i> Provide a unique name below and start voting!
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
	{:else if loading === true}
		<span><Spinner /> Loading...</span>
	{/if}
</BasicPageLayout>
