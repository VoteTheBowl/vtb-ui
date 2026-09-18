<script lang="ts">
	let { children, dialog = $bindable() } = $props();
</script>

<dialog
	closedby="any"
	bind:this={dialog}
	class="fixed top-auto -bottom-4 left-1/2 min-w-80 -translate-x-1/2 -translate-y-1/2 flex-col gap-4
    rounded-2xl border-3 border-black bg-gray-100 p-4 backdrop:bg-white/95 open:flex
    sm:top-1/2 sm:bottom-auto dark:border-white dark:bg-gray-800 dark:backdrop:bg-gray-500/95"
>
	{@render children()}
</dialog>
