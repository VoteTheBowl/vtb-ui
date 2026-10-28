import type { Component } from 'svelte';
import type {
	DisplayOnlyVotingComponentProps,
	ResultComponentProps,
	VotingComponentProps
} from './types';

//Ranked Choice
import RankedChoiceVoting from './components/ranked-choice/RankedChoiceVoting.svelte';
import RankedChoiceResults from './components/ranked-choice/RankedChoiceResults.svelte';
import RankedChoiceDisplayVote from './components/ranked-choice/RankedChoiceDisplayVote.svelte';

//Plurality
import PluralityVoting from './components/plurality/PluralityVoting.svelte';
import PluralityResults from './components/plurality/PluralityResults.svelte';
import PluralityDisplayVote from './components/plurality/PluralityDisplayVote.svelte';

//Star
import StarVoting from './components/star/StarVoting.svelte';
import StarResults from './components/star/StarResults.svelte';
import StarDisplayVote from './components/star/StarDisplayVote.svelte';

export type VotingConfigItem = {
	id: string;
	label: string;
	voting: Component<VotingComponentProps>;
	displayOnlyVote: Component<DisplayOnlyVotingComponentProps>;
	results: Component<ResultComponentProps>;
};

const config: VotingConfigItem[] = [
	{
		id: 'RC',
		label: 'Ranked Choice',
		voting: RankedChoiceVoting,
		results: RankedChoiceResults,
		displayOnlyVote: RankedChoiceDisplayVote
	},
	{
		id: 'PL',
		label: 'Plurality',
		voting: PluralityVoting,
		results: PluralityResults,
		displayOnlyVote: PluralityDisplayVote
	},
	{
		id: 'ST',
		label: 'Star',
		voting: StarVoting,
		results: StarResults,
		displayOnlyVote: StarDisplayVote
	}
] as const;

export default config;
