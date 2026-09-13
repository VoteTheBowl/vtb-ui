import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		paths: {
			relative: false
		},
		adapter: adapter(),
		prerender: {
			handleUnseenRoutes: (details) => {
				if (details.routes.every((route) => route.includes('[dev=dev]'))) {
					console.log('Dropping [dev=dev] routes.');
				} else {
					throw Error('Could not prerender unseen routes:\n', details.routes.join('\n'));
				}
			}
		},
		experimental: {
			tracing: {
				server: false
			},

			instrumentation: {
				server: true
			}
		}
	}
};

export default config;
