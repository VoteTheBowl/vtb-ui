<script lang="ts">
	import type { DisplayOnlyVotingComponentProps } from '$lib/voting-system/types';
	import type { PluralitySubmissionType } from './types';

	const { submission }: DisplayOnlyVotingComponentProps<PluralitySubmissionType> = $props();
</script>

<p class="text-xl">
	You Picked: <span class="text-2xl font-bold">{submission}</span>
</p>
