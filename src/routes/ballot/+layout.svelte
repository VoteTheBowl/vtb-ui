<script lang="ts">
	import { setBallotContext, setEventContext } from '#lib/context.js';
	import type { BallotContext, EventContext } from '#lib/types.js';

	const { children } = $props();

	let eventContext: EventContext = $state({ event: null });
	let ballotContext: BallotContext = $state({ ballot: null });
	setEventContext(eventContext);
	setBallotContext(ballotContext);
</script>

{@render children()}
