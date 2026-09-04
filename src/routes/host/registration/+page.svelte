<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { EventsAPI } from '$lib/api/events';
	import ConfirmationModal from '$lib/components/ConfirmationModal.svelte';
	import BasicPageLayout from '$lib/components/layouts/BasicPageLayout.svelte';
	import { getBallotsContext, getEventContext } from '$lib/context';
	import { getStorageContext } from '$lib/storage/storage.svelte';
	import QRCode from '@castlenine/svelte-qrcode';
	import { Button } from 'flowbite-svelte';
	import { ClipboardCheckOutline, ClipboardCleanOutline } from 'flowbite-svelte-icons';

	const eventContext = getEventContext();
	const ballotsContext = getBallotsContext();
	const storage = getStorageContext();

	let ballotCount = $derived(ballotsContext.ballots?.length || 0);
	let copied = $state(false);
	let shareURL: string = $derived(
		page.url.protocol +
			'//' +
			page.url.host +
			'/register' +
			'?e=' +
			eventContext.event?.id +
			'&s=' +
			eventContext.event?.share_token
	);

	const onCopyClick = () => {
		navigator.clipboard.writeText(shareURL);
		copied = true;
	};

	let openConfirmStart = $state(false);

	const beginVote = async () => {
		if (!eventContext.event) return;

		const api = new EventsAPI();
		eventContext.event = await api.updateEvent(
			eventContext.event.id,
			storage.getEvent(eventContext.event.id).token,
			{
				allow_registration: false,
				allow_voting: true
			}
		);
		goto(resolve(`/host/voting?e=${eventContext.event.id}`), { replaceState: true });
	};
</script>

<BasicPageLayout
	class="flex min-h-dvh flex-col justify-between gap-8"
	title="Registration"
	eventName={eventContext.event?.name}
>
	<div>
		<p class="mb-4">
			Share the QR-code with voters to allow them to register. Atleast 2 voters have to be
			registered to <i>begin voting</i>.
			<b>If you <i>begin voting</i>, users will no longer be able to register.</b>
		</p>

		<Button
			onclick={onCopyClick}
			class="mb-2 flex w-full max-w-md cursor-pointer flex-col items-center gap-4 p-4"
		>
			<QRCode data={shareURL} isResponsive />
			<div class="flex">
				{#if copied}
					<ClipboardCheckOutline class="h-6 w-6 shrink-0" />
				{:else}
					<ClipboardCleanOutline class="h-6 w-6 shrink-0" />
				{/if}
				{copied ? 'Invitation copied to clipboard' : 'Copy invitation to clipboard'}
			</div>
		</Button>

		<p class="mb-6 max-w-md rounded-lg bg-primary-700 p-4 text-white dark:bg-primary-600">
			{shareURL}
		</p>

		<h3 class="mb-2">Registered Voters ({ballotCount})</h3>
		<div class="dark:text-white">
			{#if ballotsContext.ballots == null}
				<p>Loading...</p>
			{:else if ballotsContext.ballots.length == 0}
				<p>No voters have registered yet.</p>
			{:else}
				<ul>
					{#each ballotsContext.ballots as ballot (ballot.id)}
						<li>{ballot.voter_name}</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>

	<Button
		size="xl"
		class="w-full"
		disabled={ballotCount < 2}
		onclick={() => (openConfirmStart = true)}
	>
		Begin Vote
	</Button>

	<ConfirmationModal
		bind:open={openConfirmStart}
		cancelButtonLabel="Not Sure"
		heading="Begin Vote?"
		onconfirm={beginVote}
	>
		Are you sure all participant's have registered?
	</ConfirmationModal>
</BasicPageLayout>
