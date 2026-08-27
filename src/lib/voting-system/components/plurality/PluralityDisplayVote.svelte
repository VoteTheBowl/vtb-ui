<script lang="ts">
	import { getSubmissionContext } from '$lib/voting-system/context';
	import type { VotingComponentProps } from '$lib/voting-system/types';
	import type { Submission } from './types';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { event }: VotingComponentProps = $props();

	let submissionContext = getSubmissionContext();
</script>

<p>{(submissionContext.submission as Submission)?.choice}</p>
