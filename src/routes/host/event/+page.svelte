<script lang="ts">
	import type { EventResponseData } from '$lib/api/events';
	import BasicPageLayout from '$lib/components/layouts/BasicPageLayout.svelte';
	import { getEventContext } from '$lib/context';
	import { Button } from 'flowbite-svelte';

	const eventContext = getEventContext();

	function getEventURL(event: EventResponseData) {
		if (event?.closed) return `/host/event/results?e=${event.id}`;
		else if (event?.allow_registration == true && event?.allow_voting == false)
			return `/host/event/registration?e=${event.id}`;
		else if (event?.allow_voting == true) return `/host/event/voting?e=${event.id}`;
	}
</script>

<BasicPageLayout title="Event Dashboard" subtitle={eventContext.event?.name}>
	{#if eventContext.event}
		Event Dashboard. Work in Progress...

		<Button href={getEventURL(eventContext.event)}>Go to Event</Button>
	{/if}
</BasicPageLayout>
