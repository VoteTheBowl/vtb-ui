<script lang="ts">
	import type { EventResponseData } from '$lib/api/events';
	import Section from '$lib/components/Section.svelte';
	import votingConfig from '$lib/voting-system/config';
	import { LockOutline } from 'flowbite-svelte-icons';
	import TestDisplayVoteWrapper from './TestDisplayVoteWrapper.svelte';
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
		<div class="relative">
			<Section title="Ballot">
				<config.voting event={testEvent} />
			</Section>
			<Section title="Submitted Ballot" class="absolute bottom-0 left-full">
				{#snippet icon()}
					<LockOutline size="xl" />
				{/snippet}
				<TestDisplayVoteWrapper event={testEvent} {config} />
			</Section>
		</div>
	</TestVotingWrapper>
{/each}
