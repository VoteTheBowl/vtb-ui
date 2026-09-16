<script lang="ts">
	import BasicPageLayout from '$lib/components/layouts/BasicPageLayout.svelte';
	import EventForm from '$lib/components/EventForm.svelte';
	import { getStorageContext } from '$lib/storage/storage.svelte';
	import Button from '$lib/components/Button.svelte';

	const storage = getStorageContext();
</script>

<BasicPageLayout>
	<p>
		Make your cook off voting easy! Create an event and invite others to vote. You don't need an
		account just start by creating an event below and sharing the registration link or QR-code. You
		can choose the voting system that best suits your needs (more on the way).
	</p>

	<div class="mb-6 w-full border-b border-gray-500 pt-6 dark:border-gray-600"></div>

	{#if storage.hasBallots() || storage.hasEvents()}
		<div class="flex flex-row gap-4">
			{#if storage.hasBallots()}
				<Button href="/ballots" class="w-full">My Ballots</Button>
			{/if}
			{#if storage.hasEvents()}
				<Button href="/host" class="w-full">Saved Events</Button>
			{/if}
		</div>

		<div class="mb-6 w-full border-b border-gray-500 pt-6 dark:border-gray-600"></div>
	{/if}

	<EventForm />
</BasicPageLayout>
