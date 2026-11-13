<script lang="ts">
	import type { DisplayOnlyVotingComponentProps } from '#lib/voting-system/types.js';
	import ChoiceLabel from '../ChoiceLabel.svelte';
	import Star from './Star.svelte';
	import type { StarSubmissionType } from './types';

	let { event, submission }: DisplayOnlyVotingComponentProps<StarSubmissionType> = $props();
</script>

<div class="items-between flex-col">
	{#each event.choices as { string_id, label, alias } (string_id)}
		{#if submission && string_id in submission}
			{@const rating = submission[string_id]}
			<div class="my-2 w-full flex-col items-center justify-between gap-4">
				<ChoiceLabel hideLabel={event.hide_choice_labels} {label} {alias} />
				<div class="relative flex items-center">
					{#each Array(5), index (index)}
						{#if index < rating}
							<Star {index} {rating} />
						{:else if index === 0}
							<p class="p-3 text-xl font-bold">No Rating</p>
						{/if}
					{/each}
				</div>
			</div>
		{/if}
	{/each}
</div>
