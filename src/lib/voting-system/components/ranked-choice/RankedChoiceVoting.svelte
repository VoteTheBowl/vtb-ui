<script lang="ts">
	import { dndzone, type DndEvent, type Item } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { getContext, onMount } from 'svelte';
	import type { SubmissionContext } from '$lib/types';
	import type { VotingComponentProps } from '$lib/voting-system/types';
	import type { RankedSubmission } from './types';

	let { event }: VotingComponentProps = $props();

	const flipDurationMs = 200;

	let submissionContext: SubmissionContext = getContext('ballot-data');

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
	use:dndzone={{ items, flipDurationMs, dropTargetStyle: { outline: 'none' } }}
	onconsider={handleSort}
	onfinalize={handleFinalize}
>
	{#each items as item, index (item.id)}
		<div class="choice-card" animate:flip={{ duration: flipDurationMs }}>
			<div class="rank-number">
				{index + 1}.
			</div>
			<div>
				{item.title}
			</div>
		</div>
	{/each}
</section>

<style>
	.choice-card {
		display: flex;
		min-width: 15em;
		background-color: #e4e4e4;
		border-radius: 8px;
		margin: 15px;
		padding: 15px 20px;
	}

	.rank-number {
		padding-right: 10px;
		font-weight: bold;
		color: #909090;
	}

	section {
		min-height: 12em;
	}
</style>
