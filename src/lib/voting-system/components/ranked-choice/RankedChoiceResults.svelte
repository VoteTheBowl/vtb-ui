<script lang="ts">
	import type { ResultComponentProps } from '#lib/voting-system/types.js';
	import ChoiceLabel from '../ChoiceLabel.svelte';
	import type { RankedResultType } from './types';

	let { event }: ResultComponentProps = $props();

	const result = $derived(event.result as RankedResultType);
</script>

<p class="mb-4 font-bold">
	{#if result.winner === '__TIE_FLAG__'}
		It's a tie!
	{:else}
		{@const choice = event.choices.find(({ string_id }) => result.winner === string_id)}
		{#if choice}
			<ChoiceLabel hideLabel={event.hide_choice_labels} label={choice.label} alias={choice.alias} /> wins!
		{/if}
	{/if}
</p>

<div class="flex flex-col-reverse">
	{#each result.rounds as { tally, exhausted }, i (i)}
		<div class="round mt-2 w-3xs rounded-lg bg-gray-200 p-2 dark:bg-gray-700">
			<div class="mb-2 text-sm font-light text-gray-600 uppercase dark:text-white">
				Round {i + 1}
			</div>
			<div class="text-gray-700 dark:text-white">
				{#each Object.keys(tally) as candidate (candidate)}
					{@const choice = event.choices.find(({ string_id }) => candidate === string_id)}
					{#if choice}
						<div class="flex items-center justify-between">
							<ChoiceLabel
								hideLabel={event.hide_choice_labels}
								label={choice.label}
								alias={choice.alias}
							/>
							{tally[candidate]}
						</div>
					{/if}
				{/each}
				<div>exhausted votes: {exhausted}</div>
			</div>
		</div>
	{/each}
</div>
