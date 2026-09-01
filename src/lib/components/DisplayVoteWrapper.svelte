<script lang="ts">
	import type { EventResponseData, BallotResponseData } from '$lib/api/events';
	import votingSystems from '$lib/voting-system/config';
	import { LockOutline } from 'flowbite-svelte-icons';
	import Section from './Section.svelte';

	let {
		event,
		ballot = $bindable(),
		title = 'Your Vote'
	}: {
		event: EventResponseData;
		ballot: BallotResponseData;
		title?: string;
	} = $props();

	const config = $derived(votingSystems.find((value) => value.id === event.electoral_system));
</script>

<Section {title}>
	{#snippet icon()}
		<LockOutline size="xl" />
	{/snippet}
	{#if config}
		<config.displayOnlyVote {event} {ballot} />
	{:else}
		Config Error!
	{/if}
</Section>
