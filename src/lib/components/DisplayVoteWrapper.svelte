<script lang="ts">
	import type { EventResponseData } from '$lib/api/events';
	import votingSystems from '$lib/voting-system/config';
	import Section from './Section.svelte';
	import Icon from './Icon.svelte';
	import type { Submissions } from '$lib/voting-system/types';

	let {
		event,
		submission,
		title = 'Your Submitted Ballot'
	}: {
		event: EventResponseData;
		submission: Submissions;
		title?: string;
	} = $props();

	const config = $derived(votingSystems.find((value) => value.id === event.electoral_system));
</script>

<Section {title}>
	{#snippet icon()}
		<Icon icon="lock" />
	{/snippet}
	{#if config}
		<config.displayOnlyVote {event} {submission} />
	{:else}
		Config Error!
	{/if}
</Section>
