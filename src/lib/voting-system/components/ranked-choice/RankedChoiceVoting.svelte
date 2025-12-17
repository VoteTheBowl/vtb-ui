<script lang="ts">
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { getContext } from 'svelte';
	import type { BallotContext, EventContext } from '$lib/types';

	const flipDurationMs = 200;

	let eventContext: EventContext = getContext('event-data');
	let ballotContext: BallotContext = getContext('ballot-data');

	let items = eventContext.event?.choices.map((choiceStr) => {
		return { id: choiceStr, title: choiceStr };
	});

	// Randomize order
	items.sort(() => Math.random() - 0.5);

	ballotContext.submission = items.map((i) => i.id);
	ballotContext.submissionIsValid = true;

	function handleSort(e) {
		items = e.detail.items;
	}

	function handleFinalize(e) {
		items = e.detail.items;
		ballotContext.submission = items.map((i) => i.id);
	}
</script>

<p>Drag your preferred options to the top.</p>

<section
	use:dndzone={{ items, flipDurationMs, dropTargetStyle: { outline: 'none' } }}
	on:consider={handleSort}
	on:finalize={handleFinalize}
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
