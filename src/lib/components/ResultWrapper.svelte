<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_REFRESH_DELAY } from '$app/env/public';
	import votingSystems from '#lib/voting-system/config.js';
	import { EventsAPI, type EventResponseData } from '#lib/api/events.js';

	let { event, token }: { event: EventResponseData; token: string } = $props();
	const config = $derived(votingSystems[event.electoral_system]);

	let timeoutID: NodeJS.Timeout;

	async function getEvent() {
		const api = new EventsAPI();
		event = await api.getEvent(event.id, token);

		clearTimeout(timeoutID);
		timeoutID = setTimeout(getEvent, PUBLIC_REFRESH_DELAY);
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
