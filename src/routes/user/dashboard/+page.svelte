<script lang="ts">
	import BasicPageLayout from '$lib/components/layouts/BasicPageLayout.svelte';
	import SavedBallotList from '$lib/components/SavedBallotList.svelte';
	import SavedEventList from '$lib/components/SavedEventList.svelte';
	import { Button } from 'flowbite-svelte';
</script>

<BasicPageLayout title="Dashboard">
	<div class="mb-8">
		<h2 class="subheading mb-4">Events</h2>
		<SavedEventList />
	</div>
	<div>
		<h2 class="subheading mb-4">Ballots</h2>
		<SavedBallotList />
	</div>

	<Button href="/" class="w-full">Back to Home</Button>
</BasicPageLayout>
