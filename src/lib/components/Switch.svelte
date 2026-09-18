<script lang="ts">
	import type { ChangeEventHandler } from 'svelte/elements';

	let {
		label,
		checked = $bindable(false),
		onchange
	}: {
		label: string;
		checked: boolean;
		onchange?: ChangeEventHandler<HTMLInputElement> | null;
	} = $props();
</script>

<label class="group max-w-fit cursor-pointer rounded-md">
	<input
		type="checkbox"
		role="switch"
		bind:checked
		{onchange}
		class="group h-0 w-0 focus:outline-0"
	/>
	<div class="flex cursor-pointer flex-row items-center gap-2 rounded-md">
		<span>{label}</span>
		<div
			class="relative box-content h-4 w-8 rounded-full border-3 border-gray-800 bg-gray-800
            group-focus-within:outline-2 group-focus-within:outline-blue-500 dark:border-white dark:bg-white"
		>
			<div
				class="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white transition-all
                 dark:bg-gray-800 {checked ? 'right-0' : 'right-full translate-x-full'}"
			></div>
		</div>
		<div aria-hidden="true" class="select-none">{checked ? 'On' : 'Off'}</div>
	</div>
</label>
