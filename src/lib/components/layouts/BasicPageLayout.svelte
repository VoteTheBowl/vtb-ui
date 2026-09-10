<script lang="ts">
	import logo from '$lib/assets/logo.png';
	import { DarkMode } from 'flowbite-svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { ArrowLeftOutline } from 'flowbite-svelte-icons';
	import { fade } from 'svelte/transition';
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	let {
		children,
		title = 'Vote The Bowl',
		subtitle = '',
		subtitleURL = '',
		class: className = ''
	}: {
		children: Snippet;
		title?: string;
		subtitle?: string;
		subtitleURL?: string;
		class?: ClassValue;
	} = $props();

	let ref = $derived(page.url.searchParams.get('ref'));
	let refName = $derived(page.url.searchParams.get('ref-name'));
</script>

<svelte:head>
	<title>{title} | Vote The Bowl</title>
</svelte:head>

<header>
	<div class="bg-primary-900 text-white dark:text-gray-200">
		<div class="relative m-auto mx-auto p-4 sm:max-w-lg">
			<h1 class="flex min-h-9 items-center gap-4 leading-none">
				<a href={resolve('/')}>
					<img src={logo} alt="" aria-hidden="true" class="h-8 w-8 rounded-full" />
				</a>
				{title}
				<span class="sr-only"> - {subtitle}</span>
			</h1>
			<DarkMode
				size="sm"
				class="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer rounded-md bg-primary-900 p-2 text-gray-200 hover:bg-primary-700 dark:text-gray-200 dark:hover:bg-primary-700"
			/>
		</div>
	</div>
	{#if subtitle}
		<div class="m-auto mx-auto px-4 sm:max-w-lg">
			<div class="rounded-b-2xl bg-secondary-900 px-4 py-1">
				{#if subtitleURL}
					<!-- eslint-disable-next-line svelte/no-navigation-without-resolve-->
					<a class="h3 text-white" href={subtitleURL}>
						{subtitle}
					</a>
				{:else}
					<span class="h3 text-white">{subtitle}</span>
				{/if}
			</div>
		</div>
	{/if}
	{#if ref}
		<nav class=" bg-primary-600 text-white">
			<div class="m-auto mx-auto p-1 px-4 sm:max-w-lg">
				<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
				<a href={ref}>
					<ArrowLeftOutline class="inline" /> Back{refName ? ` to ${refName}` : ''}
				</a>
			</div>
		</nav>
	{/if}
</header>
<main class="m-auto p-4 sm:max-w-lg {className}" in:fade>
	{@render children()}
</main>
