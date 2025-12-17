import type { Component } from 'svelte';

//Plurality
import PluralityVoting from './components/plurality/PluralityVoting.svelte';
import PluralityResults from './components/plurality/PluralityResults.svelte';

//Star
import StarVoting from './components/star/StarVoting.svelte';
import StarResults from './components/star/StarResults.svelte';
import type { ResultComponentProps, VotingComponentProps } from './types';

const config: {
	id: string;
	label: string;
	voting: Component<VotingComponentProps>;
	results: Component<ResultComponentProps>;
}[] = [
	{ id: 'PL', label: 'Plurality', voting: PluralityVoting, results: PluralityResults },
	{ id: 'ST', label: 'Star', voting: StarVoting, results: StarResults }
] as const;

export default config;
