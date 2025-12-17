import type { Component } from 'svelte';

//Ranked Choice
import RankedChoiceVoting from './components/ranked-choice/RankedChoiceVoting.svelte';
import RankedChoiceResults from './components/ranked-choice/RankedChoiceResults.svelte';

//Plurality
import PluralityVoting from './components/plurality/PluralityVoting.svelte';
import PluralityResults from './components/plurality/PluralityResults.svelte';

//Star
import StarVoting from './components/star/StarVoting.svelte';
import StarResults from './components/star/StarResults.svelte';

const config: { id: string; label: string; voting: Component; results: Component }[] = [
	{ id: 'RC', label: 'Ranked Choice', voting: RankedChoiceVoting, results: RankedChoiceResults },
	{ id: 'PL', label: 'Plurality', voting: PluralityVoting, results: PluralityResults },
	{ id: 'ST', label: 'Star', voting: StarVoting, results: StarResults }
] as const;

export default config;
