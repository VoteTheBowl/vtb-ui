import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import pkg from './package.json';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
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
