<script lang="ts">
	import { setSubmissionContext, type SubmissionContext } from '$lib/voting-system/context';
	import type { Snippet } from 'svelte';

	const { children }: { children: Snippet } = $props();

	const submissionContext: SubmissionContext = $state({
		submission: null,
		submissionIsValid: false
	});
	setSubmissionContext(submissionContext);
</script>

{@render children()}
