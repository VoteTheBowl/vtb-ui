<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	const {
		type = 'button',
		href,
		onclick,
		disabled,
		secondary,
		class: classes,
		children
	}: {
		type?: HTMLButtonAttributes['type'];
		href?: Pathname;
		onclick?: () => void;
		disabled?: boolean;
		secondary?: boolean;
		children: Snippet;
		class?: string;
	} = $props();
</script>

{#if href}
	<a
		href={resolve(href)}
		class="rounded-lg bg-primary-900 px-4 py-2 text-center text-white no-underline hover:bg-primary-600 {classes}"
	>
		{@render children()}
	</a>
{:else}
	<button
		{type}
		{disabled}
		{onclick}
		class="cursor-pointer rounded-lg px-4 py-2 text-center
        text-white disabled:cursor-not-allowed disabled:text-gray-400
         {secondary
			? 'bg-orange-700 hover:bg-orange-500 disabled:hover:bg-orange-700'
			: 'bg-primary-900 hover:bg-primary-600 disabled:hover:bg-primary-900'}
            {classes}"
	>
		{@render children()}
	</button>
{/if}
