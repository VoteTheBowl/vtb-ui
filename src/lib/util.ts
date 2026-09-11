import type { Pathname } from '$app/types';
import type { EventResponseData } from './api/events';

export function getEventURL(event: EventResponseData): Pathname {
	if (event?.closed) return `/host/event/results?e=${event.id}`;
	else if (event?.allow_registration == true && event?.allow_voting == false)
		return `/host/event/registration?e=${event.id}`;
	else if (event?.allow_voting == true) return `/host/event/voting?e=${event.id}`;
	else return '/host';
}

export function getBallotURL(event: EventResponseData, ballotID: number): Pathname {
	if (event?.closed) return `/ballot/results?b=${ballotID}`;
	else if (event?.allow_registration == true && event?.allow_voting == false)
		return `/ballot?b=${ballotID}`;
	else if (event?.allow_voting == true) return `/ballot/voting?b=${ballotID}`;
	else return '/';
}

export function getEventStage(event: EventResponseData) {
	if (!event.closed) {
		if (event.allow_voting) {
			return 'Open';
		} else if (event.allow_registration) {
			return 'Registration';
		}
	}
	return 'Closed';
}
