<script lang="ts">
	import type { EventResponseData } from '$lib/api/events';
	import type { SubmissionContext } from '$lib/types';
	import { P, Radio } from 'flowbite-svelte';
	import { getContext } from 'svelte';

	let { event }: { event: EventResponseData } = $props();

	let selectedChoice: string = $state('');
	let submissionContext: SubmissionContext = getContext('ballot-data');

	$effect(() => {
		submissionContext.submission = { choice: selectedChoice };
		submissionContext.submissionIsValid = selectedChoice !== '';
	});
</script>

<P class="text-center">Select your top pick.</P>

{#each event.choices as choice (choice)}
	<Radio name="candidates" id={choice} value={choice} bind:group={selectedChoice} class="my-2">
		{choice}
	</Radio>
{/each}
