<script lang="ts">
	import { setThemePreferenceContext, type ThemePreferenceContext } from '$lib/context';
	import { onMount } from 'svelte';

	const { children } = $props();

	const themePrferenceContext: ThemePreferenceContext = $state({
		preference: localStorage.getItem('theme')
	});

	onMount(() => {
		setThemePreferenceContext(themePrferenceContext);
	});
</script>

{@render children()}
