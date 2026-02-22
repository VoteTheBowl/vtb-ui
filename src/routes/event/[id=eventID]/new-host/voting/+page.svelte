<script>
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from 'flowbite-svelte';
	import { ArrowRightOutline, ArrowLeftOutline } from 'flowbite-svelte-icons';

	let eventID = $derived(Number(page.params.id));
</script>

<div class="flex w-full gap-6">
	<Button
		size="xl"
		color="red"
		onclick={() => {
			goto(`/event/${eventID}/new-host/registration`);
		}}
	>
		<ArrowLeftOutline class="me-2 h-5 w-5" /> Registration
	</Button>
	<Button
		size="xl"
		color="blue"
		onclick={() => {
			goto(`/event/${eventID}/new-host/results`);
		}}
	>
		Close Voting <ArrowRightOutline class="ms-2 h-5 w-5" />
	</Button>
</div>
