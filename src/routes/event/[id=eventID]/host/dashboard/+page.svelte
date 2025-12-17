<script lang="ts">
	import { page } from '$app/state';
	import { Heading, P } from 'flowbite-svelte';
	import { hostTokenStorage } from '$lib/token-util';
	import { onMount, getContext, onDestroy } from 'svelte';
	import { EventsAPI } from '$lib/api/events';
	import type { HostContext } from '../type';
	import { RESULTS_REFRESH_DELAY } from '$lib/const';

	const eventID = $derived(Number(page.params.id));
	let token: string = $state('');

	const hostContext: HostContext = getContext('host-context');

	const submittedBallots = $derived(hostContext.ballots.filter((ballot) => ballot.submitted));
	const unsubmittedBallots = $derived(hostContext.ballots.filter((ballot) => !ballot.submitted));

	let timeoutID: NodeJS.Timeout;

	const getBallots = async () => {
		if (!page.params.id) return;
		const api = new EventsAPI();
		hostContext.ballots = await api.listBallots(eventID, token);
		clearTimeout(timeoutID);
		timeoutID = setTimeout(getBallots, RESULTS_REFRESH_DELAY);
	};

	onMount(async () => {
		token = hostTokenStorage.getToken(eventID);
		getBallots();
	});

	onDestroy(() => {
		clearTimeout(timeoutID);
	});
</script>

<Heading tag="h2" class="my-8 text-center">Dashboard</Heading>

{#if unsubmittedBallots.length > 0}
	<Heading tag="h3" class="my-2 text-center">Unsubmitted Ballots</Heading>
	<ul class="text-center">
		{#each unsubmittedBallots as ballot (ballot.id)}
			<li>{ballot.voter_name}</li>
		{/each}
	</ul>
{/if}

{#if submittedBallots.length > 0}
	<Heading tag="h3" class="my-2 text-center">Submitted Ballots</Heading>
	<ul class="text-center">
		{#each submittedBallots as ballot (ballot.id)}
			<li>{ballot.voter_name}</li>
		{/each}
	</ul>
{/if}

{#if submittedBallots.length === 0 && unsubmittedBallots.length === 0}
	<P class="text-center">No ballots available.</P>
{/if}
