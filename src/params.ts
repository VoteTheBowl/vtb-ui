import { defineParams } from '@sveltejs/kit/params';
//import { building } from '$app/env';

const matchDev = (param: string) => {
	return param.includes('dev');
};

export const params = defineParams({
	dev: (param) => (matchDev(param) ? param : undefined)
});
