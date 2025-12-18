import { BaseAPI } from './base';

type VersionResponse = {
	version: string;
};

export class InfoAPI extends BaseAPI {
	endpoint: string = '/';

	getVersion = async () => {
		return this.get('version') as Promise<VersionResponse>;
	};
}
