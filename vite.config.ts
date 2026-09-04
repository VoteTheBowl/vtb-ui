import { sentrySvelteKit } from '@sentry/sveltekit';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import pkg from './package.json';

export default defineConfig({
	plugins: [
		sentrySvelteKit({
			org: 'jesudas-joseph',
			project: 'vote-the-bowl-ui'
		}),
		tailwindcss(),
		sveltekit()
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
