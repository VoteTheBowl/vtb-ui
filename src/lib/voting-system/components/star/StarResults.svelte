<script lang="ts">
	import type { Choice } from '#lib/api/declarations.d.ts';
	import Icon from '#lib/components/Icon.svelte';
	import type { ResultComponentProps } from '#lib/voting-system/types.ts';
	import ChoiceLabel from '../ChoiceLabel.svelte';
	import type { StarResultType } from './types';

	let { event }: ResultComponentProps = $props();

	const result = $derived(event.result as StarResultType);

	let gold = $derived(
		result['gold']
			.map((stringID) => event.choices.find(({ string_id }) => stringID === string_id))
			.filter((choice) => choice !== undefined)
	);

	let silver = $derived(
		result['silver']
			.map((stringID) => event.choices.find(({ string_id }) => stringID === string_id))
			.filter((choice) => choice !== undefined)
	);

	let bronze = $derived(
		result['bronze']
			.map((stringID) => event.choices.find(({ string_id }) => stringID === string_id))
			.filter((choice) => choice !== undefined)
	);

	let scores = $derived(
		result['scores']
			.map(({ choice, score }) => {
				const fullChoice = event.choices.find(({ string_id }) => choice === string_id);

				return {
					choice: fullChoice,
					score
				};
			})
			.filter(({ choice }) => choice !== undefined)
	);
</script>

{#snippet choiceList(choices: Choice[])}
	{#each choices as { label, alias, string_id } (string_id)}
		<ChoiceLabel hideLabel={event.hide_choice_labels} {label} {alias} />
	{/each}
{/snippet}

<div>
	<div class="mb-8">
		{#if result['gold'].length}
			<div class="mb-4">
				<h4 class="flex items-center gap-1 text-yellow-600 dark:text-yellow-500">
					<Icon
						icon="star"
						class="h-6 w-6 fill-yellow-600! stroke-yellow-600! stroke-[0.5]! dark:fill-yellow-500! dark:stroke-yellow-500!"
					/>
					Gold
				</h4>
				{@render choiceList(gold)}
			</div>
		{/if}

		{#if result['silver'].length}
			<div class="mb-4">
				<h4 class="flex items-center gap-1 text-gray-700 dark:text-gray-300">
					<Icon
						icon="star"
						class="h-6 w-6 fill-gray-500! stroke-gray-500! stroke-[0.5]! dark:fill-gray-300! dark:stroke-gray-300!"
					/>
					Silver
				</h4>
				{@render choiceList(silver)}
			</div>
		{/if}

		{#if result['bronze'].length}
			<div class="mb-4">
				<h4 class="flex items-center gap-1 text-amber-800 dark:text-amber-700">
					<Icon
						icon="star"
						class="h-6 w-6 fill-amber-800! stroke-amber-800! stroke-[0.5]! dark:fill-amber-700! dark:stroke-amber-700!"
					/>
					Bronze
				</h4>
				{@render choiceList(bronze)}
			</div>
		{/if}
	</div>

	{#if scores.length}
		<h4 class="mb-2 border-b-2">All Scores</h4>
		{#each scores as { choice, score } (choice?.string_id)}
			{#if choice}
				<div class="flex items-center justify-between gap-1">
					<ChoiceLabel
						hideLabel={event.hide_choice_labels}
						label={choice.label}
						alias={choice.alias}
					/>

					<div class="flex items-center gap-1 dark:text-white">
						{score}
						<Icon icon="star" class="h-4! w-4! fill-amber-300! stroke-none!" />
					</div>
				</div>
			{/if}
		{/each}
	{/if}
</div>
