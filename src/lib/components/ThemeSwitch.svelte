<script lang="ts">
	import { getThemePreferenceContext } from '$lib/components/ThemeContextProvider.svelte';
	import { fly } from 'svelte/transition';
	import Icon from './Icon.svelte';

	let { class: classes }: { class?: string } = $props();

	const themePreferenceContext = getThemePreferenceContext();

	let checked = $derived(themePreferenceContext.preference === 'dark');

	function onchange(e: Event & { currentTarget: HTMLInputElement }) {
		if (e.currentTarget.checked) {
			themePreferenceContext.preference = 'dark';
			localStorage.setItem('theme', 'dark');
		} else {
			themePreferenceContext.preference = 'light';
			localStorage.setItem('theme', 'light');
		}
	}
</script>

<label class="group max-w-fit cursor-pointer rounded-md {classes}">
	<span class="sr-only">Dark Mode</span>
	<input type="checkbox" role="switch" {checked} {onchange} class="group h-0 w-0 focus:outline-0" />
	<div
		class="relative box-content h-8 w-8 overflow-clip rounded-full bg-blue-300 outline-blue-500
            transition-colors duration-400 group-focus-within:outline-2 dark:bg-gray-800"
	>
		{#if checked}
			<div
				in:fly={{ x: '-100%' }}
				out:fly={{ x: '100%' }}
				class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1"
			>
				<Icon icon="moon" class="h-6! w-6! fill-white text-white" />
			</div>
		{:else}
			<div
				in:fly={{ x: '-100%' }}
				out:fly={{ x: '100%' }}
				class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1.5"
			>
				<Icon icon="sun" class="h-5! w-5! fill-amber-600! text-amber-600" />
			</div>
		{/if}
	</div>
</label>
