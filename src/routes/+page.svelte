<script lang="ts">
	import EventForm from '$lib/components/EventForm.svelte';
	import { Heading, P, Hr } from 'flowbite-svelte';
</script>

<Heading tag="h1" class="mb-6">Vote The Bowl</Heading>

<P>
	Make your cook off voting easy! Create an event and invite others to vote. You don't need an
	account just start by creating an event below and sharing the registration link or QR-code. You
	can choose the voting system that best suits your needs (more on the way).
</P>

<Hr />

<Heading tag="h2">Create an Event</Heading>
<EventForm />
