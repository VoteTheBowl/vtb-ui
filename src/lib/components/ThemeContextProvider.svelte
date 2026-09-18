<script module>
	import { browser } from '$app/env';
	import { createContext } from 'svelte';

	export type ThemePreferenceContext = {
		preference: 'dark' | 'light' | null;
	};
	export const [getThemePreferenceContext, setThemePreferenceContext] =
		createContext<ThemePreferenceContext>();
</script>

<script lang="ts">
	const { children } = $props();

	if (browser) {
		const localTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
		const systemPref = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

		let themePreferenceContext = $state({
			preference: localTheme || systemPref
		});

		setThemePreferenceContext(themePreferenceContext);

		if (localTheme === 'dark' || systemPref === 'dark')
			document.documentElement.classList.add('dark');

		$effect(() => {
			if (themePreferenceContext.preference === 'dark')
				document.documentElement.classList.add('dark');
			else document.documentElement.classList.remove('dark');
		});
	}
</script>

{@render children()}
