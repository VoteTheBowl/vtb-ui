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
			class="relative box-content h-5 w-9 rounded-full border-2 border-black bg-white
            group-focus-within:outline-2 group-focus-within:outline-blue-500 dark:border-white dark:bg-gray-800"
		>
			<div
				class="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-white bg-black transition-all
                dark:border-3 dark:border-gray-800 dark:bg-white {checked
					? 'right-0'
					: 'right-full translate-x-full'}"
			></div>
		</div>
		<div aria-hidden="true" class="select-none">{checked ? 'On' : 'Off'}</div>
	</div>
</label>
