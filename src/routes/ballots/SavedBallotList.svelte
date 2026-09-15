<script lang="ts">
	import type { APIError } from '$lib/api/base';
	import { EventsAPI, type EventResponseData } from '$lib/api/events';
	import { getStorageContext } from '$lib/storage/storage.svelte';
	import { getBallotURL, getEventStage } from '$lib/util';
	import { onMount } from 'svelte';
	import Section from '../../lib/components/Section.svelte';
	import dayjs from 'dayjs';
	import { resolve } from '$app/paths';

	type BallotItem = {
		id: number;
		event: EventResponseData;
	};

	let ballots: BallotItem[] = $state([]);

	const storage = getStorageContext();

	onMount(async () => {
		const eventApi = new EventsAPI();
		const localBallots = storage.data.ballots;

		for (const key in localBallots) {
			const keyAsNumber = Number(key);
			try {
				const event = await eventApi.getEvent(
					localBallots[keyAsNumber].eventID,
					localBallots[keyAsNumber].token
				);
				ballots.push({
					id: keyAsNumber,
					event
				});
			} catch (e) {
				const status = (e as APIError).status;
				if (status == 404 || status == 403) storage.deleteBallot(keyAsNumber);
			}
		}
	});
</script>

<Section title="Ballots">
	{#if ballots.length === 0}
		<p>No past ballots found.</p>
	{:else if ballots.length}
		<ul>
			{#each ballots as ballot (ballot.id)}
				{@const eventStage = getEventStage(ballot.event)}
				<li>
					<a
						href={resolve(getBallotURL(ballot.event, ballot.id))}
						class="relative flex flex-row items-center justify-between border-b-2 border-b-transparent
						pt-3 pb-2 no-underline transition-colors duration-300 hover:border-b-black dark:hover:border-b-white"
					>
						<span>{ballot.event.name}</span>
						<span>
							{eventStage}{eventStage === 'Closed'
								? ` - ${dayjs(ballot.event.closed).format('MMM D, YYYY')}`
								: ''}
						</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</Section>
