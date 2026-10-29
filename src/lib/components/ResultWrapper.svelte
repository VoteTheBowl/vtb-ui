<script lang="ts">
	import { onMount } from 'svelte';
	import { RESULTS_REFRESH_DELAY } from '../const';
	import votingSystems from '$lib/voting-system/config';
	import { EventsAPI, type EventResponseData } from '$lib/api/events';

	let { event, token }: { event: EventResponseData; token: string } = $props();
	const config = $derived(votingSystems[event.electoral_system]);

	let timeoutID: NodeJS.Timeout;

	async function getEvent() {
		const api = new EventsAPI();
		event = await api.getEvent(event.id, token);

		clearTimeout(timeoutID);
		timeoutID = setTimeout(getEvent, RESULTS_REFRESH_DELAY);
	}

	onMount(() => {
		getEvent();

		return () => clearTimeout(timeoutID);
	});
</script>

{#if config && event.result}
	<config.results result={event.result} />
{:else}
	Config Error!
{/if}
