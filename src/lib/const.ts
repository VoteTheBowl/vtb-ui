import { env } from '$env/dynamic/public';

export const RESULTS_REFRESH_DELAY = Number(env.PUBLIC_REFRESH_DELAY ?? 3000);
