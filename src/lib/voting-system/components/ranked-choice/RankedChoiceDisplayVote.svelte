<script lang="ts">
	import type { DisplayOnlyVotingComponentProps } from '$lib/voting-system/types';
	import type { RankedSubmission } from './types';

	const { ballot }: DisplayOnlyVotingComponentProps = $props();
</script>

<section class="min-h-md">
	{#each ballot.vote as RankedSubmission as item, index (item)}
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
