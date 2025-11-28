<script lang="ts">
	import type { SubmissionContext, EventContext } from '$lib/types';
	import { P, Radio } from 'flowbite-svelte';
	import { getContext } from 'svelte';
	let selectedChoice: string = $state('');

	let eventContext: EventContext = getContext('event-data');
	let submissionContext: SubmissionContext = getContext('ballot-data');

	$effect(() => {
		submissionContext.submission = { choice: selectedChoice };
		submissionContext.submissionIsValid = selectedChoice !== '';
	});
</script>

<P class="text-center">Select your top pick.</P>

{#if eventContext.event}
	{#each eventContext.event.choices as choice (choice)}
		<Radio name="candidates" id={choice} value={choice} bind:group={selectedChoice} class="my-2">
			{choice}
		</Radio>
	{/each}
{/if}
