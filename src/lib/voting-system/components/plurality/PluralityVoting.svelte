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

<p>Select your top pick.</p>

{#each event.choices as choice (choice)}
	<Radio name="candidates" id={choice} value={choice} bind:group={selectedChoice} class="my-2">
		{choice}
	</Radio>
{/each}
