<script lang="ts">
	import SavedBallotList from '$lib/components/SavedBallotList.svelte';
	import SavedEventList from '$lib/components/SavedEventList.svelte';
	import { Button, Heading } from 'flowbite-svelte';
</script>

<div class="p-4">
	<Heading tag="h2" class="mb-6">Your Dashboard</Heading>

	<div class="mb-8">
		<Heading tag="h3" class="mb-4">Events</Heading>
		<SavedEventList />
	</div>
	<div>
		<Heading tag="h3" class="mb-4">Ballots</Heading>
		<SavedBallotList />
	</div>

	<Button href="/" class="w-full">Back to Home</Button>
</div>
