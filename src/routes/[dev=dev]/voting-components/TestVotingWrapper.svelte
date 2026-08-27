<script lang="ts">
	import type { SubmissionContext } from '$lib/types';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import { CheckCircleSolid, CloseCircleSolid } from 'flowbite-svelte-icons';
	import { setContext, type Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();

	const submissionContext: SubmissionContext = $state({
		submission: {},
		submissionIsValid: false
	});
	setContext('ballot-data', submissionContext);
</script>

<div class="p-4">
	{@render children()}
	<div class="flex flex-col-reverse items-start gap-4 pt-4 md:flex-row md:items-center">
		<Accordion>
			<AccordionItem>
				{#snippet header()}<h3 class="text-xl dark:text-white">Submission Data</h3>{/snippet}
				<pre class="text-gray-700 dark:text-gray-300">{JSON.stringify(
						submissionContext.submission,
						null,
						2
					)}</pre>
			</AccordionItem>
		</Accordion>
		<div class="flex flex-row items-center justify-center gap-2 dark:text-white">
			{#if submissionContext.submissionIsValid}
				<CheckCircleSolid class="h-8 w-8 text-green-500" /> Valid
			{:else}
				<CloseCircleSolid class="h-8 w-8 text-red-500" /> Invalid
			{/if}
		</div>
	</div>
</div>
