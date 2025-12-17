import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { EventsAPI } from '$lib/api/events';
import { APIError } from '$lib/api/base';

export const load: PageLoad = async ({ url, fetch }) => {
	const eventID = Number(url.searchParams.get('e'));
	const shareToken = url.searchParams.get('s');

	if (!shareToken || isNaN(eventID)) {
		error(400, 'Invalid Share URL');
	}
	const api = new EventsAPI(fetch);

	try {
		return await api.getEvent(eventID, shareToken);
	} catch (e: unknown) {
		if (e instanceof APIError && e.status) {
			switch (e.status) {
				case 403:
					throw error(404, 'Event Not Found');
				default:
					throw error(e.status, e.statusText);
			}
		} else {
			throw error(500, 'An unknown error occurred.');
		}
	}
};
