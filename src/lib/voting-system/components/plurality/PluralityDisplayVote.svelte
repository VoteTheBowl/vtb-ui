<script lang="ts">
	import type { DisplayOnlyVotingComponentProps } from '$lib/voting-system/types';
	import type { Submission } from './types';

	const { ballot }: DisplayOnlyVotingComponentProps = $props();
</script>

<p class="text-xl">
	You Picked: <span class="text-2xl font-bold">{(ballot.vote as Submission)?.choice}</span>
</p>
