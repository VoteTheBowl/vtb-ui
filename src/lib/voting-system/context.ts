import { createContext } from 'svelte';
import type { StarSubmissionType } from './components/star/types';
import type { PluralitySubmissionType } from './components/plurality/types';

export interface SubmissionContext {
	submission: StarSubmissionType | PluralitySubmissionType | null;
	submissionIsValid: boolean;
}

export const [getSubmissionContext, setSubmissionContext] = createContext<SubmissionContext>();
