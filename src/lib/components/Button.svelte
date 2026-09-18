<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	const {
		variant = 'primary',
		type = 'button',
		href,
		onclick,
		disabled,
		class: classes,
		children
	}: {
		variant?: 'primary' | 'secondary' | 'danger';
		type?: HTMLButtonAttributes['type'];
		href?: Pathname;
		onclick?: () => void;
		disabled?: boolean;
		children: Snippet;
		class?: string;
	} = $props();

	// svelte-ignore non_reactive_update
	let variantClasses = '';

	// svelte-ignore state_referenced_locally
	switch (variant) {
		case 'primary':
			variantClasses = 'bg-primary-900 hover:bg-primary-600 disabled:hover:bg-primary-900';
			break;
		case 'secondary':
			variantClasses = 'bg-orange-700 hover:bg-orange-500 disabled:hover:bg-orange-700';
			break;
		case 'danger':
			variantClasses = 'bg-red-800 hover:bg-red-600 disabled:hover:bg-red-800';
			break;
	}
</script>

{#if href}
	<a
		href={resolve(href)}
		class="rounded-lg px-4 py-2 text-center text-white no-underline {variantClasses} {classes}"
	>
		{@render children()}
	</a>
{:else}
	<button
		{type}
		{disabled}
		{onclick}
		class="cursor-pointer rounded-lg px-4 py-2 text-center
        text-white disabled:cursor-not-allowed disabled:text-gray-400 {variantClasses} {classes}"
	>
		{@render children()}
	</button>
{/if}
