export type StarSubmissionType = Record<string, number> | null;

export type StarResultType = {
	scores: { choice: string; score: number }[];
	gold: string[];
	silver: string[];
	bronze: string[];
};
