<script lang="ts">
	import { Button, Modal, P } from 'flowbite-svelte';
	import type { Snippet } from 'svelte';

	let {
		open = $bindable(),
		heading = 'Confirm',
		confirmationButtonLabel = 'Yes',
		cancelButtonLabel = 'No',
		children,
		oncancel,
		onconfirm
	}: {
		open: boolean;
		heading?: string;
		confirmationButtonLabel?: string;
		cancelButtonLabel?: string;
		children: Snippet;
		oncancel?: () => void;
		onconfirm?: () => void;
	} = $props();
</script>

<Modal
	bind:open
	permanent
	size="none"
	bodyClass="grow-1 flex items-center justify-center "
	footerClass="justify-center"
	class="justify-between md:max-w-md"
>
	{#snippet header()}
		{heading}
	{/snippet}
	<P>{@render children()}</P>
	{#snippet footer()}
		<Button
			class="grow"
			onclick={() => {
				open = false;
				if (onconfirm) {
					onconfirm();
				}
			}}
		>
			{confirmationButtonLabel}
		</Button>
		<Button
			class="grow"
			color="red"
			onclick={() => {
				open = false;
				if (oncancel) {
					oncancel();
				}
			}}
		>
			{cancelButtonLabel}
		</Button>
	{/snippet}
</Modal>
