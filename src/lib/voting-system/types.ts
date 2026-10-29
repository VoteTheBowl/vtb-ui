import type { EventResponseData } from '#lib/api/events.js';
import type { PluralityResultType, PluralitySubmissionType } from './components/plurality/types';
import type { RankedResultType } from './components/ranked-choice/types';
import type { StarResultType, StarSubmissionType } from './components/star/types';

export type VotingComponentProps = {
	event: EventResponseData;
};

export type Results = PluralityResultType | StarResultType | RankedResultType | null;
export type Submissions = PluralitySubmissionType | StarSubmissionType | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ResultComponentProps<T = any> = {
	result: T;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface DisplayOnlyVotingComponentProps<T = any> {
	event: EventResponseData;
	submission: T;
}
