import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { EventsAPI, type EventResponseData } from '$lib/api/events';
import type { StorageManager } from '$lib/storage/storage.svelte';

function reroute(message: string = '') {
	goto(resolve('/host/'), { replaceState: true, state: { message } });
}

export async function getEventFromParamOrReroute(
	searchParams: URLSearchParams,
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

export async function checkEventStageAndReroute(event: EventResponseData | null) {
	if (event?.closed) await goto(resolve(`/host/results?e=${event.id}`), { replaceState: true });
	else if (event?.allow_registration == true && event?.allow_voting == false)
		await goto(resolve(`/host/registration?e=${event.id}`), { replaceState: true });
	else if (event?.allow_voting == true)
		await goto(resolve(`/host/voting?e=${event.id}`), { replaceState: true });
}
