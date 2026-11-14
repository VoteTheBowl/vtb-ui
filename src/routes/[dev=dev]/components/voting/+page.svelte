<script lang="ts">
	import type { EventResponseData } from '#lib/api/events.js';
	import Section from '#lib/components/Section.svelte';
	import votingConfig from '#lib/voting-system/config.js';
	import TestDisplayVoteWrapper from './TestDisplayVoteWrapper.svelte';
	import TestBallotContextProvider from './TestBallotContextProvider.svelte';
	import TestBallotRawData from './TestBallotRawData.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import Button from '#lib/components/Button.svelte';
	import ThemeSwitch from '#lib/components/ThemeSwitch.svelte';

	let testEvent: EventResponseData = $state({
		id: 1,
		name: 'Test Event',
		electoral_system: 'pl',
		choices: [
			{ alias: 'Chilli 1', id: 2, string_id: 'CH-2', label: "KJ's Chilli Mashup" },
			{ alias: 'Chilli 2', id: 4, string_id: 'CH-4', label: 'Chilli of the Gods' },
			{ alias: 'Chilli 3', id: 5, string_id: 'CH-5', label: 'Plain old Texas Chilli' },
			{ alias: 'Chilli 4', id: 6, string_id: 'CH-6', label: "Grandma's Chilli" },
			{ alias: 'Chilli 5', id: 9, string_id: 'CH-9', label: 'Potatos, What?' }
		],
		allow_registration: true,
		allow_voting: true,
		show_results: true,
		hide_choice_labels: false,
		share_token: 'test-token',
		closed: '2023-01-01T00:00:00Z',
		result: null
	});
</script>

<div class="m-auto p-4 sm:max-w-xl md:max-w-3xl lg:max-w-5xl">
	<div class="flex items-center">
		<h1 class="mb-8">All Voting Components</h1>
		<ThemeSwitch />
	</div>
	<Button
		class="mb-8"
		onclick={() => {
			testEvent.hide_choice_labels = !testEvent.hide_choice_labels;
		}}
	>
		{testEvent.hide_choice_labels ? 'Show' : 'Hide'} Choice Labels
	</Button>
	{#each Object.entries(votingConfig) as [id, config] (id)}
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
