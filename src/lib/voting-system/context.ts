import { createContext } from 'svelte';
import type { StarSubmissionType } from './components/star/types';
import type { PluralitySubmissionType } from './components/plurality/types';
import type { RankedSubmissionType } from './components/ranked-choice/types';

export interface SubmissionContext {
	submission: StarSubmissionType | PluralitySubmissionType | RankedSubmissionType | null;
	submissionIsValid: boolean;
}

export const [getSubmissionContext, setSubmissionContext] = createContext<SubmissionContext>();
