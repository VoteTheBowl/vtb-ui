<script lang="ts">
	import type { EventResponseData } from '$lib/api/events';
	import { Button, Heading } from 'flowbite-svelte';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';

	const { event = $bindable() }: { event: EventResponseData } = $props();
</script>

<Heading tag="h2">Results ({event.name})</Heading>

<Button
	size="xl"
	color="red"
	class="w-full"
	onclick={() => {
		event.status = 'VO';
	}}
>
	<ArrowLeftOutline class="me-2 h-5 w-5" /> Re-open Voting
</Button>
