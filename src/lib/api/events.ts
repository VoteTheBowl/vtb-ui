import { BaseAPI } from './base';

export type EventCreateRequestData = {
	name: string;
	choices: string[];
	electoral_system: string;
};

export type EventResponseData = {
	id: number;
	name: string;
	choices: string[];
	electoral_system: string;
	share_token: string;
	show_results: boolean;
};

export type EventCreateResponseData = EventResponseData & {
	host_token: string;
};

export type BallotResponseData = {
	id: number;
	voter_name: string;
	vote: Record<string, unknown> | unknown[];
	created: string;
	submitted: null | string;
};

export type BallotCreateResponseData = {
	ballot_id: number;
	ballot_token: string;
};

export class EventsAPI extends BaseAPI {
	endpoint: string = '/vote/event';

	getEvent = async (id: number, token: string) => {
		return this.get(`/${id}?token=${token}`) as Promise<EventResponseData>;
	};

	createEvent = async (data: EventCreateRequestData) => {
		return this.post('/create', data) as Promise<EventCreateResponseData>;
	};

	closeEvent = async (eventID: number, host_token: string) => {
		return this.post(`/${eventID}/close?host_token=${host_token}`);
	};

	openEvent = async (eventID: number, host_token: string) => {
		return this.post(`/${eventID}/open?host_token=${host_token}`);
	};

	showResults = async (eventID: number, host_token: string) => {
		return this.post(`/${eventID}/show-results?host_token=${host_token}`);
	};

	hideResults = async (eventID: number, host_token: string) => {
		return this.post(`/${eventID}/hide-results?host_token=${host_token}`);
	};

	listBallots = async (eventID: number, token: string) => {
		return this.get(`/${eventID}/ballots?token=${token}`) as Promise<BallotResponseData[]>;
	};

	createBallot = async (eventID: number, name: string, shareToken: string) => {
		return this.post(
			`/${eventID}/create-ballot?voter_name=${name}&share_token=${shareToken}`
		) as Promise<BallotCreateResponseData>;
	};
}

export class BallotAPI extends BaseAPI {
	endpoint: string = '/vote/ballot';

	submitBallot = async (ballotID: number, token: string, submission: unknown) => {
		return this.post(`/${ballotID}/submit?token=${token}`, { vote: submission });
	};

	getBallot = async (ballotID: number, token: string) => {
		return this.get(`/${ballotID}?token=${token}`) as Promise<BallotResponseData>;
	};

	getBallotFromToken = async (token: string) => {
		return this.get(`/from-token?token=${token}`) as Promise<BallotResponseData>;
	};
}
