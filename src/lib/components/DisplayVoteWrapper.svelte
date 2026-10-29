<script lang="ts">
	import type { EventResponseData } from '#lib/api/events.js';
	import votingSystems from '#lib/voting-system/config.js';
	import Section from './Section.svelte';
	import Icon from './Icon.svelte';
	import type { Submissions } from '#lib/voting-system/types.js';

	let {
		event,
		submission,
		title = 'Your Submitted Ballot'
	}: {
		event: EventResponseData;
		submission: Submissions;
		title?: string;
	} = $props();

	const config = $derived(votingSystems[event.electoral_system]);
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
