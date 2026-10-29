<script lang="ts">
	import type { VotingConfigItem } from '#lib/voting-system/config.js';
	import type { Results } from '#lib/voting-system/types.js';

	const { result, config }: { result?: Results; config: VotingConfigItem } = $props();
</script>

{#if config && result}
	<config.results {result} />
{:else}
	Config Error!
{/if}
