<script lang="ts">
	import type { EventResponseData } from '$lib/api/events';
	import type { VotingConfigItem } from '$lib/voting-system/config';
	import { getSubmissionContext } from '$lib/voting-system/context';

	const { event, config }: { event: EventResponseData; config: VotingConfigItem } = $props();

	let submissionContext = getSubmissionContext();
</script>

{#if submissionContext.submission}
	<config.displayOnlyVote
		{event}
		ballot={{
			id: 0,
			voter_name: 'Test Voter',
			vote: submissionContext.submission,
			created: 'Some Time',
			submitted: submissionContext.submissionIsValid ? 'Another Time' : null
		}}
	/>
{/if}
