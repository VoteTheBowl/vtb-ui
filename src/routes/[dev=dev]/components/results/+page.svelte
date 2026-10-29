<script lang="ts">
	import Section from '$lib/components/Section.svelte';
	import votingConfig, { type VotingSystem } from '$lib/voting-system/config';
	import type { Results } from '$lib/voting-system/types';

	type TestResult = { title: string; result: Results };

	const testResultData: Record<VotingSystem, TestResult[]> = {
		PL: [
			{ title: 'Simple', result: { Chicken: 4, Pork: 3 } },
			{ title: 'Tie', result: { Chicken: 1, Pork: 1 } },
			{ title: 'Large', result: { Chicken: 1, Pork: 3, Beef: 4, Veg: 11 } }
		],
		RC: [
			{
				title: 'Simple',
				result: {
					rounds: [{ tally: { Blue: 2, Red: 1 }, exhausted: 0 }],
					winner: 'Blue'
				}
			},
			{
				title: 'Tie',
				result: {
					rounds: [{ tally: { Blue: 3, Red: 3 }, exhausted: 0 }],
					winner: '__TIE_FLAG__'
				}
			},
			{
				title: 'Large',
				result: {
					rounds: [
						{
							tally: { Blue: 5, Red: 2, Green: 4, Brown: 6 },
							exhausted: 0
						},
						{ tally: { Blue: 5, Green: 6, Brown: 6 }, exhausted: 0 },
						{ tally: { Green: 9, Brown: 8 }, exhausted: 0 }
					],
					winner: 'Green'
				}
			}
		],
		ST: [
			{
				title: 'Simple',
				result: {
					scores: [
						{ choice: 'Blue', score: 10 },
						{ choice: 'Red', score: 8 }
					],
					gold: ['Blue'],
					silver: ['Red'],
					bronze: []
				}
			},
			{
				title: 'Tie',
				result: {
					scores: [
						{ choice: 'Blue', score: 12 },
						{ choice: 'Red', score: 12 }
					],
					gold: ['Blue', 'Red'],
					silver: [],
					bronze: []
				}
			},
			{
				title: 'Large',
				result: {
					scores: [
						{ choice: 'Red', score: 23 },
						{ choice: 'Brown', score: 23 },
						{ choice: 'Green', score: 21 },
						{ choice: 'Blue', score: 15 }
					],
					gold: ['Brown'],
					silver: ['Red'],
					bronze: ['Green']
				}
			}
		]
	};
</script>

<div class="m-auto p-4 sm:max-w-xl md:max-w-3xl lg:max-w-5xl">
	<h1 class="mb-8">All Result Components</h1>
	{#each Object.entries(votingConfig) as [id, config] (id)}
		<h1 class="mb-4">{config.label}</h1>
		<div class="mb-16 flex flex-row flex-wrap justify-center gap-4 sm:justify-start xl:flex-nowrap">
			{#each testResultData[id] as { title, result } (title)}
				<Section {title}>
					<config.results {result} />
				</Section>
			{/each}
		</div>
	{/each}
</div>
