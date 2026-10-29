import type { BallotResponseData, EventResponseData } from '#lib/api/events.js';

export type EventContext = { event: null | EventResponseData };
export type BallotContext = {
	ballot: BallotResponseData | null;
};
