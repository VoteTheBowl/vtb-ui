import type { CurrentStorageSchema, StorageData, StorageSchemaV1 } from './types';
import { BallotAPI, EventsAPI } from '$lib/api/events';
import { createContext } from 'svelte';

class ErrorBallotNotFound extends Error {
	constructor(ballotID: number) {
		super(`Ballot with ID ${ballotID} not found in storage.`);
		this.name = 'ErrorBallotNotFound';
	}
}

class ErrorEventNotFound extends Error {
	constructor(eventID: number) {
		super(`Event with ID ${eventID} not found in storage.`);
		this.name = 'ErrorEventNotFound';
	}
}

class ErrorBallotWithEventIDNotFound extends Error {
	constructor(eventID: number) {
		super(`Ballot with Event ID ${eventID} not found in storage.`);
		this.name = 'ErrorBallotWithEventIDNotFound';
	}
}

async function convertNoSchemaToVersionV1(): Promise<StorageData<StorageSchemaV1>> {
	const hostTokensString = localStorage.getItem('host-tokens');
	const voterTokensString = localStorage.getItem('voter-tokens');

	const data: StorageSchemaV1 = { events: null, ballots: null };

	const promises = [];

	if (hostTokensString) {
		const tokens = JSON.parse(hostTokensString) as Record<number, string>;

		data.events = {};

		const api = new EventsAPI();

		for (const id in tokens) {
			promises.push(
				(async () => {
					const eventID = Number(id);

					const event = await api.getEvent(eventID, tokens[id]);

					if (data.events) {
						data.events[eventID] = {
							name: event.name,
							token: tokens[id]
						};
					}
				})()
			);
		}
	}

	if (voterTokensString) {
		const tokens = JSON.parse(voterTokensString) as Record<number, string>;

		data.ballots = {};

		const api = new BallotAPI();

		for (const id in tokens) {
			promises.push(
				(async () => {
					const eventID = Number(id);

					const ballot = await api.getBallotFromToken(tokens[id]);

					if (data.ballots) {
						data.ballots[ballot.id] = {
							eventID,
							token: tokens[id]
						};
					}
				})()
			);
		}
	}

	try {
		await Promise.all(promises);
	} catch (e) {
		console.error('Error migrating storage from no schema to version 1:', e);
	}

	localStorage.removeItem('host-tokens');
	localStorage.removeItem('voter-tokens');

	return { version: 1, ...data };
}

export class StorageManager {
	version = 1; //Current version
	localStorageKey: string;
	data: StorageData<CurrentStorageSchema> = { version: 0, events: null, ballots: null };

	constructor(localStorageKey: string) {
		this.localStorageKey = localStorageKey;
	}

	init = async () => {
		this.data = await this.loadStorage();
	};

	getBallot(ballotID: number) {
		if (!this.data.ballots) throw new ErrorBallotNotFound(ballotID);
		if (ballotID in this.data.ballots) return this.data.ballots[ballotID];
		else throw new ErrorBallotNotFound(ballotID);
	}

	getBallotIDFromEventID(eventID: number) {
		if (!this.data.ballots) throw new ErrorBallotWithEventIDNotFound(eventID);
		for (const ballotID in this.data.ballots) {
			const ballot = this.data.ballots[ballotID];
			if (ballot.eventID === eventID) {
				return ballotID;
			}
		}
		throw new ErrorBallotWithEventIDNotFound(eventID);
	}

	getEvent(eventID: number) {
		if (!this.data.events) throw new ErrorEventNotFound(eventID);
		if (eventID in this.data.events) return this.data.events[eventID];
		else throw new ErrorEventNotFound(eventID);
	}

	saveBallot(ballotID: number, eventID: number, token: string) {
		if (!this.data.ballots) {
			this.data.ballots = {};
		}
		this.data.ballots[ballotID] = { eventID, token };
		this.saveStorage(this.data);
	}

	saveEvent(eventID: number, name: string, token: string) {
		if (!this.data.events) {
			this.data.events = {};
		}
		this.data.events[eventID] = { name, token };
		this.saveStorage(this.data);
	}

	async migrate<T = unknown>(data: StorageData<T>): Promise<StorageData<CurrentStorageSchema>> {
		let migratedData: StorageData<unknown> = { ...data };

		switch (data.version) {
			default:
				throw new Error(`Unsupported storage version: ${data.version}`);
			case 0:
				migratedData = await convertNoSchemaToVersionV1();
		}

		return migratedData as StorageData<CurrentStorageSchema>;
	}

	async loadStorage() {
		const storageString = localStorage.getItem(this.localStorageKey);

		if (
			!storageString &&
			(localStorage.getItem('host-tokens') || localStorage.getItem('voter-tokens'))
		) {
			const migratedData: StorageData<CurrentStorageSchema> = await this.migrate({
				version: 0,
				events: null,
				ballots: null
			});
			this.saveStorage(migratedData);
			return migratedData;
		} else if (!storageString) {
			const newData: StorageData<CurrentStorageSchema> = {
				version: this.version,
				events: null,
				ballots: null
			};
			this.saveStorage(newData);
			return newData;
		} else {
			const storageData: StorageData<unknown> = JSON.parse(storageString);
			if (storageData.version !== this.version) {
				const migratedData: StorageData<CurrentStorageSchema> = await this.migrate(storageData);
				this.saveStorage(migratedData);
				return migratedData;
			} else {
				return storageData as StorageData<CurrentStorageSchema>;
			}
		}
	}

	saveStorage(data: StorageData<CurrentStorageSchema>) {
		localStorage.setItem(this.localStorageKey, JSON.stringify(data));
	}
}

export const [getStorageContext, setStorageContext] = createContext<StorageManager>();
