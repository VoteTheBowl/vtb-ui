<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import { fade } from 'svelte/transition';

	const {
		title,
		children,
		icon,
		class: className
	}: { title: string; children: Snippet; icon?: Snippet; class?: ClassValue } = $props();
</script>

<div class="min-w-80 pt-4.5 pr-4.5 {className}" in:fade>
	<div
		class="relative rounded-2xl border-3 border-black p-4 transition-colors duration-150 dark:border-white"
	>
		<h3
			class="absolute bottom-full translate-y-1/3 bg-white px-2 transition-colors duration-150 dark:bg-gray-800"
		>
			{title}
		</h3>

		{#if icon}
			<div
				class="absolute bottom-full left-full -translate-x-2/3 translate-y-2/3 rounded-full border-3 border-black bg-white px-3 py-3 transition-colors duration-150 dark:border-white dark:bg-gray-800 dark:text-white"
			>
				{@render icon()}
			</div>
		{/if}

		{@render children()}
	</div>
</div>
