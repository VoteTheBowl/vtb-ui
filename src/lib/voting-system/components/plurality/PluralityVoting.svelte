<script lang="ts">
	import { getSubmissionContext } from '$lib/voting-system/context';
	import type { VotingComponentProps } from '$lib/voting-system/types';

	let { event }: VotingComponentProps = $props();

	let selectedChoice: string = $state('');
	let submissionContext = getSubmissionContext();

	$effect(() => {
		submissionContext.submission = { choice: selectedChoice };
		submissionContext.submissionIsValid = selectedChoice !== '';
	});
</script>

<p class="mb-2">Select your top pick.</p>

{#each event.choices as choice (choice)}
	<div class="flex flex-row items-center">
		<input
			class="shrink-10 cursor-pointer"
			type="radio"
			name="items"
			id={choice}
			value={choice}
			bind:group={selectedChoice}
		/>
		<label class="cursor-pointer" for={choice}>{choice}</label>
	</div>
{/each}
