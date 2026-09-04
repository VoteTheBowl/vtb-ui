<script lang="ts">
	import type { EventContext } from '$lib/types';
	import { onDestroy, onMount } from 'svelte';
	import { checkEventStageAndReroute, getEventFromParamOrReroute } from './utils';
	import { page } from '$app/state';
	import { getStorageContext } from '$lib/storage/storage.svelte';
	import { setBallotsContext, setEventContext, type BallotsContext } from '$lib/context';
	import { EventsAPI } from '$lib/api/events';
	import { RESULTS_REFRESH_DELAY } from '$lib/const';
	import { beforeNavigate, goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const { children } = $props();

	let loading = $state(true);

	let eventContext: EventContext = $state({ event: null });
	let ballotsContext: BallotsContext = $state({ ballots: null });

	setEventContext(eventContext);
	setBallotsContext(ballotsContext);

	const storage = getStorageContext();

	let intervalID: NodeJS.Timeout;

	async function loadRoute(searchParams: URLSearchParams) {
		const client = new EventsAPI();

		eventContext.event = await getEventFromParamOrReroute(searchParams, storage, client);

		if (eventContext.event) {
			const eID = eventContext.event.id;
			ballotsContext.ballots = await client.listBallots(eID, storage.getEvent(eID).token);

			intervalID = setInterval(async () => {
				ballotsContext.ballots = await client.listBallots(eID, storage.getEvent(eID).token);
			}, RESULTS_REFRESH_DELAY);

			await checkEventStageAndReroute(eventContext.event);
		} else {
			clearInterval(intervalID);
			goto(resolve('/host/'), { replaceState: true });
		}
		loading = false;
	}

	beforeNavigate((navigation) => {
		if (
			navigation.to?.url.searchParams.get('e') !== undefined &&
			navigation.from?.url.searchParams.get('e') !== navigation.to?.url.searchParams.get('e')
		)
			loadRoute(navigation.to.url.searchParams);
	});

	onMount(async () => {
		loadRoute(page.url.searchParams);
	});

	onDestroy(() => {
		clearInterval(intervalID);
	});
</script>

{#if !loading}
	{@render children()}
{/if}
