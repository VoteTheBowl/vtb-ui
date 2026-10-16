import type { EventResponseData, BallotResponseData } from '#lib/api/events.js';

export type VotingComponentProps = {
	event: EventResponseData;
};

export type ResultComponentProps = {
	event: EventResponseData;
	ballots: BallotResponseData[];
};

export type DisplayOnlyVotingComponentProps = {
	event: EventResponseData;
	ballot: BallotResponseData;
};
