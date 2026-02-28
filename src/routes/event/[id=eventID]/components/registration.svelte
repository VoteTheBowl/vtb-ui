<script lang="ts">
	import { page } from '$app/state';
	import { EventsAPI, type BallotResponseData, type EventResponseData } from '$lib/api/events';
	import { getStorageContext } from '$lib/storage/storage';
	import QRCode from '@castlenine/svelte-qrcode';
	import { Button, Heading } from 'flowbite-svelte';
	import { ClipboardCheckOutline, ClipboardCleanOutline } from 'flowbite-svelte-icons';

	const {
		event = $bindable(),
		ballots
	}: {
		event: EventResponseData;
		ballots: BallotResponseData[] | null;
	} = $props();

	const storage = getStorageContext();

	let copied = $state(false);
	let shareURL: string = $derived(
		page.url.protocol +
			'//' +
			page.url.host +
			'/register' +
			'?e=' +
			page.params.id +
			'&s=' +
			event.share_token
	);

	const onCopyClick = () => {
		navigator.clipboard.writeText(shareURL);
		copied = true;
	};

	const startVoting = async () => {
		const api = new EventsAPI();
		await api.updateStatus(event.id, storage.getEvent(event.id).token, 'VO');
		event.status = 'VO';
	};
</script>

<div>
	<Heading tag="h2" class="mb-2">Registration ({event.name})</Heading>

	<Button
		onclick={onCopyClick}
		class="mb-6 flex w-full max-w-md cursor-pointer flex-col items-center gap-4 p-4"
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

	<Heading tag="h3" class="mb-2">Registered Voters</Heading>
	{#if ballots == null}
		<p>Loading...</p>
	{:else if ballots.length == 0}
		<p>No voters have registered yet.</p>
	{:else}
		<ul>
			{#each ballots as ballot (ballot.id)}
				<li>{ballot.voter_name}</li>
			{/each}
		</ul>
	{/if}
</div>

<Button size="xl" color="blue" class="w-full" onclick={startVoting}>Begin Voting</Button>
