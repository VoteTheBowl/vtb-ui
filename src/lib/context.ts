import type { BallotResponseData } from './api/events';
import type { BallotContext, EventContext } from '$lib/types';
import { createContext } from 'svelte';

export type BallotsContext = {
	ballots: BallotResponseData[] | null;
};

export type ThemePreferenceContext = {
	preference: string | null;
};
export const [getThemePreferenceContext, setThemePreferenceContext] =
	createContext<ThemePreferenceContext>();

export const [getBallotsContext, setBallotsContext] = createContext<BallotsContext>();
export const [getBallotContext, setBallotContext] = createContext<BallotContext>();
export const [getEventContext, setEventContext] = createContext<EventContext>();
