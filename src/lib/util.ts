import type { EventResponseData } from './api/events';

export function getEventStage(event: EventResponseData) {
	if (!event.closed) {
		if (event.allow_voting) {
			return 'voting';
		} else if (event.allow_registration) {
			return 'registration';
		}
	}
	return 'closed';
}
