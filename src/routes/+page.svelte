<script lang="ts">
	import EventForm from '$lib/components/EventForm.svelte';
	import { Heading, P, Hr } from 'flowbite-svelte';
</script>

<Heading tag="h1" class="mb-6">Vote The Bowl</Heading>

<P>
	Vote The Bowl is a webapp for organizing and participating in voting events. Create an event and
	invite others to vote. You don't need an account just start by creating event below and sharing
	the registration link via QR-code or a Link.
</P>

<Hr />

<Heading tag="h2">Create an Event</Heading>
<EventForm />
