<script lang="ts">
	import type { ResultComponentProps } from '#lib/voting-system/types.js';
	import ChoiceLabel from '../ChoiceLabel.svelte';
	import type { PluralityResultType } from './types';

	let { event }: ResultComponentProps = $props();
	const result = $derived(
		Object.entries(event.result as PluralityResultType).sort((a, b) => b[1] - a[1])
	);
</script>

{#if result.length}
	{@const choice = event.choices.find(({ string_id }) => result[0][0] === string_id)}
	{#if choice}
		<div class="mb-8">
			<h4>Winner</h4>
			<ChoiceLabel hideLabel={event.hide_choice_labels} label={choice.label} alias={choice.alias} />
		</div>
	{/if}
{/if}

<h4 class="border-b-2">Totals</h4>
{#each result as vote (vote[0])}
	{@const choice = event.choices.find(({ string_id }) => vote[0] === string_id)}
	{#if choice}
		<div class="my-2 flex items-center justify-between">
			<ChoiceLabel hideLabel={event.hide_choice_labels} label={choice.label} alias={choice.alias} />
			<span class="dark:text-white">{vote[1]}</span>
		</div>
	{/if}
{/each}
