import { defineEnvVars } from '@sveltejs/kit/env';

// @migration-task Review usage of dynamic environment variables. They fall back to the empty string if not present, which may not be what you want.
export const variables = defineEnvVars({
	PUBLIC_API_URL: { public: true, schema: (input) => input ?? '' },
	PUBLIC_REFRESH_DELAY: {
		public: true,
		schema: (input) => {
			if (input === undefined) {
				return 3000;
			}

			const value = Number(input);
			if (isNaN(value)) throw new Error('Expected a number for PUBLIC_REFRESH_DELAY');
			return value;
		}
	},
	PUBLIC_VOTER_REFRESH_DELAY: {
		public: true,
		schema: (input) => {
			if (input === undefined) {
				return 5000;
			}

			const value = Number(input);
			if (isNaN(value)) throw new Error('Expected a number for PUBLIC_REFRESH_DELAY');
			return value;
		}
	}
});
