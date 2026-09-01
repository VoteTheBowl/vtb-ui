<script lang="ts">
	import { getSubmissionContext } from '$lib/voting-system/context';
	import type { VotingComponentProps } from '$lib/voting-system/types';
	import { Radio } from 'flowbite-svelte';

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
	<Radio name="candidates" id={choice} value={choice} bind:group={selectedChoice} class="my-3">
		<span class="text-2xl">{choice}</span>
	</Radio>
{/each}
