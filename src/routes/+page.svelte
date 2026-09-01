<script lang="ts">
	import BasicPageLayout from '$lib/components/layouts/BasicPageLayout.svelte';
	import EventForm from '$lib/components/EventForm.svelte';
	import { getStorageContext } from '$lib/storage/storage.svelte';
	import { Hr, Button } from 'flowbite-svelte';

	const storage = getStorageContext();
</script>

<BasicPageLayout>
	<p>
		Make your cook off voting easy! Create an event and invite others to vote. You don't need an
		account just start by creating an event below and sharing the registration link or QR-code. You
		can choose the voting system that best suits your needs (more on the way).
	</p>

	<Hr />

	{#if storage.hasBallots() || storage.hasEvents()}
		<Button href="/user/dashboard" class="w-full">See past events</Button>

		<Hr innerDivClass="dark:bg-gray-800 dark:text-white">or</Hr>
	{/if}

	<EventForm />
</BasicPageLayout>
