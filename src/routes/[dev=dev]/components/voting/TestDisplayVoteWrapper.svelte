<script lang="ts">
	import type { EventResponseData } from '#lib/api/events.js';
	import type { VotingConfigItem } from '#lib/voting-system/config.js';
	import { getSubmissionContext } from '#lib/voting-system/context.js';

	const { event, config }: { event: EventResponseData; config: VotingConfigItem } = $props();

	let submissionContext = getSubmissionContext();
</script>

{#if submissionContext.submission}
	<config.displayOnlyVote {event} submission={submissionContext.submission} />
{/if}
