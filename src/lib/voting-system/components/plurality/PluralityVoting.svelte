<script lang="ts">
	import type { EventResponseData } from '$lib/api/events';
	import type { BallotContext } from '$lib/types';
	import { P, Radio } from 'flowbite-svelte';
	import { getContext } from 'svelte';

	let { event }: { event: EventResponseData } = $props();

	let selectedChoice: string = $state('');
	let ballotContext: BallotContext = getContext('ballot-data');

	$effect(() => {
		ballotContext.submission = { choice: selectedChoice };
		ballotContext.submissionIsValid = selectedChoice !== '';
	});
</script>

<P class="text-center">Select your top pick.</P>

{#each event.choices as choice (choice)}
	<Radio name="candidates" id={choice} value={choice} bind:group={selectedChoice} class="my-2">
		{choice}
	</Radio>
{/each}
