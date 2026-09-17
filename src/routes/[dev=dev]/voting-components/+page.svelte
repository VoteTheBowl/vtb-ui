<script lang="ts">
	import type { EventResponseData } from '$lib/api/events';
	import Section from '$lib/components/Section.svelte';
	import votingConfig from '$lib/voting-system/config';
	import TestDisplayVoteWrapper from './TestDisplayVoteWrapper.svelte';
	import TestBallotContextProvider from './TestBallotContextProvider.svelte';
	import TestBallotRawData from './TestBallotRawData.svelte';
	import { DarkMode } from 'flowbite-svelte';
	import Icon from '$lib/components/Icon.svelte';

	const testEvent: EventResponseData = {
		id: 1,
		name: 'Test Event',
		electoral_system: 'pl',
		choices: ['Chilli #1', 'Chilli #2', 'Chilli #3', 'Chilli #4', 'Chilli #5'],
		allow_registration: true,
		allow_voting: true,
		show_results: true,
		share_token: 'test-token',
		closed: '2023-01-01T00:00:00Z'
	};
</script>

<div class="m-auto p-4 sm:max-w-xl md:max-w-3xl lg:max-w-5xl">
	<h1 class="mb-8">All Voting Components <DarkMode /></h1>
	{#each votingConfig as config (config.id)}
		<TestBallotContextProvider>
			<h1 class="mb-4">{config.label}</h1>
			<div
				class="mb-16 flex flex-row flex-wrap justify-center gap-4 sm:justify-start xl:flex-nowrap"
			>
				<Section title="Ballot">
					<config.voting event={testEvent} />
				</Section>
				<Section title="Submitted Ballot">
					{#snippet icon()}
						<Icon icon="lock" />
					{/snippet}
					<TestDisplayVoteWrapper event={testEvent} {config} />
				</Section>
				<Section title="Raw Data">
					<TestBallotRawData />
				</Section>
			</div>
		</TestBallotContextProvider>
	{/each}
</div>
