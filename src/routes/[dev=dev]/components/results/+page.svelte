<script lang="ts">
	import type { EventResponseData } from '#lib/api/events.ts';
	import Button from '#lib/components/Button.svelte';
	import Section from '#lib/components/Section.svelte';
	import ThemeSwitch from '#lib/components/ThemeSwitch.svelte';
	import votingConfig, { type VotingSystem } from '#lib/voting-system/config.js';
	import type { Results } from '#lib/voting-system/types.js';

	type TestResult = { title: string; result: Results };

	let event: EventResponseData = $state({
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

	const testResultData: Record<VotingSystem, TestResult[]> = {
		PL: [
			{ title: 'Simple', result: { 'CH-5': 4, 'CH-2': 3 } },
			{ title: 'Tie', result: { 'CH-9': 1, 'CH-6': 1 } },
			{ title: 'Large', result: { 'CH-4': 1, 'CH-2': 3, 'CH-9': 4, 'CH-6': 11 } }
		],
		RC: [
			{
				title: 'Simple',
				result: {
					rounds: [{ tally: { 'CH-2': 2, 'CH-4': 1 }, exhausted: 0 }],
					winner: 'CH-2'
				}
			},
			{
				title: 'Tie',
				result: {
					rounds: [{ tally: { 'CH-4': 3, 'CH-5': 3 }, exhausted: 0 }],
					winner: '__TIE_FLAG__'
				}
			},
			{
				title: 'Large',
				result: {
					rounds: [
						{
							tally: { 'CH-2': 5, 'CH-4': 2, 'CH-6': 4, 'CH-9': 6 },
							exhausted: 0
						},
						{ tally: { 'CH-2': 5, 'CH-9': 6, 'CH-6': 6 }, exhausted: 0 },
						{ tally: { 'CH-9': 9, 'CH-6': 8 }, exhausted: 0 }
					],
					winner: 'CH-9'
				}
			}
		],
		ST: [
			{
				title: 'Simple',
				result: {
					scores: [
						{ choice: 'CH-5', score: 10 },
						{ choice: 'CH-2', score: 8 }
					],
					gold: ['CH-5'],
					silver: ['CH-2'],
					bronze: []
				}
			},
			{
				title: 'Tie',
				result: {
					scores: [
						{ choice: 'CH-5', score: 12 },
						{ choice: 'CH-9', score: 12 }
					],
					gold: ['CH-5', 'CH-9'],
					silver: [],
					bronze: []
				}
			},
			{
				title: 'Large',
				result: {
					scores: [
						{ choice: 'CH-2', score: 23 },
						{ choice: 'CH-5', score: 23 },
						{ choice: 'CH-6', score: 21 },
						{ choice: 'CH-9', score: 15 }
					],
					gold: ['CH-2'],
					silver: ['CH-5'],
					bronze: ['CH-6']
				}
			}
		]
	};
</script>

<div class="m-auto p-4 sm:max-w-xl md:max-w-3xl lg:max-w-5xl">
	<div class="mb-8 flex items-center">
		<h1>All Result Components</h1>
		<ThemeSwitch />
	</div>
	<Button
		class="mb-8"
		onclick={() => {
			event.hide_choice_labels = !event.hide_choice_labels;
		}}
	>
		{event.hide_choice_labels ? 'Show' : 'Hide'} Choice Labels
	</Button>
	{#each Object.entries(votingConfig) as [id, config] (id)}
		<h1 class="mb-4">{config.label}</h1>
		<div class="mb-16 flex flex-row flex-wrap justify-center gap-4 sm:justify-start xl:flex-nowrap">
			{#each testResultData[id] as { title, result } (title)}
				{@const testEvent = { ...event, result }}
				<Section {title}>
					<config.results event={testEvent} />
				</Section>
			{/each}
		</div>
	{/each}
</div>
