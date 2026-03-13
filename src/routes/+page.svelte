<script lang="ts">
	import EventForm from '$lib/components/EventForm.svelte';
	import SavedBallotList from '$lib/components/SavedBallotList.svelte';
	import SavedEventList from '$lib/components/SavedEventList.svelte';
	import { Heading, P, Hr } from 'flowbite-svelte';
</script>

<div class="p-4">
	<Heading tag="h1" class="mb-6">Vote The Bowl</Heading>

	<P>
		Make your cook off voting easy! Create an event and invite others to vote. You don't need an
		account just start by creating an event below and sharing the registration link or QR-code. You
		can choose the voting system that best suits your needs (more on the way).
	</P>

	<Hr />

	<SavedEventList />
	<SavedBallotList />

	<EventForm />
</div>
