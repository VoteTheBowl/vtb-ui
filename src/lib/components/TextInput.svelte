<script lang="ts">
	const {
		id,
		placeholder = undefined,
		value,
		required = false,
		oninput
	}: {
		id: string;
		placeholder?: string;
		value: string | null | undefined;
		required?: boolean;
		oninput?: (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => void;
	} = $props();

	const empty = $derived(!value && required);
</script>

<input
	class={empty ? 'border-b-2 border-b-red-600' : ''}
	type="text"
	{id}
	{placeholder}
	{value}
	oninput={(e) => {
		oninput?.(e);
	}}
	{required}
/>
