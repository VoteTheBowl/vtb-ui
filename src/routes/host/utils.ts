import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { EventsAPI, type EventResponseData } from '#lib/api/events.js';
import type { StorageManager } from '#lib/storage/storage.svelte.js';
import type { ReadonlyURLSearchParams } from '$app/state';

function reroute(message: string = '') {
	goto(resolve('host/'), { replaceState: true, state: { message } });
}

export async function getEventFromParamOrReroute(
	searchParams: ReadonlyURLSearchParams,
	storage: StorageManager,
	client: EventsAPI
) {
	const eventID = Number(searchParams.get('e'));

	if (!eventID || isNaN(eventID)) {
		reroute();
		return null;
	}

	let event: EventResponseData | undefined;

	try {
		event = await client.getEvent(eventID, storage.getEvent(eventID).token);
	} catch (e: unknown) {
		console.error(e);
		reroute('Failed to fetch event.');
		return null;
	}

	return event;
}
