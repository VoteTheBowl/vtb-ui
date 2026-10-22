<script lang="ts">
	import { dndzone, type DndEvent, type Item } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { onMount } from 'svelte';
	import type { VotingComponentProps } from '$lib/voting-system/types';
	import type { RankedSubmission } from './types';
	import { getSubmissionContext } from '$lib/voting-system/context';

	let { event }: VotingComponentProps = $props();

	const flipDurationMs = 200;

	let submissionContext = getSubmissionContext();

	let items: Item[] = $state([]);

	function handleSort(e: CustomEvent<DndEvent>) {
		items = e.detail.items;
	}

	function handleFinalize(e: CustomEvent<DndEvent>) {
		items = e.detail.items;
		submissionContext.submission = items.map((i) => i.id) as RankedSubmission;
	}

	onMount(() => {
		items = event.choices
			.map((choiceStr) => {
				return { id: choiceStr, title: choiceStr };
			})
			.sort(() => Math.random() - 0.5);
		submissionContext.submission = items.map((i) => i.id) as RankedSubmission;
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
	{#each items as item, index (item.id)}
		<div
			class="my-4 flex min-w-48 rounded-lg bg-gray-200 px-4 py-3.5 text-gray-500 dark:bg-gray-700 dark:text-gray-300"
			animate:flip={{ duration: flipDurationMs }}
		>
			<div class="pr-2 font-bold">
				{index + 1}.
			</div>
			<div>
				{item.title}
			</div>
		</div>
	{/each}
</section>
