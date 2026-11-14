<script lang="ts">
	const {
		hideLabel,
		label,
		alias,
		class: classes
	}: { hideLabel: boolean; label: string; alias: string | undefined; class?: string } = $props();
</script>

<p>
	{#if hideLabel}
		{alias}
	{:else if alias}
		{label}
		<span class="text-base whitespace-nowrap text-gray-600 italic dark:text-gray-400 {classes}">
			({alias})
		</span>
	{:else}
		{label}
	{/if}
</p>
