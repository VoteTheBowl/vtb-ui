<script lang="ts">
	import { page } from '$app/state';
	import { EventsAPI } from '$lib/api/events';
	import QRCode from '@castlenine/svelte-qrcode';
	import { Button, Heading } from 'flowbite-svelte';
	import {
		ClipboardCheckOutline,
		ClipboardCleanOutline,
		RefreshOutline
	} from 'flowbite-svelte-icons';
	import { getContext, onMount } from 'svelte';
	import type { HostContext } from '../type';
	import { hostTokenStorage } from '$lib/token-util';

	const REFRESH_DELAY = 3000;

	const hostContext: HostContext = getContext('host-context');
	const eventID: number = $derived(Number(page.params.id));
	let hostToken: string = $state('');
	let copied = $state(false);
	let shareURL: string = $derived(
		page.url.protocol +
			'//' +
			page.url.host +
			'/register' +
			'?e=' +
			page.params.id +
			'&s=' +
			hostContext.event?.share_token
	);

	const onCopyClick = () => {
		navigator.clipboard.writeText(shareURL);
		copied = true;
	};

	let timeoutID: NodeJS.Timeout;

	const getBallots = async () => {
		if (!page.params.id) return;
		const api = new EventsAPI();
		hostContext.ballots = await api.listBallots(eventID, hostToken);
		clearTimeout(timeoutID);
		timeoutID = setTimeout(getBallots, REFRESH_DELAY);
	};

	onMount(() => {
		hostToken = hostTokenStorage.getToken(eventID);
		getBallots();
		return () => clearTimeout(timeoutID);
	});
</script>

<Heading tag="h2" class="my-8 text-center">Event Invitation</Heading>
<div class="my-4 flex flex-col items-center gap-4">
	{#if hostContext.event}
		<QRCode data={shareURL} />
	{/if}

	<Button onclick={onCopyClick} class="flex cursor-pointer items-center gap-2">
		{#if copied}
			<ClipboardCheckOutline class="h-6 w-6 shrink-0" />
		{:else}
			<ClipboardCleanOutline class="h-6 w-6 shrink-0" />
		{/if}
		{copied ? 'Invitation copied to clipboard' : 'Copy invitation to clipboard'}
	</Button>

	<div class="flex items-baseline">
		<Heading tag="h3" class="mt-8">Registered Voters</Heading>
		<Button class="ml-4" color="blue" onclick={getBallots}>
			<RefreshOutline aria-label="Refresh registered voters" />
		</Button>
	</div>
	{#if hostContext.ballots.length > 0}
		<ul>
			{#each hostContext.ballots as ballot (ballot.id)}
				<li>{ballot.voter_name}</li>
			{/each}
		</ul>
	{:else}
		<p>No voters have registered yet.</p>
	{/if}
</div>
