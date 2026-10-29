import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sentrySvelteKit } from '@sentry/sveltekit';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import pkg from './package.json' with { type: 'json' };

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			org: 'jesudas-joseph',
			project: 'vote-the-bowl-ui',
			telemetry: false
		}),
		tailwindcss(),
		sveltekit({
			// Consult https://svelte.dev/docs/kit/integrations
			// for more information about preprocessors
			preprocess: vitePreprocess(),
			paths: { relative: false },
			adapter: adapter(),
			prerender: {
				handleUnseenRoutes: (details) => {
					if (details.routes.every((route) => route.includes('[dev=dev]'))) {
						console.log('Dropping [dev=dev] routes.');
					} else {
						throw Error('Could not prerender unseen routes:\n' + details.routes.join('\n'));
					}
				}
			},
			experimental: {}
		})
	],
	define: {
		'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version)
	},
	server: {
		host: 'localhost',
		port: 5173,
		proxy: {
			'/api': 'http://localhost:8000'
		}
	}
});
