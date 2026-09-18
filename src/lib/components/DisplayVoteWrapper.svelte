<script lang="ts">
	import type { EventResponseData, BallotResponseData } from '$lib/api/events';
	import votingSystems from '$lib/voting-system/config';
	import Section from './Section.svelte';
	import Icon from './Icon.svelte';

	let {
		event,
		ballot = $bindable(),
		title = 'Your Submitted Ballot'
	}: {
		event: EventResponseData;
		ballot: BallotResponseData;
		title?: string;
	} = $props();

	const config = $derived(votingSystems.find((value) => value.id === event.electoral_system));
</script>

<Section {title}>
	{#snippet icon()}
		<Icon icon="lock" />
	{/snippet}
	{#if config}
		<config.displayOnlyVote {event} {ballot} />
	{:else}
		Config Error!
	{/if}
</Section>
