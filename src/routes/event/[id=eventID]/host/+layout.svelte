<script lang="ts">
	import { BottomNav, BottomNavItem, Button, Modal } from 'flowbite-svelte';
	import {
		ShareNodesOutline,
		GridOutline,
		LockSolid,
		ExclamationCircleOutline
	} from 'flowbite-svelte-icons';
	import { page } from '$app/state';
	import { onMount, setContext } from 'svelte';
	import type { HostContext } from './type';
	import { EventsAPI } from '$lib/api/events';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { hostTokenStorage } from '$lib/token-util';

	let { children } = $props();

	let activeUrl = $derived(page.url.pathname);
	let eventID = $derived(Number(page.params.id));
	let confirmationModalOpen = $state(false);
	let hostContext: HostContext = $state({ event: null, ballots: [] });

	setContext('host-context', hostContext);

	const onCloseEvent = async () => {
		if (eventID === undefined) return;

		const api = new EventsAPI();
		await api.closeEvent(eventID, hostTokenStorage.getToken(eventID));

		goto(resolve(`/event/${eventID}/host/results/`));
	};

	onMount(async () => {
		//Cannot use load function in layout, cannot access localStorage in load function
		const api = new EventsAPI(fetch);
		const hostToken = hostTokenStorage.getToken(eventID);
		hostContext.event = await api.getEvent(eventID, hostToken);
		hostContext.ballots = await api.listBallots(eventID, hostToken);
	});
</script>

<div class="pb-24">
	{@render children?.()}
</div>

<BottomNav {activeUrl} navType="card" classes={{ inner: 'grid-cols-3' }}>
	<BottomNavItem href="/event/{eventID}/host/invitation" btnName="Invitation">
		<ShareNodesOutline class="h-6 w-6" />
	</BottomNavItem>
	<BottomNavItem href="/event/{eventID}/host/dashboard" btnName="Dashboard" appBtnPosition="middle">
		<GridOutline class="h-6 w-6" />
	</BottomNavItem>
	<BottomNavItem
		btnName="Close Vote"
		class="cursor-pointer"
		onclick={() => {
			confirmationModalOpen = true;
		}}
	>
		<LockSolid />
	</BottomNavItem>
</BottomNav>

<Modal form bind:open={confirmationModalOpen} size="xs" permanent>
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Are you sure you want to close voting to this event?
		</h3>
		<div class="space-x-2">
			<Button type="submit" value="yes" color="red" class="cursor-pointer" onclick={onCloseEvent}>
				Yes, I'm sure
			</Button>
			<Button type="submit" value="no" color="alternative" class="cursor-pointer">
				No, cancel
			</Button>
		</div>
	</div>
</Modal>
