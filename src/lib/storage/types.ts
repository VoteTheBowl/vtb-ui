export type StorageData<T> = { version: number } & T;

export type StorageSchemaV1 = {
	events: Record<
		number,
		{
			name: string;
			token: string;
		}
	> | null;
	ballots: Record<
		number,
		{
			eventID: number;
			token: string;
		}
	> | null;
};

export type CurrentStorageSchema = StorageSchemaV1;
