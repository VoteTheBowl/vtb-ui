<script lang="ts">
	import type { EventContext, ResultContext } from '$lib/types';
	import { P, Star } from 'flowbite-svelte';
	import { getContext } from 'svelte';
	import type { StarSubmission } from './types';
	import seedrandom from 'seedrandom';

	const eventContext: EventContext = getContext('event-data');
	const resultContext: ResultContext = getContext('results');

	function calulateTotals(
		submissions: StarSubmission[],
		choice: string
	): { total: number; totalFiveStars: number } {
		let total = 0;
		let totalFiveStars = 0;
		for (const submission of submissions) {
			const ratingObj = submission.find((s) => s.choice === choice);
			if (ratingObj && ratingObj.rating > 0) {
				total += ratingObj.rating;
			}
			if (ratingObj && ratingObj.rating === 5) {
				totalFiveStars += 1;
			}
		}
		return { total, totalFiveStars };
	}

	let totalRatings: { choice: string; total: number; totalFiveStars: number }[] = $derived(
		eventContext.event?.choices
			.map((choice) => ({
				choice,
				...calulateTotals(
					resultContext.ballots
						.filter((ballot) => ballot.submitted)
						.map((ballot) => ballot.vote as StarSubmission),
					choice
				)
			}))
			.sort((a, b) => b.total - a.total) || []
	);

	function calculateResults(choices: string[] | undefined, ballots: ResultContext['ballots']) {
		if (choices === undefined || choices.length === 0) return null;
		if (ballots.length === 0) return null;
		if (choices.length === 1) return { winner: choices[0], reasoning: '' };

		ballots = ballots.filter((ballot) => ballot.submitted);

		const rng = seedrandom(ballots.length.toString());

		let winner: { winner: string; reasoning: string } | null = null;

		const finalResults =
			choices
				.map((choice) => ({
					choice,
					...calulateTotals(
						ballots.map((ballot) => ballot.vote as StarSubmission),
						choice
					)
				}))
				.sort((a, b) => b.total - a.total) || [];

		const ties = finalResults
			.filter((rt) => rt.total === finalResults[0].total)
			.sort((a, b) => b.totalFiveStars - a.totalFiveStars);

		if (ties.length > 2) {
			// More than 2 way tie, use total five stars as tiebreaker
			const secondTies = ties.filter((rt) => rt.totalFiveStars === ties[0].totalFiveStars);

			if (secondTies.length > 1) {
				// Still a tie, pick randomly among tied choices
				const randomWinnerIndex = Math.floor(rng() * secondTies.length);
				winner = {
					winner: secondTies[randomWinnerIndex].choice,
					reasoning: 'Broke multi-level tie with random selection'
				};
			} else {
				winner = {
					winner: ties[0].choice,
					reasoning: 'Broke tie with most 5-star ratings'
				};
			}
		} else {
			//runoff winner
			let candidate1Total = 0;
			let candidate2Total = 0;

			for (const ballot of ballots) {
				const vote = ballot.vote as StarSubmission;

				const candidate1Rating =
					vote.find((vt) => vt.choice === finalResults[0].choice)?.rating ?? 0;
				const candidate2Rating =
					vote.find((vt) => vt.choice === finalResults[1].choice)?.rating ?? 0;

				if (candidate1Rating > candidate2Rating) {
					candidate1Total += 1;
				} else if (candidate2Rating > candidate1Rating) {
					candidate2Total += 1;
				}
			}

			if (candidate1Total === candidate2Total) {
				// Break runoff tie
				if (finalResults[0].total > finalResults[1].total) {
					winner = {
						winner: finalResults[0].choice,
						reasoning: 'Runnoff tie. Broken by higher score.'
					};
				} else if (finalResults[1].total > finalResults[0].total) {
					winner = {
						winner: finalResults[1].choice,
						reasoning: 'Runnoff tie. Broken by higher score.'
					};
				} else {
					//Break score tie.
					if (finalResults[0].totalFiveStars === finalResults[1].totalFiveStars) {
						winner = {
							winner: finalResults[Math.floor(rng() * 2)].choice,
							reasoning: 'Runnoff mult-level tie. Decided randomly.'
						};
					} else if (finalResults[0].totalFiveStars > finalResults[1].totalFiveStars) {
						winner = {
							winner: finalResults[0].choice,
							reasoning: 'Runnoff tie. Most 5-star ratings'
						};
					} else {
						winner = {
							winner: finalResults[1].choice,
							reasoning: 'Runnoff tie. Most 5-star ratings'
						};
					}
				}
			} else if (candidate1Total > candidate2Total) {
				winner = {
					winner: finalResults[0].choice,
					reasoning: ''
				};
			} else {
				winner = {
					winner: finalResults[1].choice,
					reasoning: ''
				};
			}
		}

		return winner;
	}

	let firstPlace: { winner: string; reasoning: string } | null = $derived(
		calculateResults(eventContext.event?.choices, resultContext.ballots)
	);
	let secondPlace: { winner: string; reasoning: string } | null = $derived(
		firstPlace
			? calculateResults(
					eventContext.event?.choices.filter((val) => val !== firstPlace?.winner),
					resultContext.ballots
				)
			: null
	);
	let thirdPlace: { winner: string; reasoning: string } | null = $derived(
		firstPlace && secondPlace
			? calculateResults(
					eventContext.event?.choices.filter(
						(val) => val !== firstPlace?.winner && val !== secondPlace?.winner
					),
					resultContext.ballots
				)
			: null
	);

	function sortRatings(
		a: { choice: string; total: number; totalFiveStars: number },
		b: { choice: string; total: number; totalFiveStars: number }
	) {
		if (firstPlace) {
			if (a.choice === firstPlace.winner) {
				return -1;
			} else if (b.choice === firstPlace.winner) {
				return 1;
			}
		}

		if (secondPlace) {
			if (a.choice === secondPlace.winner) {
				return -1;
			} else if (b.choice === secondPlace.winner) {
				return 1;
			}
		}

		if (thirdPlace) {
			if (a.choice === thirdPlace.winner) {
				return -1;
			} else if (b.choice === thirdPlace.winner) {
				return 1;
			}
		}

		return b.total - a.total;
	}
</script>

{#if eventContext}
	{#each totalRatings.sort(sortRatings) as vote (vote.choice)}
		<div class="flex flex-wrap items-center justify-center gap-2">
			<P class="my-2">
				{vote.choice} - {vote.total}
			</P>
			<Star fillPercent={100} size={20} ariaLabel="Star icon" />
			{#if firstPlace && vote.choice === firstPlace.winner}
				<P size="sm" class="font-bold text-green-600">(Winner) {firstPlace.reasoning}</P>
			{/if}
			{#if secondPlace && vote.choice === secondPlace.winner}
				<P size="sm" class="font-bold text-blue-600">(Second Place) {secondPlace.reasoning}</P>
			{/if}
			{#if thirdPlace && vote.choice === thirdPlace.winner}
				<P size="sm" class="font-bold text-yellow-600">(Third Place) {thirdPlace.reasoning}</P>
			{/if}
		</div>
	{/each}
{/if}
