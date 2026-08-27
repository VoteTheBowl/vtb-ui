<script lang="ts">
	import { getSubmissionContext } from '$lib/voting-system/context';
	import type { VotingComponentProps } from '$lib/voting-system/types';
	import { onMount } from 'svelte';
	import type { RankedSubmission } from './types';

	const { event }: VotingComponentProps = $props();

	let submissionContext = getSubmissionContext();

	onMount(() => {
		submissionContext.submission = event.choices as RankedSubmission;
		submissionContext.submissionIsValid = true;
	});
</script>

<section class="min-h-md">
	{#each submissionContext.submission as RankedSubmission as item, index (item)}
		<div
			class="my-4 flex min-w-48 rounded-lg bg-gray-200 px-4 py-3.5 text-gray-500 dark:bg-gray-700 dark:text-gray-300"
		>
			<div class="pr-2 font-bold">
				{index + 1}.
			</div>
			<div>
				{item}
			</div>
		</div>
	{/each}
</section>
