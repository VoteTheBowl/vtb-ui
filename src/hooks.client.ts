import type { HandleFetch, HandleClientError } from '@sveltejs/kit/hooks';
import { dev } from '$app/env';
import { PUBLIC_API_URL } from '$app/env/public';
import { handleErrorWithSentry } from '@sentry/sveltekit';
import * as Sentry from '@sentry/sveltekit';

if (!dev) {
	Sentry.init({
		dsn: 'https://1bf124d933cc69a3dd293b1b81384768@o4511135136743424.ingest.us.sentry.io/4512026580090880',

		dataCollection: {
			// To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
			// https://docs.sentry.io/platforms/javascript/guides/sveltekit/configuration/options/#dataCollection
			// userInfo: false,
			// httpBodies: [],
		}
	});
}

export const handleFetch: HandleFetch = async ({ event, request, fetch }) => {
	if (event.url.pathname.startsWith('/api') && PUBLIC_API_URL) {
		request = new Request(`${PUBLIC_API_URL}${event.url.pathname}`, request);
	}
	return await fetch(request);
};

const handleClientError: HandleClientError = async (input) => {
	return input;
};

// If you have a custom error handler, pass it to `handleErrorWithSentry`
export const handleError = dev ? handleClientError : handleErrorWithSentry();
