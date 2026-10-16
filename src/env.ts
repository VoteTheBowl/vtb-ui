import { defineEnvVars } from '@sveltejs/kit/env';

// @migration-task Review usage of dynamic environment variables. They fall back to the empty string if not present, which may not be what you want.
export const variables = defineEnvVars({
	PUBLIC_API_URL: { public: true, schema: (input) => input ?? '' },
	PUBLIC_REFRESH_DELAY: {
		public: true,
		schema: (input) => {
			const delay = Number(input);
			if (isNaN(delay)) return 3000;
			else return delay;
		}
	},
	PUBLIC_VOTER_REFRESH_DELAY: {
		public: true,
		schema: (input) => {
			const delay = Number(input);
			if (isNaN(delay)) return 5000;
			else return delay;
		}
	}
});
