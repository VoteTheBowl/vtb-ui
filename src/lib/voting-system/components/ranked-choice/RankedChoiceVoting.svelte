<script lang="ts">
	import { dndzone, type DndEvent, type Item } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { onMount } from 'svelte';
	import type { VotingComponentProps } from '#lib/voting-system/types.ts';
	import type { RankedSubmissionType } from './types';
	import { getSubmissionContext } from '#lib/voting-system/context.ts';
	import ChoiceLabel from '../ChoiceLabel.svelte';
	import type { Choice } from '#lib/api/declarations.d.ts';

	let { event }: VotingComponentProps = $props();

	const flipDurationMs = 200;

	let submissionContext = getSubmissionContext();

	let items: Item[] = $state([]);

	function handleSort(e: CustomEvent<DndEvent>) {
		items = e.detail.items;
	}

	function handleFinalize(e: CustomEvent<DndEvent>) {
		items = e.detail.items as Choice[];
		submissionContext.submission = items.map(({ id }) => id) as RankedSubmissionType;
	}

	onMount(() => {
		items = event.choices
			.map(({ string_id }) => ({ id: string_id }))
			.sort(() => Math.random() - 0.5);
		submissionContext.submission = items.map(({ id }) => id) as RankedSubmissionType;
		submissionContext.submissionIsValid = true;
	});
</script>

<p>Drag your preferred options to the top.</p>

<section
	class="min-h-md"
	use:dndzone={{ items, flipDurationMs, dropTargetStyle: { outline: 'none' } }}
	onconsider={handleSort}
	onfinalize={handleFinalize}
>
	{#each items as { id }, index (id)}
		{@const choice = event.choices.find(({ string_id }) => string_id === id)}

		<div
			class="text-gray-black my-4 flex min-w-48 items-baseline rounded-lg bg-gray-200 px-4 py-3.5 dark:bg-gray-700 dark:text-gray-300"
			animate:flip={{ duration: flipDurationMs }}
		>
			{#if choice}
				<div class="pr-2 font-bold">
					{index + 1}.
				</div>
				<ChoiceLabel
					hideLabel={event.hide_choice_labels}
					label={choice.label}
					alias={choice.alias}
				/>
			{/if}
		</div>
	{/each}
</section>
