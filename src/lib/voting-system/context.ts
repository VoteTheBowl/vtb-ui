import { createContext } from 'svelte';

export interface SubmissionContext {
	submission: Record<string, unknown> | unknown[] | null;
	submissionIsValid: boolean;
}

export const [getSubmissionContext, setSubmissionContext] = createContext<SubmissionContext>();
