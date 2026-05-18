import { BaseAPI } from './base';

export type EventCreateRequestData = {
	name: string;
	choices: string[];
	electoral_system: string;
	allow_registration?: boolean;
	allow_voting?: boolean;
};

export type EventStatus = 'RE' | 'VO' | 'CL';

export type EventResponseData = {
	id: number;
	name: string;
	choices: string[];
	allow_registration: boolean;
	allow_voting: boolean;
	electoral_system: string;
	share_token: string;
	show_results: boolean;
	closed: null | string;
};

export type EventCreateResponseData = EventResponseData & {
	host_token: string;
};

export type EventUpdateBody = {
	allow_registration?: boolean;
	allow_voting?: boolean;
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
		return this.get(`/${id}`, { 'X-API-Key': token }) as Promise<EventResponseData>;
	};

	createEvent = async (data: EventCreateRequestData) => {
		return this.post('/create', data) as Promise<EventCreateResponseData>;
	};

	closeEvent = async (eventID: number, host_token: string) => {
		return this.post(`/${eventID}/close`, null, { 'X-API-Key': host_token }) as Promise<{
			closed: string;
		}>;
	};

	openEvent = async (eventID: number, host_token: string) => {
		return this.post(`/${eventID}/open`, null, { 'X-API-Key': host_token });
	};

	showResults = async (eventID: number, host_token: string) => {
		return this.post(`/${eventID}/show-results`, null, { 'X-API-Key': host_token });
	};

	hideResults = async (eventID: number, host_token: string) => {
		return this.post(`/${eventID}/hide-results`, null, { 'X-API-Key': host_token });
	};

	listBallots = async (eventID: number, token: string) => {
		return this.get(`/${eventID}/ballots`, { 'X-API-Key': token }) as Promise<BallotResponseData[]>;
	};

	createBallot = async (eventID: number, name: string, shareToken: string) => {
		return this.post(`/${eventID}/create-ballot?voter_name=${name}`, null, {
			'X-API-Key': shareToken
		}) as Promise<BallotCreateResponseData>;
	};

	update = async (eventID: number, token: string, body: EventUpdateBody) => {
		return this.patch(`/${eventID}/update`, body, {
			'X-API-Key': token
		}) as Promise<EventResponseData>;
	};
}

export class BallotAPI extends BaseAPI {
	endpoint: string = '/vote/ballot';

	submitBallot = async (ballotID: number, token: string, submission: unknown) => {
		return this.post(
			`/${ballotID}/submit`,
			{ vote: submission },
			{ 'X-API-Key': token }
		) as Promise<BallotResponseData>;
	};

	getBallot = async (ballotID: number, token: string) => {
		return this.get(`/${ballotID}`, { 'X-API-Key': token }) as Promise<BallotResponseData>;
	};
}
