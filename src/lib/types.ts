import type { BallotResponseData, EventResponseData } from '$lib/api/events';

export type ResultContext = { ballots: BallotResponseData[] };
export type EventContext = { event: null | EventResponseData };
export type BallotContext = {
	ballot: BallotResponseData | null;
};
