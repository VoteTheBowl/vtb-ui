<script lang="ts">
	import type { DisplayOnlyVotingComponentProps } from '#lib/voting-system/types.js';
	import ChoiceLabel from '../ChoiceLabel.svelte';
	import type { PluralitySubmissionType } from './types';

	const { submission, event }: DisplayOnlyVotingComponentProps<PluralitySubmissionType> = $props();

	const choice = $derived(event.choices.find(({ string_id }) => string_id === submission));
</script>

{#if choice}
	<p class="text-xl">
		You Picked: <span class="text-2xl font-bold"
			><ChoiceLabel
				hideLabel={event.hide_choice_labels}
				label={choice.label}
				alias={choice.alias}
			/></span
		>
	</p>
{:else}
	<p>Something went wrong when finding your submission.</p>
{/if}
