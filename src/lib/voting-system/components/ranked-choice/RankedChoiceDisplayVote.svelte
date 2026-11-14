<script lang="ts">
	import type { DisplayOnlyVotingComponentProps } from '#lib/voting-system/types.js';
	import ChoiceLabel from '../ChoiceLabel.svelte';
	import type { RankedSubmissionType } from './types';

	const { submission, event }: DisplayOnlyVotingComponentProps<RankedSubmissionType> = $props();
</script>

<section class="min-h-md">
	{#each submission as item, index (item)}
		{@const choice = event.choices.find(({ string_id }) => string_id === item)}
		{#if choice}
			<div
				class="my-4 flex min-w-48 items-baseline rounded-lg bg-gray-200 px-4 py-3.5 text-black dark:bg-gray-700 dark:text-gray-300"
			>
				<div class="pr-2 font-bold">
					{index + 1}.
				</div>
				<ChoiceLabel
					hideLabel={event.hide_choice_labels}
					label={choice.label}
					alias={choice.alias}
				/>
			</div>
		{/if}
	{/each}
</section>
