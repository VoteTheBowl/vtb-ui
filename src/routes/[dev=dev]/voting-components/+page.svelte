<script lang="ts">
	import type { EventResponseData } from '$lib/api/events';
	import votingConfig from '$lib/voting-system/config';
	import TestVotingWrapper from './TestVotingWrapper.svelte';

	const testEvent: EventResponseData = {
		id: 1,
		name: 'Test Event',
		electoral_system: 'pl',
		choices: ['Chilli #1', 'Chilli #2', 'Chilli #3', 'Chilli #4', 'Chilli #5'],
		allow_registration: true,
		allow_voting: true,
		show_results: true,
		share_token: 'test-token',
		closed: '2023-01-01T00:00:00Z'
	};
</script>

{#each votingConfig as config (config.id)}
	<TestVotingWrapper>
		<h2 class="mb-2 text-2xl font-bold dark:text-white">{config.label}</h2>
		<config.voting event={testEvent} />
	</TestVotingWrapper>
{/each}
