import { createContext } from 'svelte';

export interface SubmissionContext {
	submission: Record<string, unknown> | unknown[] | undefined;
	submissionIsValid: boolean;
}

export const [getSubmissionContext, setSubmissionContext] = createContext<SubmissionContext>();
