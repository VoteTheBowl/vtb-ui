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

	function sortBallotItems(a: BallotItem, b: BallotItem) {
		const aWeight = a.event.closed ? dayjs(a.event.closed).unix() : 0;
		const bWeight = b.event.closed ? dayjs(b.event.closed).unix() : 0;

		if (bWeight == 0) return 1;

		if (aWeight == 0) return -1;

		return bWeight - aWeight;
	}

	async function fetchEvent(client: EventsAPI, ballotID: number, eventID: number, token: string) {
		try {
			const event = await client.getEvent(eventID, token);
			return {
				id: ballotID,
				event
			};
		} catch (e) {
			const status = (e as APIError).status;
			if (status == 404 || status == 403) storage.deleteBallot(ballotID);
			else throw e;
		}
	}

	onMount(async () => {
		const eventApi = new EventsAPI();
		const localBallots = storage.data.ballots;

		let promises: Promise<BallotItem | undefined>[] = [];

		for (const key in localBallots) {
			const keyAsNumber = Number(key);

			promises.push(
				fetchEvent(
					eventApi,
					keyAsNumber,
					localBallots[keyAsNumber].eventID,
					localBallots[keyAsNumber].token
				)
			);
		}

		ballots = (await Promise.all(promises)).filter((bi) => bi !== undefined);
	});
</script>

<Section title="Ballots">
	{#if ballots.length === 0}
		<p>No past ballots found.</p>
	{:else if ballots.length}
		<ul>
			{#each ballots.toSorted(sortBallotItems) as ballot (ballot.id)}
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
