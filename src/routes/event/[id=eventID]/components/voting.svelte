<script lang="ts">
	import type { EventResponseData } from '$lib/api/events';
	import { Button, Heading } from 'flowbite-svelte';
	import { ArrowRightOutline, ArrowLeftOutline } from 'flowbite-svelte-icons';

	const { event = $bindable() }: { event: EventResponseData } = $props();
</script>

<Heading tag="h2">Voting ({event.name})</Heading>

<div class="flex min-h-full flex-wrap items-stretch gap-2">
	<Button
		size="xl"
		color="red"
		class="grow"
		onclick={() => {
			event.status = 'RE';
		}}
	>
		<ArrowLeftOutline class="me-2 h-5 w-5" /> Registration
	</Button>
	<Button
		size="xl"
		color="blue"
		class="grow"
		onclick={() => {
			event.status = 'CL';
		}}
	>
		Close Voting <ArrowRightOutline class="ms-2 h-5 w-5" />
	</Button>
</div>
