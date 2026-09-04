import type { BallotResponseData } from './api/events';
import type { EventContext } from '$lib/types';
import { createContext } from 'svelte';

export type BallotsContext = {
	ballots: BallotResponseData[] | null;
};

export const [getBallotsContext, setBallotsContext] = createContext<BallotsContext>();
export const [getEventContext, setEventContext] = createContext<EventContext>();
