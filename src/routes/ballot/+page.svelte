<script lang="ts">
	import { goto } from '$app/navigation';
	import { EventsAPI, type EventResponseData } from '$lib/api/events';
	import { Input, Label, Button, Alert } from 'flowbite-svelte';
	import { resolve } from '$app/paths';
	import { APIError } from '$lib/api/base';
	import { getStorageContext } from '$lib/storage/storage.svelte';
	import BasicPageLayout from '$lib/components/layouts/BasicPageLayout.svelte';
	import { page } from '$app/state';
	import { getEventStage } from '$lib/util';
	import { getBallotContext, getEventContext } from '$lib/context';

	let eventID = Number(page.url.searchParams.get('e'));
	let shareToken = page.url.searchParams.get('s');

	const storage = getStorageContext();
	const eventContext = getEventContext();
	const ballotContext = getBallotContext();

	let ballotID: string | undefined = $derived(getBallotID(eventID));

	function getBallotID(eID: number) {
		try {
			return storage.getBallotIDFromEventID(eID);
		} catch {
			return undefined;
		}
	}

	async function getEvent(eID: number, token: string) {
		const api = new EventsAPI(fetch);

		try {
			const event = await api.getEvent(eID, token);
			eventContext.event = event;
			return event;
		} catch (e: unknown) {
			console.warn(e);
		}
	}

	let voterName = $state('');
	let error = $state<string | null>(null);
	const isFormValid = $derived(voterName.trim() !== '');

	const handleSubmit = async (e: SubmitEvent, event: EventResponseData) => {
		e.preventDefault();

		if (event) {
			const api = new EventsAPI();
			let ballot;
			try {
				ballot = await api.createBallot(event.id, voterName, event.share_token);
			} catch (e) {
				if (e instanceof APIError && e.status === 422) {
					error = 'That name is already taken. Please choose another name.';
					return;
				} else {
					throw e;
				}
			}

			const { token, ...simpleBallot } = ballot;

			storage.saveBallot(ballot.id, event.id, token);

			eventContext.event = event;
			ballotContext.ballot = simpleBallot;

			await goto(resolve(`/ballot/voting?b=${ballot.id}`), { replaceState: true });
		}
	};
</script>

<BasicPageLayout title="Registration">
	{#if !shareToken || isNaN(eventID)}
		<p>Invalid token or event id. Talk to your host and try getting a new registration link.</p>
		<Button href="/">Go to homepage</Button>
	{:else}
		{#await getEvent(eventID, shareToken) then e}
			{#if !e}
				<p>Event not found! Talk to your host and try getting a new registration link.</p>
				<Button href="/">Go to homepage</Button>
			{:else if ballotID}
				<p>You have already registed for the {e.name}.</p>

				<Button
					href={getEventStage(e) === 'closed'
						? `/ballot/results?b=${ballotID}`
						: `/ballot/voting?b=${ballotID}`}
				>
					Go to ballot
				</Button>
			{:else if e.closed}
				<p>This event has concluded.</p>
				<Button href="/">Go to homepage</Button>
			{:else if !e.allow_registration}
				<p>
					The host has disabled registration for the {e.name}. Please contact your host if this is
					in error.
				</p>
			{:else}
				<p class="mb-8">
					Register for the <i><b>{e.name}!</b></i> Provide a unique name below and start voting!
				</p>

				<form class="space-y-6" onsubmit={(htmlEvent) => handleSubmit(htmlEvent, e)}>
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
			{/if}
		{/await}
	{/if}
</BasicPageLayout>
