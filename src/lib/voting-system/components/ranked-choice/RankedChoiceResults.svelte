<script lang="ts">
	import type { ResultComponentProps } from '$lib/voting-system/types';
	import type { BallotResponseData, EventResponseData } from '$lib/api/events';
	import type { RankedSubmission } from './types';

	let { event, ballots }: ResultComponentProps = $props();

	const calculateWinner = (
		choiceData: EventResponseData['choices'],
		ballotData: BallotResponseData[]
	) => {
		let ballots = ballotData.map((b) => (Array.isArray(b.vote) ? [...b.vote] : []));
		let choices = [...choiceData];

		const rounds: Record<string, number>[] = [];

		while (true) {
			// Tally votes

			const tallies: Record<string, number> = Object.fromEntries(
				choices.map((choice) => [choice, 0])
			);
			tallies['Exhausted'] = 0;

			ballots.forEach((b) => {
				if (b.length > 0) {
					tallies[(b as RankedSubmission)[0]]++;
				} else {
					tallies['Exhausted']++;
				}
			});

			rounds.push(tallies);

			// Identify round winner and loser (first choices only)

			let roundWinner = choices[0];
			let roundLosers = [choices[0]];

			choices.forEach((choice) => {
				if (tallies[choice] > tallies[roundWinner]) {
					roundWinner = choice;
				}
				if (tallies[choice] < tallies[roundLosers[0]]) {
					roundLosers = [choice];
				}
				if (tallies[choice] === tallies[roundLosers[0]]) {
					roundLosers.push(choice);
				}
			});

			// Purge roundLosers from the ballots (and the choice list)

			ballots.forEach((b, i) => {
				ballots[i] = (b as RankedSubmission).filter((i) => !roundLosers.includes(i));
			});
			choices = choices.filter((c) => !roundLosers.includes(c));

			// Check for a tie and/or an overall winner

			if (choices.length === 0) {
				return { roundData: rounds, overallWinner: '__TIE_FLAG__' };
			}

			// Winner only needs to take over 50% of non-exhausted votes
			const validVoteCount = ballots.length - tallies['Exhausted'];

			if (tallies[roundWinner] / validVoteCount > 0.5) {
				return { roundData: rounds, overallWinner: roundWinner };
			}
		}
	};

	let { roundData, overallWinner } = $derived.by(() => {
		if (ballots.length > 0) {
			return calculateWinner(event.choices, ballots);
		} else {
			return { roundData: [], overallWinner: null };
		}
	});
</script>

<h3>
	{#if overallWinner === '__TIE_FLAG__'}
		It's a tie!
	{:else}
		{overallWinner} wins!
	{/if}
</h3>

<div class="rounds">
	{#each roundData as voteCount, i (i)}
		<div class="round">
			<div class="round-number">Round {i + 1}</div>
			<div class="vote-counts">
				{#each Object.keys(voteCount) as candidate (candidate)}
					<div>{candidate}: {voteCount[candidate]}</div>
				{/each}
			</div>
		</div>
	{/each}
</div>

<style>
	.rounds {
		display: flex;
		flex-direction: column-reverse;
	}

	.round {
		width: 300px;
		margin-top: 1em;
		padding: 1em 1.5em;
		background-color: #efefef;
		border-radius: 8px;
	}

	.round-number {
		color: #585a60;
		text-transform: uppercase;
		font-weight: lighter;
		font-size: 14px;
		margin-bottom: 0.5em;
	}

	.vote-counts {
		color: #474747;
	}
</style>
