<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { getSubmissionContext } from '$lib/voting-system/context';

	let submissionContext = getSubmissionContext();
</script>

<div class="mb-4 flex-row items-center gap-2 not-visited:flex dark:text-white">
	{#if submissionContext.submissionIsValid}
		<Icon icon="check-circle" class="stroke-green-500" /> Valid
	{:else}
		<Icon icon="x-circle" class="stroke-red-500" /> Invalid
	{/if}
</div>
<pre
	class="rounded-lg bg-gray-200 p-2 text-black dark:bg-gray-700 dark:text-gray-300">{JSON.stringify(
		submissionContext.submission,
		null,
		2
	)}</pre>
