<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { EventsAPI } from '$lib/api/events';
	import Button from '$lib/components/Button.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import BasicPageLayout from '$lib/components/layouts/BasicPageLayout.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Section from '$lib/components/Section.svelte';
	import { getBallotsContext, getEventContext } from '$lib/context';
	import { getStorageContext } from '$lib/storage/storage.svelte';
	import QRCode from '@castlenine/svelte-qrcode';
	import { fade } from 'svelte/transition';

	const eventContext = getEventContext();
	const ballotsContext = getBallotsContext();
	const storage = getStorageContext();

	let ballotCount = $derived(ballotsContext.ballots?.length || 0);
	let copied = $state(false);
	let shareURL: string = $derived(
		page.url.protocol +
			'//' +
			page.url.host +
			'/ballot' +
			'?e=' +
			eventContext.event?.id +
			'&s=' +
			eventContext.event?.share_token
	);

	const onCopyClick = () => {
		navigator.clipboard.writeText(shareURL);
		copied = true;
	};

	// This does not need to be reactive.
	// svelte-ignore non_reactive_update
	let confirmationDialog: HTMLDialogElement;

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
		goto(resolve(`/host/event/voting?e=${eventContext.event.id}`), { replaceState: true });
	};
</script>

<BasicPageLayout
	class="flex min-h-dvh flex-col justify-between gap-8"
	title="Registration"
	subtitle={eventContext.event?.name}
>
	<div>
		<p class="mb-4">
			Share the QR-code with voters to allow them to register. Atleast 2 voters have to be
			registered to <i>begin voting</i>.
			<b>If you <i>begin voting</i>, users will no longer be able to register.</b>
		</p>

		<Section title="Registration QR-Code" class="mb-8 text-black transition-colors dark:text-white">
			{#if eventContext.event}
				<div class="mb-2" in:fade>
					<QRCode data={shareURL} isResponsive backgroundColor="none" color="currentColor" isJoin />
				</div>
			{/if}
			<Button
				onclick={onCopyClick}
				class="mb-4 flex w-full cursor-pointer flex-col items-center gap-4 p-4"
			>
				<div class="flex items-center gap-2">
					{#if copied}
						<Icon icon="check-circle" class="stroke-green-400" />
					{:else}
						<Icon icon="clipboard" />
					{/if}
					{copied ? 'Invitation copied to clipboard' : 'Copy invitation to clipboard'}
				</div>
			</Button>
			<div class="rounded-lg border p-2 text-center break-all">
				{shareURL}
			</div>
		</Section>

		<Section title="Registered Voters ({ballotCount})">
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
		</Section>
	</div>

	<Button class="w-full" disabled={ballotCount < 2} onclick={() => confirmationDialog.showModal()}>
		Begin Vote
	</Button>

	<Modal bind:dialog={confirmationDialog}>
		<p>Are you sure all participant's have registered?</p>
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
					beginVote();
				}}
			>
				Yes
			</Button>
		</div>
	</Modal>
</BasicPageLayout>
