import type { Component } from 'svelte';
import type {
	DisplayOnlyVotingComponentProps,
	ResultComponentProps,
	VotingComponentProps
} from './types';

//Star
import StarVoting from './components/star/StarVoting.svelte';
import StarResults from './components/star/StarResults.svelte';
import StarDisplayVote from './components/star/StarDisplayVote.svelte';

//Ranked Choice
import RankedChoiceVoting from './components/ranked-choice/RankedChoiceVoting.svelte';
import RankedChoiceResults from './components/ranked-choice/RankedChoiceResults.svelte';
import RankedChoiceDisplayVote from './components/ranked-choice/RankedChoiceDisplayVote.svelte';

//Plurality
import PluralityVoting from './components/plurality/PluralityVoting.svelte';
import PluralityResults from './components/plurality/PluralityResults.svelte';
import PluralityDisplayVote from './components/plurality/PluralityDisplayVote.svelte';

export type VotingConfigItem = {
	label: string;
	voting: Component<VotingComponentProps>;
	displayOnlyVote: Component<DisplayOnlyVotingComponentProps>;
	results: Component<ResultComponentProps>;
};

const config: Record<string, VotingConfigItem> = {
	ST: {
		label: 'Star',
		voting: StarVoting,
		results: StarResults,
		displayOnlyVote: StarDisplayVote
	},
	RC: {
		label: 'Ranked Choice',
		voting: RankedChoiceVoting,
		results: RankedChoiceResults,
		displayOnlyVote: RankedChoiceDisplayVote
	},
	PL: {
		label: 'Plurality',
		voting: PluralityVoting,
		results: PluralityResults,
		displayOnlyVote: PluralityDisplayVote
	}
} as const;

export type VotingSystem = keyof typeof config;

export default config;
