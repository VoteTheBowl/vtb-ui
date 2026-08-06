<script lang="ts">
	import SavedBallotList from '$lib/components/SavedBallotList.svelte';
	import SavedEventList from '$lib/components/SavedEventList.svelte';
	import { Button } from 'flowbite-svelte';
</script>

<div class="p-4">
	<h2 class="page-title mb-8">Your Dashboard</h2>

	<div class="mb-8">
		<h3 class="subheading mb-4">Events</h3>
		<SavedEventList />
	</div>
	<div>
		<h3 class="subheading mb-4">Ballots</h3>
		<SavedBallotList />
	</div>

	<Button href="/" class="w-full">Back to Home</Button>
</div>
