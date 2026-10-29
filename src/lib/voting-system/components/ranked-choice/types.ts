export type RankedSubmissionType = string[] | null;

export type RankedResultType = {
	rounds: { tally: Record<string, number>; exhausted: number }[];
	winner: string;
};
