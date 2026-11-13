<script lang="ts">
	import { getSubmissionContext } from '#lib/voting-system/context.js';
	import type { VotingComponentProps } from '#lib/voting-system/types.js';
	import ChoiceLabel from '../ChoiceLabel.svelte';

	let { event }: VotingComponentProps = $props();

	let selectedChoice: string = $state('');
	let submissionContext = getSubmissionContext();

	$effect(() => {
		submissionContext.submission = selectedChoice;
		submissionContext.submissionIsValid = selectedChoice !== '';
	});
</script>

<p class="mb-2">Select your top pick.</p>

{#each event.choices as { string_id, label, alias } (string_id)}
	<div class="flex flex-row items-center">
		<input
			class="shrink-10 cursor-pointer"
			type="radio"
			name="items"
			id={string_id}
			value={string_id}
			bind:group={selectedChoice}
		/>
		<label class="cursor-pointer" for={string_id}>
			<ChoiceLabel hideLabel={event.hide_choice_labels} {label} {alias} />
		</label>
	</div>
{/each}
