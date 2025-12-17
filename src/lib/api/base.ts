type ParseReturn = 'JSON'; // Add other parsing options as needed

export class APIError extends Error {
	status?: number;
	statusText?: string;

	constructor(status?: number, statusText?: string, message?: string) {
		super(message || `API Error: ${status} ${statusText}`);
		this.status = status;
		this.statusText = statusText;
	}
}

type ResponseJSON = { [key: string]: unknown } | [unknown];

export class BaseAPI {
	private baseUrl: string = '/api';
	endpoint: string = '';
	fetch: typeof globalThis.fetch;

	constructor(newFetch?: typeof globalThis.fetch) {
		if (newFetch) {
			this.fetch = newFetch;
		} else {
			this.fetch = fetch;
		}
	}

	parseResponse = async (
		response: Response,
		parseReturn: ParseReturn = 'JSON'
	): Promise<ResponseJSON | Response> => {
		if (response.ok) {
			switch (parseReturn) {
				case 'JSON':
					return response.json();
				default:
					return response;
			}
		} else {
			let message: string | undefined = undefined;
			try {
				message = await response?.json();
			} catch {
				/* ignore */
			}

			throw new APIError(response.status, response.statusText, message);
		}
	};

	get = async (
		endpoint: string,
		headers: HeadersInit = {},
		parseReturn: ParseReturn = 'JSON'
	): Promise<ResponseJSON | Response> => {
		let response = undefined;
		try {
			response = await this.fetch(this.baseUrl + this.endpoint + endpoint, {
				headers
			});
		} catch (error) {
			throw new APIError(response?.status, response?.statusText, (error as Error).message);
		}

		return this.parseResponse(response, parseReturn);
	};

	post = async (
		endpoint: string,
		data: unknown = null,
		headers: HeadersInit = {},
		parseReturn: ParseReturn = 'JSON'
	): Promise<ResponseJSON | Response> => {
		let response = undefined;
		try {
			response = await this.fetch(this.baseUrl + this.endpoint + endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...headers
				},
				body: JSON.stringify(data)
			});
		} catch (error) {
			throw new APIError(response?.status, response?.statusText, (error as Error).message);
		}

		return this.parseResponse(response, parseReturn);
	};
}
