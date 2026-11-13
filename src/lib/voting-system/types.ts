import type { EventResponseData } from '#lib/api/events.js';
import type { PluralityResultType, PluralitySubmissionType } from './components/plurality/types';
import type { RankedResultType } from './components/ranked-choice/types';
import type { StarResultType, StarSubmissionType } from './components/star/types';

export type VotingComponentProps = {
	event: EventResponseData;
};

export type Results = PluralityResultType | StarResultType | RankedResultType | null;
export type Submissions = PluralitySubmissionType | StarSubmissionType | null;

export type ResultComponentProps = {
	event: EventResponseData;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DisplayOnlyVotingComponentProps<T = any> {
	event: EventResponseData;
	submission: T;
}
