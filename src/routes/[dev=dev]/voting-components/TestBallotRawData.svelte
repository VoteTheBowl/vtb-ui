<script lang="ts">
	import { getSubmissionContext } from '$lib/voting-system/context';
	import { CheckCircleSolid, CloseCircleSolid } from 'flowbite-svelte-icons';

	let submissionContext = getSubmissionContext();
</script>

<div class="mb-4 flex-row items-center gap-2 not-visited:flex dark:text-white">
	{#if submissionContext.submissionIsValid}
		<CheckCircleSolid class="h-8 w-8 text-green-500" /> Valid
	{:else}
		<CloseCircleSolid class="h-8 w-8 text-red-500" /> Invalid
	{/if}
</div>
<pre
	class="rounded-lg bg-gray-200 p-2 text-black dark:bg-gray-700 dark:text-gray-300">{JSON.stringify(
		submissionContext.submission,
		null,
		2
	)}</pre>
